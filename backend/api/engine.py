"""AI 预测引擎 - 基于加权多因子模型生成预测结果

算法说明：
- 基础概率由 ELO/FIFA 排名差距计算（Logistic 回归）
- 近期战绩加权调整（最近5场）
- 主场优势加成（+8%）
- 伤病影响扣分
- 历史交锋记录修正
- 比分预测基于 Poisson 分布
"""
import math
from typing import Any


class PredictionEngine:
    """世界杯比赛预测引擎"""

    def generate(self, match: dict, stats: dict | None = None) -> dict:
        """生成完整的比赛预测"""
        stats = stats or {}
        base_probs = self._calc_base_probability(match)
        adjusted = self._apply_adjustments(base_probs, match, stats)
        upset = self._calc_upset(adjusted)
        scores = self._predict_scores(adjusted, stats)
        tactical = self._generate_tactical_analysis(match, stats)
        coach = self._generate_coach_analysis(match)

        return {
            "matchId": match["id"],
            "homeWinProb": adjusted["homeWin"],
            "drawProb": adjusted["draw"],
            "awayWinProb": adjusted["awayWin"],
            "upsetProb": upset["prob"],
            "upsetLevel": upset["level"],
            "tacticalAnalysis": tactical,
            "coachComparison": coach,
            "keyFactors": self._key_factors(match, stats, adjusted),
            "scorePrediction": scores,
            "generatedAt": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        }

    def _calc_base_probability(self, match: dict) -> dict[str, float]:
        """基于 FIFA 排名差距计算基础概率（Logistic 回归模型）"""
        rank_diff = match["awayTeam"]["fifaRank"] - match["homeTeam"]["fifaRank"]
        advantage = math.tanh(rank_diff * 0.008)

        home_win = max(0.15, min(0.65, 0.33 + advantage * 0.25))
        away_win = max(0.15, min(0.65, 0.33 - advantage * 0.22))
        draw = max(0.15, 1.0 - home_win - away_win)

        total = home_win + draw + away_win
        return {
            "homeWin": home_win / total,
            "draw": draw / total,
            "awayWin": away_win / total,
        }

    def _apply_adjustments(self, base: dict, match: dict, stats: dict) -> dict[str, float]:
        """应用修正因子"""
        home_win = base["homeWin"]
        away_win = base["awayWin"]
        draw = base["draw"]

        # 1. 近期战绩加权
        home_recent = stats.get("homeRecent", [])
        if home_recent:
            win_rate = home_recent.count("W") / len(home_recent)
            home_win += (win_rate - 0.5) * 0.08

        away_recent = stats.get("awayRecent", [])
        if away_recent:
            win_rate = away_recent.count("W") / len(away_recent)
            away_win += (win_rate - 0.5) * 0.08

        # 2. 主场加成
        venue = match.get("venue", "")
        if venue and match["homeTeam"]["name"] in venue:
            home_win += 0.06
            away_win -= 0.04

        # 3. 核心球员伤病影响
        home_win -= stats.get("homeInjuries", 0) * 0.03
        away_win -= stats.get("awayInjuries", 0) * 0.03

        # 4. 近期交锋记录
        h2h = stats.get("h2hWins")
        if h2h:
            h2h_adv = (h2h["home"] - h2h["away"]) / (h2h.get("total", 5) or 5)
            home_win += h2h_adv * 0.05
            away_win -= h2h_adv * 0.05

        # 归一化 + clamp
        home_win = max(0.10, min(0.70, home_win))
        away_win = max(0.10, min(0.70, away_win))
        draw = max(0.10, 1.0 - home_win - away_win)

        total = home_win + draw + away_win
        return {
            "homeWin": round(home_win / total, 4),
            "draw": round(draw / total, 4),
            "awayWin": round(away_win / total, 4),
        }

    def _calc_upset(self, probs: dict) -> dict:
        """计算爆冷概率"""
        favorite = max(probs["homeWin"], probs["awayWin"])
        underdog = min(probs["homeWin"], probs["awayWin"])
        gap = favorite - underdog

        upset_prob = max(0.05, min(0.6, 0.5 - gap * 0.8))
        level = "low"
        if upset_prob > 0.30:
            level = "medium"
        if upset_prob > 0.45:
            level = "high"

        return {"prob": round(upset_prob, 4), "level": level}

    def _predict_scores(self, probs: dict, stats: dict) -> dict:
        """基于 Poisson 分布生成比分概率分布"""
        gap = abs(probs["homeWin"] - probs["awayWin"])

        avg_home_goals = 1.2 + gap * 1.5 + stats.get("homeGoalsAvg", 0) * 0.3
        avg_away_goals = 1.2 - gap * 1.2 + stats.get("awayGoalsAvg", 0) * 0.3

        score_probs = []
        for h in range(6):
            for a in range(6):
                if (h <= 3 and a <= 3) or (h + a) <= 6:
                    ph = self._poisson(h, avg_home_goals)
                    pa = self._poisson(a, avg_away_goals)
                    prob = ph * pa
                    if prob > 0.005:
                        score_probs.append({"score": f"{h}:{a}", "probability": prob})

        # 归一化并排序取 Top10
        total_p = sum(s["probability"] for s in score_probs)
        top_scores = sorted(
            [
                {"score": s["score"], "probability": round(s["probability"] / total_p, 4)}
                for s in score_probs
            ],
            key=lambda x: x["probability"],
            reverse=True,
        )[:10]

        # 总进球数概率
        total_goals = [0.0, 0.0, 0.0, 0.0]
        for s in top_scores:
            h, a = map(int, s["score"].split(":"))
            total = h + a
            if total <= 1:
                total_goals[0] += s["probability"]
            elif total <= 3:
                total_goals[1] += s["probability"]
            elif total <= 5:
                total_goals[2] += s["probability"]
            else:
                total_goals[3] += s["probability"]

        avg_goals = round(avg_home_goals + avg_away_goals, 1)

        return {
            "mostLikelyScore": top_scores[0]["score"] if top_scores else "1:0",
            "topScores": top_scores,
            "totalGoals": [
                {"range": "0-1球", "probability": round(total_goals[0], 4)},
                {"range": "2-3球", "probability": round(total_goals[1], 4)},
                {"range": "4-5球", "probability": round(total_goals[2], 4)},
                {"range": "6球以上", "probability": round(total_goals[3], 4)},
            ],
            "avgGoals": avg_goals,
        }

    @staticmethod
    def _poisson(k: int, lam: float) -> float:
        """Poisson 概率质量函数"""
        if k < 0 or lam <= 0:
            return 0.0
        log_p = -lam + k * math.log(lam)
        for i in range(2, k + 1):
            log_p -= math.log(i)
        return math.exp(log_p)

    @staticmethod
    def _generate_tactical_analysis(match: dict, stats: dict) -> str:
        """生成战术分析文字"""
        h = match["homeTeam"]
        a = match["awayTeam"]
        return (
            f"{h['name']}队预计采用{h.get('formation', '4-3-3')}阵型，"
            f"{h.get('style', '强调控球与快速反击')}。"
            f"防守端{h.get('defenseStyle', '区域防守为主')}，"
            f"{h.get('attackStyle', '边路突破是核心进攻手段')}。\n\n"
            f"{a['name']}队则延续{a.get('formation', '4-4-2')}"
            f"{a.get('style', '务实主义打法')}，"
            f"依靠{a.get('starPlayer', '核心球员')}的"
            f"{a.get('keyTactic', '个人能力与团队配合')}。"
        )

    @staticmethod
    def _generate_coach_analysis(match: dict) -> str:
        """生成教练对比分析"""
        return (
            f"{match['homeTeam'].get('coach', '主教练')} vs "
            f"{match['awayTeam'].get('coach', '客队教练')}："
            f"两位教练的战术理念{match['homeTeam'].get('coachStyle', '各具特色')}，"
            f"临场调整能力将是比赛的关键变量。"
        )

    @staticmethod
    def _key_factors(match: dict, stats: dict, probs: dict) -> list[str]:
        """提取关键影响因素"""
        factors = []
        gap = abs(probs["homeWin"] - probs["awayWin"])
        favorite = match["homeTeam"]["name"] if probs["homeWin"] > probs["awayWin"] else match["awayTeam"]["name"]

        if gap < 0.08:
            factors.append(f"实力接近，{favorite}略占优势")
        else:
            factors.append(f"{favorite}综合实力明显占优")

        if match.get("venue"):
            factors.append(f"比赛地点：{match['venue']}")
        if stats.get("homeInjuries"):
            factors.append(f"{match['homeTeam']['name']}有{stats['homeInjuries']}名核心球员伤停")
        if stats.get("awayInjuries"):
            factors.append(f"{match['awayTeam']['name']}有{stats['awayInjuries']}名核心球员伤停")
        if stats.get("weatherImpact"):
            factors.append(f"天气因素：{stats['weatherImpact']}")

        return factors


# 单例
engine = PredictionEngine()
