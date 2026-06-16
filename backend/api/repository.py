"""数据仓库 - JSON 文件存储"""
import json
import os
from pathlib import Path
from typing import Optional

DATA_DIR = Path(__file__).parent.parent / "data"


def _ensure_dir():
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def _read_json(filename: str) -> Optional[list | dict]:
    _ensure_dir()
    filepath = DATA_DIR / filename
    if not filepath.exists():
        return None
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return None


def _write_json(filename: str, data):
    _ensure_dir()
    filepath = DATA_DIR / filename
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


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
