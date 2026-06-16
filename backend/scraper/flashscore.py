"""FlashScore 数据爬取 - 2026世界杯"""
import httpx
from bs4 import BeautifulSoup
from typing import Optional
import json
import asyncio


FLASHSCORE_BASE = "https://www.flashscore.com"
FLASHSCORE_WC = f"{FLASHSCORE_BASE}/football/world/world-championship/"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}


async def fetch_match_results(date: Optional[str] = None) -> list[dict]:
    """爬取 FlashScore 比赛结果

    Args:
        date: 指定日期 YYYY-MM-DD

    Returns:
        比赛结果列表
    """
    async with httpx.AsyncClient(headers=HEADERS, timeout=30, follow_redirects=True) as client:
        try:
            resp = await client.get(FLASHSCORE_WC)
            resp.raise_for_status()
        except httpx.HTTPError as e:
            print(f"[FlashScore] 请求失败: {e}")
            return []

    soup = BeautifulSoup(resp.text, "html.parser")
    matches = []

    # FlashScore 使用动态加载，这里提供解析框架
    # 实际可能需要使用 Selenium 或其内部 API
    match_elements = soup.select(".event__match, [data-testid='match']")

    for elem in match_elements:
        try:
            match = _parse_flashscore_match(elem)
            if match:
                matches.append(match)
        except Exception as e:
            continue

    if date:
        matches = [m for m in matches if m.get("matchDate") == date]

    print(f"[FlashScore] 爬取到 {len(matches)} 场比赛")
    return matches


async def fetch_via_internal_api(date: Optional[str] = None) -> list[dict]:
    """通过 FlashScore 内部 API 获取数据

    FlashScore 使用私有 API 端点加载数据，
    需要分析网络请求获取实际 API 地址。
    """
    # FlashScore 内部 API 示例（需要实际抓包确认）
    api_url = f"{FLASHSCORE_BASE}/api/v1/events/list"
    params = {
        "sportId": 1,  # 足球
        "tournamentId": "world-championship",
    }
    if date:
        params["date"] = date

    async with httpx.AsyncClient(headers=HEADERS, timeout=30) as client:
        try:
            resp = await client.get(api_url, params=params)
            resp.raise_for_status()
            return resp.json().get("DATA", [])
        except httpx.HTTPError as e:
            print(f"[FlashScore API] 请求失败: {e}")
            return []


def _parse_flashscore_match(elem) -> Optional[dict]:
    """解析 FlashScore 比赛元素"""
    try:
        home = elem.select_one(".event__participant--home, [data-testid='home-team']")
        away = elem.select_one(".event__participant--away, [data-testid='away-team']")
        score_home = elem.select_one(".event__score--home, [data-testid='home-score']")
        score_away = elem.select_one(".event__score--away, [data-testid='away-score']")

        if not home or not away:
            return None

        result = None
        if score_home and score_away:
            result = {
                "homeScore": int(score_home.get_text(strip=True)),
                "awayScore": int(score_away.get_text(strip=True)),
                "homeScorers": [],
                "awayScorers": [],
                "timeline": [],
            }

        return {
            "id": elem.get("data-event-id", ""),
            "homeTeam": {"name": home.get_text(strip=True)},
            "awayTeam": {"name": away.get_text(strip=True)},
            "matchDate": "",
            "status": "finished" if result else "upcoming",
            "result": result,
        }
    except Exception:
        return None
