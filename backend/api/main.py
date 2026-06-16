"""FastAPI 入口 + API 路由"""
import os
import time
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware

from .engine import engine
from .aggregator import generate_external_predictions
from .repository import (
    get_matches_by_date, get_all_matches, save_match,
    get_full_prediction, save_prediction,
    save_external_predictions, save_player_status,
)
from .seed_data import seed_matches, seed_player_data, seed_stats
from .updater import run_full_update

# APScheduler：仅在非 Serverless 环境（本地开发）中启用
IS_VERCEL = os.environ.get("VERCEL") == "1"
scheduler = None

if not IS_VERCEL:
    try:
        from apscheduler.schedulers.asyncio import AsyncIOScheduler
        from apscheduler.triggers.cron import CronTrigger

        scheduler = AsyncIOScheduler(timezone="Asia/Shanghai")
        scheduler.add_job(
            run_full_update,
            trigger=CronTrigger(hour="14,18,22", minute=0),
            id="daily_update",
            name="每日数据更新（爬取完赛+重算预测）",
            replace_existing=True,
        )
        print("[Scheduler] APScheduler 已配置（本地模式）")
    except ImportError:
        print("[Scheduler] APScheduler 未安装，定时任务不可用")
        scheduler = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期：启动时初始化数据 + 启动定时任务（仅本地），关闭时停止"""
    # Startup
    from .repository import _memory_store
    if "matches.json" not in _memory_store:
        for match in seed_matches:
            await save_match(match)
    if scheduler:
        scheduler.start()
        print("[Scheduler] 已启动，定时任务: 14:00 / 18:00 / 22:00 (北京时间)")
    else:
        print("[Scheduler] Serverless 模式，定时任务由 GitHub Actions 触发")
    yield
    # Shutdown
    if scheduler:
        scheduler.shutdown()
        print("[Scheduler] 已关闭")


app = FastAPI(title="世界杯预测 API", version="1.0.0", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 请求日志中间件
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    ms = int((time.time() - start) * 1000)
    print(f"{request.method} {request.url.path} {response.status_code} {ms}ms")
    return response


# ============ 根路径欢迎页 ============

@app.get("/")
async def root():
    scheduler_info = {"mode": "serverless", "note": "定时任务由 GitHub Actions 触发"}
    if scheduler:
        scheduler_info = {
            "mode": "local",
            "timezone": "Asia/Shanghai",
            "jobs": [
                {"id": j.id, "name": j.name, "next_run": str(j.next_run_time)}
                for j in scheduler.get_jobs()
            ],
        }
    return {
        "name": "2026世界杯预测 API",
        "version": "1.0.0",
        "scheduler": scheduler_info,
        "endpoints": {
            "健康检查": "GET /health",
            "比赛列表": "GET /api/matches?date=YYYY-MM-DD",
            "比赛详情": "GET /api/matches/{match_id}",
            "完整预测": "GET /api/predict/{match_id}/full",
            "初始化数据": "POST /api/admin/seed",
            "手动刷新": "POST /api/admin/refresh",
        },
    }


# ============ 健康检查 ============

@app.get("/health")
async def health():
    return {"status": "ok", "uptime": time.time(), "timestamp": __import__("datetime").datetime.utcnow().isoformat() + "Z"}


# ============ 比赛接口 ============

@app.get("/api/matches")
async def list_matches(date: str | None = Query(None)):
    """按日期查询比赛，不传则返回全部"""
    try:
        if date:
            matches = await get_matches_by_date(date)
        else:
            matches = await get_all_matches()
        return {"success": True, "data": matches}
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.get("/api/matches/{match_id}")
async def get_match(match_id: str):
    """获取单场比赛详情"""
    try:
        result = await get_full_prediction(match_id)
        if not result["match"]:
            return {"success": False, "error": "比赛不存在"}
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ============ 预测接口 ============

@app.get("/api/predict/{match_id}/full")
async def predict_full(match_id: str):
    """获取完整预测数据"""
    try:
        result = await get_full_prediction(match_id)
        match = result["match"]
        if not match:
            return {"success": False, "error": "比赛不存在"}

        # 1. AI 预测引擎
        stats = seed_stats.get(match_id, {})
        prediction = engine.generate(match, stats)

        # 2. 外部预测聚合
        externals = generate_external_predictions(match, prediction)

        # 3. 球员状态
        players = seed_player_data.get(match_id, {"homePlayers": [], "awayPlayers": []})

        # 4. 持久化
        await save_prediction(prediction)
        await save_external_predictions(match_id, externals)
        await save_player_status(match_id, players)

        return {
            "success": True,
            "data": {
                "match": match,
                "winPrediction": {
                    "homeWinProb": prediction["homeWinProb"],
                    "drawProb": prediction["drawProb"],
                    "awayWinProb": prediction["awayWinProb"],
                    "upsetProb": prediction["upsetProb"],
                    "upsetLevel": prediction["upsetLevel"],
                    "tacticalAnalysis": prediction["tacticalAnalysis"],
                    "coachComparison": prediction["coachComparison"],
                    "keyFactors": prediction["keyFactors"],
                },
                "playerStatus": players,
                "scorePrediction": prediction["scorePrediction"],
                "externalPredict": {"matchId": match_id, "predictions": externals},
                "generatedAt": prediction["generatedAt"],
            },
        }
    except Exception as e:
        print(f"[Predict] Error: {e}")
        return {"success": False, "error": str(e)}


# ============ 管理后台接口 ============

@app.post("/api/admin/seed")
async def admin_seed():
    """初始化种子数据"""
    try:
        results = []
        for match in seed_matches:
            await save_match(match)

            stats = seed_stats.get(match["id"], {})
            prediction = engine.generate(match, stats)
            await save_prediction(prediction)

            externals = generate_external_predictions(match, prediction)
            await save_external_predictions(match["id"], externals)

            players = seed_player_data.get(match["id"], {"homePlayers": [], "awayPlayers": []})
            await save_player_status(match["id"], players)

            results.append({"id": match["id"], "home": match["homeTeam"]["name"], "away": match["awayTeam"]["name"]})

        return {"success": True, "message": f"已初始化 {len(results)} 场比赛", "data": results}
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.post("/api/admin/matches")
async def admin_add_match(match: dict):
    """手动录入比赛"""
    try:
        if not match.get("id") or not match.get("homeTeam") or not match.get("awayTeam"):
            return {"success": False, "error": "缺少必填字段"}
        saved = await save_match(match)
        return {"success": True, "data": saved}
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.post("/api/admin/refresh")
async def admin_refresh():
    """手动触发数据更新（爬取完赛结果 + 重算预测）"""
    try:
        result = await run_full_update()
        return {"success": True, "data": result}
    except Exception as e:
        print(f"[Refresh] Error: {e}")
        return {"success": False, "error": str(e)}


@app.get("/api/admin/scheduler")
async def admin_scheduler_status():
    """查看定时任务状态"""
    if not scheduler:
        return {
            "success": True,
            "data": {
                "running": False,
                "mode": "serverless",
                "note": "Vercel Serverless 环境不支持持久定时任务，请使用 GitHub Actions 触发",
            },
        }
    jobs = scheduler.get_jobs()
    return {
        "success": True,
        "data": {
            "running": scheduler.running,
            "mode": "local",
            "timezone": "Asia/Shanghai",
            "jobs": [
                {
                    "id": j.id,
                    "name": j.name,
                    "nextRun": str(j.next_run_time),
                    "trigger": str(j.trigger),
                }
                for j in jobs
            ],
        },
    }
