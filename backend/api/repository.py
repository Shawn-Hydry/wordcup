"""数据仓库 - 内存存储（兼容 Vercel Serverless 只读文件系统）

Vercel Serverless 环境无持久化写入能力，采用内存缓存策略：
- 首次请求从种子数据初始化
- 写操作仅在内存中生效（冷启动后重置）
- 本地开发时仍使用 JSON 文件持久化
"""
import json
import os
import tempfile
from pathlib import Path
from typing import Optional

# 检测是否在 Vercel Serverless 环境
IS_VERCEL = os.environ.get("VERCEL") == "1"

# 本地开发：使用项目 data 目录
LOCAL_DATA_DIR = Path(__file__).parent.parent / "data"

# Vercel 环境：使用 /tmp（可写但冷启动丢失）
VERCEL_DATA_DIR = Path(tempfile.gettempdir()) / "wordcup_data"

DATA_DIR = VERCEL_DATA_DIR if IS_VERCEL else LOCAL_DATA_DIR

# ============ 内存缓存 ============
_memory_store: dict[str, list | dict] = {}


def _ensure_dir():
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def _read_json(filename: str) -> Optional[list | dict]:
    # 优先从内存缓存读取
    if filename in _memory_store:
        return _memory_store[filename]

    _ensure_dir()
    filepath = DATA_DIR / filename
    if filepath.exists():
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
                _memory_store[filename] = data
                return data
        except (json.JSONDecodeError, OSError):
            pass
    return None


def _write_json(filename: str, data):
    # 写入内存缓存
    _memory_store[filename] = data

    # 尝试写入文件（本地开发持久化 / Vercel /tmp 缓存）
    try:
        _ensure_dir()
        filepath = DATA_DIR / filename
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except OSError:
        # Vercel 只读文件系统下静默忽略
        pass


# ============ 比赛数据 CRUD ============

async def get_matches_by_date(date: str) -> list[dict]:
    all_matches = _read_json("matches.json") or []
    return [m for m in all_matches if m.get("matchDate") == date]


async def get_all_matches() -> list[dict]:
    return _read_json("matches.json") or []


async def save_match(match: dict) -> dict:
    all_matches = _read_json("matches.json") or []
    idx = next((i for i, m in enumerate(all_matches) if m["id"] == match["id"]), -1)
    if idx >= 0:
        all_matches[idx] = match
    else:
        all_matches.append(match)
    _write_json("matches.json", all_matches)
    return match


# ============ 预测数据 ============

async def get_full_prediction(match_id: str) -> dict:
    matches = _read_json("matches.json") or []
    match = next((m for m in matches if m["id"] == match_id), None)
    predictions = _read_json("predictions.json") or []
    prediction = next((p for p in predictions if p.get("matchId") == match_id), None)
    return {"match": match, "prediction": prediction}


async def save_prediction(prediction: dict) -> dict:
    all_preds = _read_json("predictions.json") or []
    idx = next((i for i, p in enumerate(all_preds) if p.get("matchId") == prediction["matchId"]), -1)
    if idx >= 0:
        all_preds[idx] = prediction
    else:
        all_preds.append(prediction)
    _write_json("predictions.json", all_preds)
    return prediction


# ============ 外部预测 ============

async def get_external_predictions(match_id: str) -> list[dict]:
    all_ext = _read_json("external_predictions.json") or []
    return [p for p in all_ext if p.get("matchId") == match_id]


async def save_external_predictions(match_id: str, predictions: list[dict]) -> list[dict]:
    all_ext = _read_json("external_predictions.json") or []
    filtered = [p for p in all_ext if p.get("matchId") != match_id]
    new_items = [{"matchId": match_id, **p} for p in predictions]
    _write_json("external_predictions.json", filtered + new_items)
    return predictions


# ============ 球员状态 ============

async def get_player_status(match_id: str) -> Optional[dict]:
    all_ps = _read_json("player_status.json") or []
    return next((p for p in all_ps if p.get("matchId") == match_id), None)


async def save_player_status(match_id: str, status_data: dict) -> dict:
    all_ps = _read_json("player_status.json") or []
    idx = next((i for i, p in enumerate(all_ps) if p.get("matchId") == match_id), -1)
    entry = {"matchId": match_id, **status_data}
    if idx >= 0:
        all_ps[idx] = entry
    else:
        all_ps.append(entry)
    _write_json("player_status.json", all_ps)
    return status_data
