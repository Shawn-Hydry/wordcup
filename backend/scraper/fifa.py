"""FIFA 官网数据爬取 - 2026美加墨世界杯"""
import httpx
from bs4 import BeautifulSoup
from typing import Optional
import json
import asyncio


FIFA_BASE = "https://www.fifa.com"
FIFA_WC2026 = f"{FIFA_BASE}/fifaplus/en/tournaments/mens/worldcup/2026"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}


async def fetch_match_schedule(date: Optional[str] = None) -> list[dict]:
    """爬取 FIFA 官网比赛日程

    Args:
        date: 指定日期 YYYY-MM-DD，不传则获取全部

    Returns:
        比赛列表，每场包含 id, homeTeam, awayTeam, matchDate, kickoffTime, venue, stage, status, result
    """
    async with httpx.AsyncClient(headers=HEADERS, timeout=30, follow_redirects=True) as client:
        try:
            resp = await client.get(f"{FIFA_WC2026}/schedule")
            resp.raise_for_status()
        except httpx.HTTPError as e:
            print(f"[FIFA] 请求失败: {e}")
            return []

    soup = BeautifulSoup(resp.text, "html.parser")
    matches = []

    # FIFA 官网页面结构可能变化，这里提供解析框架
    # 实际选择器需要根据页面结构调整
    match_elements = soup.select("[data-testid='match-item'], .match-list-item, .ff-match-card")

    for elem in match_elements:
        try:
            match = _parse_match_element(elem)
            if match:
                matches.append(match)
        except Exception as e:
            print(f"[FIFA] 解析比赛元素失败: {e}")
            continue

    if date:
        matches = [m for m in matches if m.get("matchDate") == date]

    print(f"[FIFA] 爬取到 {len(matches)} 场比赛")
    return matches


async def fetch_match_result(match_id: str) -> Optional[dict]:
    """爬取单场比赛结果（比分、进球时间轴）"""
    async with httpx.AsyncClient(headers=HEADERS, timeout=30, follow_redirects=True) as client:
        try:
            resp = await client.get(f"{FIFA_WC2026}/match/{match_id}")
            resp.raise_for_status()
        except httpx.HTTPError as e:
            print(f"[FIFA] 获取比赛 {match_id} 结果失败: {e}")
            return None

    soup = BeautifulSoup(resp.text, "html.parser")
    return _parse_match_result(soup, match_id)


def _parse_match_element(elem) -> Optional[dict]:
    """解析单个比赛元素"""
    # 通用解析逻辑，根据实际页面结构调整选择器
    try:
        home_team = elem.select_one(".home-team, [data-testid='home-team']")
        away_team = elem.select_one(".away-team, [data-testid='away-team']")
        score = elem.select_one(".score, [data-testid='score']")
        match_time = elem.select_one(".match-time, [data-testid='match-time']")

        if not home_team or not away_team:
            return None

        return {
            "id": elem.get("data-match-id", ""),
            "homeTeam": {"name": home_team.get_text(strip=True)},
            "awayTeam": {"name": away_team.get_text(strip=True)},
            "matchDate": "",
            "kickoffTime": match_time.get_text(strip=True) if match_time else "",
            "status": "finished" if score else "upcoming",
            "result": None,
        }
    except Exception:
        return None


def _parse_match_result(soup: BeautifulSoup, match_id: str) -> Optional[dict]:
    """解析比赛结果页面"""
    try:
        score_elem = soup.select_one(".score, [data-testid='score']")
        if not score_elem:
            return None

        score_text = score_elem.get_text(strip=True)
        parts = score_text.split("-")
        if len(parts) != 2:
            return None

        home_score = int(parts[0].strip())
        away_score = int(parts[1].strip())

        # 解析进球时间轴
        timeline = []
        goal_elements = soup.select(".goal-event, [data-testid='goal-event']")
        for goal in goal_elements:
            minute_elem = goal.select_one(".minute, [data-testid='minute']")
            player_elem = goal.select_one(".player-name, [data-testid='player-name']")
            team_elem = goal.select_one(".team, [data-testid='team']")

            if minute_elem and player_elem:
                minute_text = minute_elem.get_text(strip=True).replace("'", "")
                is_extra = "+" in minute_text
                minute = int(minute_text.replace("+", ""))

                timeline.append({
                    "minute": minute,
                    "isExtraTime": is_extra,
                    "player": player_elem.get_text(strip=True),
                    "team": team_elem.get_text(strip=True).lower() if team_elem else "home",
                    "type": "goal",
                })

        return {
            "homeScore": home_score,
            "awayScore": away_score,
            "homeScorers": [g["player"] for g in timeline if g["team"] == "home"],
            "awayScorers": [g["player"] for g in timeline if g["team"] == "away"],
            "timeline": timeline,
        }
    except Exception as e:
        print(f"[FIFA] 解析比赛结果失败: {e}")
        return None


# ============ API 方式获取数据（备选） ============

async def fetch_via_api(date: Optional[str] = None) -> list[dict]:
    """通过 FIFA API 获取数据（如果官网提供 API）"""
    api_url = "https://api.fifa.com/api/v3/tournaments/mens/worldcup/2026/matches"
    params = {}
    if date:
        params["date"] = date

    async with httpx.AsyncClient(timeout=30) as client:
        try:
            resp = await client.get(api_url, params=params)
            resp.raise_for_status()
            data = resp.json()
            return data.get("results", [])
        except httpx.HTTPError as e:
            print(f"[FIFA API] 请求失败: {e}")
            return []
