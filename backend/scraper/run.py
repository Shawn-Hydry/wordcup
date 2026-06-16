"""爬取入口脚本

用法：
    python -m scraper.run                  # 爬取全部
    python -m scraper.run --date 2026-06-16  # 爬取指定日期
"""
import asyncio
import argparse
from pathlib import Path

from scraper.fifa import fetch_match_schedule, fetch_match_result
from scraper.flashscore import fetch_match_results
from scraper.merger import merge_matches, merge_with_existing, save_merged_data
from api.repository import _read_json


DATA_DIR = Path(__file__).parent.parent / "data"


async def run(date: str | None = None):
    """执行爬取流程"""
    print("=" * 50)
    print(f"🏆 世界杯数据爬取 {'(' + date + ')' if date else '(全部)'}")
    print("=" * 50)

    # 1. 爬取 FIFA 数据
    print("\n📡 爬取 FIFA 官网...")
    fifa_matches = await fetch_match_schedule(date)
    print(f"   FIFA: {len(fifa_matches)} 场比赛")

    # 2. 爬取 FlashScore 数据
    print("\n📡 爬取 FlashScore...")
    fs_matches = await fetch_match_results(date)
    print(f"   FlashScore: {len(fs_matches)} 场比赛")

    # 3. 合并多源数据
    print("\n🔄 合并数据...")
    merged = merge_matches(fifa_matches, fs_matches)
    print(f"   合并后: {len(merged)} 场比赛")

    # 4. 与现有数据合并
    existing = _read_json("matches.json") or []
    if existing:
        print(f"\n📋 现有数据: {len(existing)} 场比赛")
        final = merge_with_existing(merged, existing)
    else:
        final = merged

    # 5. 保存
    save_merged_data(final, DATA_DIR)

    # 6. 统计
    finished = sum(1 for m in final if m.get("status") == "finished")
    upcoming = sum(1 for m in final if m.get("status") == "upcoming")
    print(f"\n✅ 完成！已完赛: {finished} 场，未开赛: {upcoming} 场")


def main():
    parser = argparse.ArgumentParser(description="世界杯数据爬取")
    parser.add_argument("--date", type=str, default=None, help="指定日期 YYYY-MM-DD")
    args = parser.parse_args()
    asyncio.run(run(args.date))


if __name__ == "__main__":
    main()
