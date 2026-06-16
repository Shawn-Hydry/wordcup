"""多源数据合并 + 校验"""
from typing import Optional
from scraper.fifa import fetch_match_schedule, fetch_match_result
from scraper.flashscore import fetch_match_results
from api.seed_data import seed_matches
import json
from pathlib import Path


def merge_matches(fifa_data: list[dict], flashscore_data: list[dict]) -> list[dict]:
    """合并 FIFA + FlashScore 数据

    规则：
    1. 以 FIFA 数据为主源
    2. FlashScore 作为验证源，比对比分一致性
    3. 冲突时以 FIFA 为准
    4. FlashScore 有而 FIFA 没有的数据作为补充
    """
    # 按 homeTeam.name + awayTeam.name 建索引
    fs_index = {}
    for m in flashscore_data:
        key = f"{m.get('homeTeam', {}).get('name', '')}_{m.get('awayTeam', {}).get('name', '')}"
        fs_index[key] = m

    merged = []
    for fifa_match in fifa_data:
        key = f"{fifa_match.get('homeTeam', {}).get('name', '')}_{fifa_match.get('awayTeam', {}).get('name', '')}"
        fs_match = fs_index.get(key)

        # 以 FIFA 为主
        match = {**fifa_match}

        # 如果 FIFA 没有结果但 FlashScore 有，使用 FlashScore
        if not match.get("result") and fs_match and fs_match.get("result"):
            match["result"] = fs_match["result"]
            match["status"] = "finished"
            print(f"[Merge] {key}: 使用 FlashScore 结果")

        # 比对验证
        if match.get("result") and fs_match and fs_match.get("result"):
            fifa_score = (match["result"]["homeScore"], match["result"]["awayScore"])
            fs_score = (fs_match["result"]["homeScore"], fs_match["result"]["awayScore"])
            if fifa_score != fs_score:
                print(f"[Merge] ⚠️ 比分不一致 {key}: FIFA={fifa_score} FlashScore={fs_score} (以FIFA为准)")

        merged.append(match)

    # FlashScore 有而 FIFA 没有的
    merged_keys = {f"{m.get('homeTeam', {}).get('name', '')}_{m.get('awayTeam', {}).get('name', '')}" for m in merged}
    for fs_match in flashscore_data:
        key = f"{fs_match.get('homeTeam', {}).get('name', '')}_{fs_match.get('awayTeam', {}).get('name', '')}"
        if key not in merged_keys:
            merged.append(fs_match)
            print(f"[Merge] 补充 FlashScore 独有比赛: {key}")

    return merged


def merge_with_existing(new_matches: list[dict], existing_matches: list[dict]) -> list[dict]:
    """将新爬取的数据与现有数据合并

    规则：
    1. 已有比赛：更新 result 和 status（如果新数据有结果）
    2. 新比赛：追加
    3. 不覆盖已有的完整球队信息（flagUrl, fifaRank 等）
    """
    existing_index = {m["id"]: m for m in existing_matches}
    result = []

    for match in existing_matches:
        match_id = match["id"]
        # 查找新数据中是否有该比赛的结果
        new_match = _find_by_teams(match, new_matches)
        if new_match and new_match.get("result") and not match.get("result"):
            # 更新结果
            match = {**match, "result": new_match["result"], "status": "finished"}
            print(f"[Merge] 更新比赛结果: {match_id}")
        result.append(match)

    # 追加新比赛
    existing_keys = {m["id"] for m in result}
    for new_match in new_matches:
        if new_match.get("id") and new_match["id"] not in existing_keys:
            result.append(new_match)
            print(f"[Merge] 追加新比赛: {new_match['id']}")

    return result


def _find_by_teams(match: dict, candidates: list[dict]) -> Optional[dict]:
    """通过队名匹配查找"""
    home = match.get("homeTeam", {}).get("name", "")
    away = match.get("awayTeam", {}).get("name", "")
    for c in candidates:
        if c.get("homeTeam", {}).get("name") == home and c.get("awayTeam", {}).get("name") == away:
            return c
    return None


def save_merged_data(matches: list[dict], data_dir: str | Path):
    """保存合并后的数据到 JSON"""
    data_dir = Path(data_dir)
    data_dir.mkdir(parents=True, exist_ok=True)
    filepath = data_dir / "matches.json"
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(matches, f, ensure_ascii=False, indent=2)
    print(f"[Merge] 已保存 {len(matches)} 场比赛到 {filepath}")
