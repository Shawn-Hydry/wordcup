"""定时数据更新服务

功能：
1. 爬取最新完赛结果（比分、进球、红黄牌等）
2. 根据最新数据重算所有未开赛比赛的预测
3. 更新球员状态数据

运行方式：
- 本地：python -m api.updater
- 定时：由 APScheduler / GitHub Actions 触发
- 手动：POST /api/admin/refresh
"""
import asyncio
import json
import os
from datetime import datetime
from typing import Optional

import httpx

from .engine import engine
from .aggregator import generate_external_predictions
from .repository import (
    get_all_matches, save_match, save_prediction,
    save_external_predictions, save_player_status, _memory_store,
)
from .seed_data import seed_matches, seed_player_data, seed_stats

# Vercel Serverless 环境检测
IS_VERCEL = os.environ.get("VERCEL") == "1"

# FIFA API 端点
FIFA_MATCHES_API = "https://www.fifa.com/api/hub/matches"
FIFA_MATCH_DETAIL_API = "https://www.fifa.com/api/hub/match/{match_id}"


async def _fetch_fifa_matches() -> list[dict]:
    """从 FIFA API 获取比赛结果列表"""
    async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client:
        try:
            resp = await client.get(
                FIFA_MATCHES_API,
                params={"competitionId": "17", "seasonId": "2026"},
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"},
            )
            if resp.status_code != 200:
                print(f"[Updater] FIFA API 返回 {resp.status_code}")
                return []
            data = resp.json()
            return data.get("matches", data.get("results", []))
        except Exception as e:
            print(f"[Updater] FIFA API 请求失败: {e}")
            return []


async def _fetch_fifa_match_detail(match_id: str) -> Optional[dict]:
    """从 FIFA API 获取单场比赛详情（进球、红黄牌等时间轴）"""
    async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client:
        try:
            url = FIFA_MATCH_DETAIL_API.format(match_id=match_id)
            resp = await client.get(
                url,
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"},
            )
            if resp.status_code != 200:
                return None
            data = resp.json()
            # 提取时间轴事件
            timeline = []
            for event in data.get("events", data.get("timeline", [])):
                evt = {
                    "type": event.get("type", "").lower(),
                    "minute": event.get("minute", event.get("time", 0)),
                    "player": event.get("player", {}).get("name", event.get("playerName", "")),
                    "team": event.get("team", event.get("side", "")),
                }
                if evt["type"] in ("goal", "yellow_card", "red_card", "own_goal", "penalty"):
                    timeline.append(evt)
            return {"timeline": timeline} if timeline else None
        except Exception as e:
            print(f"[Updater] FIFA 详情请求失败: {e}")
            return None


def _parse_fifa_match(raw: dict) -> Optional[dict]:
    """将 FIFA API 原始数据解析为统一格式"""
    try:
        home = raw.get("home", raw.get("homeTeam", {}))
        away = raw.get("away", raw.get("awayTeam", {}))
        score = raw.get("score", {})

        status_map = {"played": "finished", "live": "live", "upcoming": "upcoming"}
        raw_status = raw.get("status", raw.get("matchStatus", "")).lower()
        status = status_map.get(raw_status, "upcoming")

        match = {
            "id": raw.get("id", raw.get("matchId", "")),
            "homeTeam": {"id": home.get("id", ""), "name": home.get("name", home.get("displayName", ""))},
            "awayTeam": {"id": away.get("id", ""), "name": away.get("name", away.get("displayName", ""))},
            "status": status,
            "date": raw.get("date", raw.get("matchDate", "")),
        }

        if status == "finished" and score:
            home_score = score.get("home", score.get("total", {}).get("home", 0))
            away_score = score.get("away", score.get("total", {}).get("away", 0))
            match["result"] = {
                "homeScore": home_score,
                "awayScore": away_score,
                "timeline": [],
            }

        return match
    except Exception as e:
        print(f"[Updater] 解析 FIFA 数据失败: {e}")
        return None


async def update_finished_results() -> dict:
    """第一步：爬取所有已完赛比赛的最新结果

    尝试从 FIFA API 获取数据，
    如果爬取失败则保留现有种子数据不变。
    """
    print(f"[Updater] ===== 开始更新完赛结果 {datetime.utcnow().isoformat()}Z =====")

    scraped_matches = []

    # 尝试从 FIFA API 爬取
    try:
        raw_matches = await _fetch_fifa_matches()
        for raw in raw_matches:
            parsed = _parse_fifa_match(raw)
            if parsed:
                scraped_matches.append(parsed)
        print(f"[Updater] FIFA API 返回 {len(scraped_matches)} 场比赛")
    except Exception as e:
        print(f"[Updater] FIFA API 爬取失败: {e}")

    # 合并爬取数据与现有数据
    updated_count = 0
    current_matches = await get_all_matches()

    if scraped_matches:
        # 按 ID 合并：爬取数据覆盖现有数据
        existing_map = {m["id"]: m for m in current_matches}
        for scraped in scraped_matches:
            mid = scraped["id"]
            if mid in existing_map:
                # 合并：更新状态和结果
                existing = existing_map[mid]
                if scraped.get("status") == "finished" and existing.get("status") != "finished":
                    existing["status"] = "finished"
                    if scraped.get("result"):
                        existing["result"] = scraped["result"]
                    updated_count += 1
                    print(f"[Updater] 新完赛: {mid} {scraped['homeTeam']['name']} vs {scraped['awayTeam']['name']}")
            else:
                # 新比赛
                existing_map[mid] = scraped

        current_matches = list(existing_map.values())
        for match in current_matches:
            await save_match(match)
    else:
        print("[Updater] 爬取无数据，保留现有种子数据")

    # 对已完赛但无结果详情的比赛，尝试逐场获取详情
    detail_count = 0
    for match in current_matches:
        if match.get("status") == "finished" and match.get("result"):
            result = match["result"]
            # 检查是否有时间轴数据（进球详情）
            if not result.get("timeline") or len(result.get("timeline", [])) == 0:
                try:
                    detail = await _fetch_fifa_match_detail(match["id"])
                    if detail:
                        result.update(detail)
                        await save_match(match)
                        detail_count += 1
                        print(f"[Updater] 补充比赛详情: {match['id']}")
                except Exception as e:
                    print(f"[Updater] 获取 {match['id']} 详情失败: {e}")

    summary = {
        "totalMatches": len(current_matches),
        "newlyFinished": updated_count,
        "detailsUpdated": detail_count,
        "scrapedFrom": "fifa" if scraped_matches else "seed_data",
    }
    print(f"[Updater] 完赛结果更新完成: {summary}")
    return summary


async def recalculate_predictions() -> dict:
    """第二步：根据最新数据重算所有未开赛比赛的预测

    基于已完赛结果更新统计数据，然后重新生成预测。
    """
    print(f"[Updater] ===== 开始重算预测 {datetime.utcnow().isoformat()}Z =====")

    matches = await get_all_matches()
    finished = [m for m in matches if m.get("status") == "finished"]
    upcoming = [m for m in matches if m.get("status") == "upcoming"]

    print(f"[Updater] 已完赛: {len(finished)}, 未开赛: {len(upcoming)}")

    # 从已完赛结果中提取各队最新统计数据
    team_form = _extract_team_form(finished)

    recalculated = 0
    for match in upcoming:
        match_id = match["id"]
        home_id = match["homeTeam"]["id"]
        away_id = match["awayTeam"]["id"]

        # 合并种子统计 + 实时统计
        base_stats = seed_stats.get(match_id, {})
        live_stats = _build_live_stats(match, team_form, base_stats)

        # 1. AI 预测引擎
        prediction = engine.generate(match, live_stats)
        await save_prediction(prediction)

        # 2. 外部预测聚合
        externals = generate_external_predictions(match, prediction)
        await save_external_predictions(match_id, externals)

        # 3. 球员状态（基于种子数据，如果有实时数据则更新）
        players = seed_player_data.get(match_id, {"homePlayers": [], "awayPlayers": []})
        # 根据已完赛表现更新球员状态
        players = _update_player_form(players, home_id, away_id, team_form)
        await save_player_status(match_id, players)

        recalculated += 1

    summary = {
        "finishedMatches": len(finished),
        "upcomingRecalculated": recalculated,
    }
    print(f"[Updater] 预测重算完成: {summary}")
    return summary


async def run_full_update() -> dict:
    """执行完整更新流程"""
    print(f"[Updater] ========== 开始完整数据更新 ==========")
    result1 = await update_finished_results()
    result2 = await recalculate_predictions()
    return {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "resultsUpdate": result1,
        "predictionsUpdate": result2,
    }


# ============ 辅助函数 ============

def _extract_team_form(finished_matches: list[dict]) -> dict[str, dict]:
    """从已完赛结果中提取各队近期表现

    Returns:
        {teamId: {recent: [W/D/L], goalsScored: int, goalsConceded: int, yellowCards: int, redCards: int}}
    """
    form = {}
    for match in finished_matches:
        result = match.get("result")
        if not result:
            continue

        home_id = match["homeTeam"]["id"]
        away_id = match["awayTeam"]["id"]
        hs, aw = result["homeScore"], result["awayScore"]

        # 主队
        if home_id not in form:
            form[home_id] = {"recent": [], "goalsScored": 0, "goalsConceded": 0}
        form[home_id]["goalsScored"] += hs
        form[home_id]["goalsConceded"] += aw
        if hs > aw:
            form[home_id]["recent"].append("W")
        elif hs < aw:
            form[home_id]["recent"].append("L")
        else:
            form[home_id]["recent"].append("D")

        # 客队
        if away_id not in form:
            form[away_id] = {"recent": [], "goalsScored": 0, "goalsConceded": 0}
        form[away_id]["goalsScored"] += aw
        form[away_id]["goalsConceded"] += hs
        if aw > hs:
            form[away_id]["recent"].append("W")
        elif aw < hs:
            form[away_id]["recent"].append("L")
        else:
            form[away_id]["recent"].append("D")

        # 解析时间轴中的红黄牌
        for event in result.get("timeline", []):
            event_type = event.get("type", "")
            team_side = event.get("team", "")
            team_id = home_id if team_side == "home" else away_id
            if team_id not in form:
                form[team_id] = {"recent": [], "goalsScored": 0, "goalsConceded": 0}
            if event_type == "yellow_card":
                form[team_id].setdefault("yellowCards", 0)
                form[team_id]["yellowCards"] += 1
            elif event_type == "red_card":
                form[team_id].setdefault("redCards", 0)
                form[team_id]["redCards"] += 1

    # 只保留最近5场
    for tid in form:
        form[tid]["recent"] = form[tid]["recent"][-5:]

    return form


def _build_live_stats(match: dict, team_form: dict, base_stats: dict) -> dict:
    """合并种子统计 + 实时统计"""
    home_id = match["homeTeam"]["id"]
    away_id = match["awayTeam"]["id"]

    stats = {**base_stats}

    # 用实时数据覆盖近期战绩
    home_form = team_form.get(home_id, {})
    away_form = team_form.get(away_id, {})

    if home_form.get("recent"):
        stats["homeRecent"] = home_form["recent"]
    if away_form.get("recent"):
        stats["awayRecent"] = away_form["recent"]

    # 计算场均进球
    if home_form.get("goalsScored"):
        games = len(home_form.get("recent", [])) or 1
        stats["homeGoalsAvg"] = round(home_form["goalsScored"] / games, 1)
    if away_form.get("goalsScored"):
        games = len(away_form.get("recent", [])) or 1
        stats["awayGoalsAvg"] = round(away_form["goalsScored"] / games, 1)

    # 红黄牌影响
    if home_form.get("redCards"):
        stats["homeInjuries"] = home_form["redCards"]
    if away_form.get("redCards"):
        stats["awayInjuries"] = away_form["redCards"]

    return stats


def _update_player_form(players: dict, home_id: str, away_id: str, team_form: dict) -> dict:
    """根据已完赛数据更新球员状态"""
    # 基于红黄牌标记伤病/停赛风险
    home_reds = team_form.get(home_id, {}).get("redCards", 0)
    away_reds = team_form.get(away_id, {}).get("redCards", 0)

    for player in players.get("homePlayers", []):
        if home_reds > 0 and player.get("isStarPlayer"):
            if not player.get("injury"):
                player["injury"] = {"status": "risk", "description": "队内有红牌停赛风险"}
                home_reds -= 1
                if home_reds <= 0:
                    break

    for player in players.get("awayPlayers", []):
        if away_reds > 0 and player.get("isStarPlayer"):
            if not player.get("injury"):
                player["injury"] = {"status": "risk", "description": "队内有红牌停赛风险"}
                away_reds -= 1
                if away_reds <= 0:
                    break

    return players


# ============ CLI 入口 ============

if __name__ == "__main__":
    asyncio.run(run_full_update())
