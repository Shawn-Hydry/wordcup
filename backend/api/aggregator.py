"""外部预测聚合服务 - 模拟从多个知名平台采集预测数据

后期可替换为真实爬虫/API调用：
- OPTA: API订阅
- FiveThirtyEight: 网页爬取
- 各体育媒体: RSS/API
"""
import random
from typing import Any


PLATFORM_TEMPLATES = {
    "OPTA超级计算机": {
        "avatar": "📊",
        "sourceType": "platform",
        "defaultConfidence": 0.72,
    },
    "FiveThirtyEight": {
        "avatar": "🔢",
        "sourceType": "platform",
        "defaultConfidence": 0.55,
    },
    "GPT Sports AI": {
        "avatar": "🤖",
        "sourceType": "ai",
        "defaultConfidence": 0.68,
    },
    "BBC Sport": {
        "avatar": "📰",
        "sourceType": "media",
        "defaultConfidence": 0.65,
    },
    "ESPN FC": {
        "avatar": "📺",
        "sourceType": "media",
        "defaultConfidence": 0.58,
    },
    "知名评论员 张路": {
        "avatar": "🎙️",
        "sourceType": "expert",
        "defaultConfidence": 0.60,
    },
    "懂球帝": {
        "avatar": "⚽",
        "sourceType": "platform",
        "defaultConfidence": 0.62,
    },
}


def _generate_analysis(name: str, match: dict, probs: dict) -> str:
    """根据平台生成分析文字"""
    fav = match["homeTeam"]["name"] if probs["homeWinProb"] > probs["awayWinProb"] else match["awayTeam"]["name"]
    fav_pct = max(probs["homeWinProb"], probs["awayWinProb"]) * 100

    templates = {
        "OPTA超级计算机": f"基于10000次模拟，{fav}胜率{fav_pct:.1f}%。综合进攻/防守/控球等32项指标分析得出。",
        "FiveThirtyEight": f"SPI指数显示两队实力接近。{match['homeTeam']['name']}进攻指数{probs['homeWinProb']*100:.0f}，{match['awayTeam']['name']}防守指数排名靠前。",
        "GPT Sports AI": f"深度学习模型综合近100场比赛数据，预测比分{round(probs['homeWinProb']*3)}:{round(probs['awayWinProb']*3)}。模型近期准确率78.5%。",
        "BBC Sport": f"{match['homeTeam']['name']}前场攻击群状态火热，{match['awayTeam']['name']}虽然整体实力强劲但客场作战面临挑战。",
        "ESPN FC": f"{fav}已经证明他们知道如何在大赛中取胜。任何低估他们的预测都是危险的。",
        "知名评论员 张路": "两队实力接近，大赛首场通常保守。进攻犀利但防守有漏洞，反击高效，看好握手言和或小比分。",
        "懂球帝": f"社区投票：{match['homeTeam']['name']}支持率略高。评论区普遍认为{match['homeTeam']['name']}主场优势明显。",
    }
    return templates.get(name, f"{fav}综合实力占优。")


def generate_external_predictions(match: dict, prediction: dict) -> list[dict]:
    """生成外部预测数据"""
    probs = {
        "homeWinProb": prediction["homeWinProb"],
        "drawProb": prediction["drawProb"],
        "awayWinProb": prediction["awayWinProb"],
    }

    results = []
    for name, config in PLATFORM_TEMPLATES.items():
        r = random.random()
        if r < probs["homeWinProb"]:
            pred_text = f"{match['homeTeam']['name']}胜"
        elif r < probs["homeWinProb"] + probs["drawProb"]:
            pred_text = "平局"
        else:
            pred_text = f"{match['awayTeam']['name']}胜"

        # 部分平台给比分预测
        if name in ("OPTA超级计算机", "GPT Sports AI", "BBC Sport"):
            avg = prediction.get("scorePrediction", {}).get("avgGoals", 2.0)
            h = round(avg * 0.55) or 1
            a = round(avg * 0.45) or 0
            pred_text += f" {h}:{a}"

        results.append({
            "source": name,
            "sourceType": config["sourceType"],
            "prediction": pred_text,
            "confidence": round(config["defaultConfidence"] + (random.random() - 0.5) * 0.1, 2),
            "analysis": _generate_analysis(name, match, probs),
            "avatar": config["avatar"],
        })

    return sorted(results, key=lambda x: x["confidence"], reverse=True)
