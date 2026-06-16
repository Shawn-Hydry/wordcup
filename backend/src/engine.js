/**
 * AI 预测引擎
 * 基于加权多因子模型生成预测结果
 *
 * 算法说明：
 * - 基础概率由 ELO/FIFA 排名差距计算
 * - 近期战绩加权调整（最近5场）
 * - 主场优势加成（+8%）
 * - 伤病影响扣分
 * - 历史交锋记录修正
 */

const { UPSET_LEVELS } = require('./models')

class PredictionEngine {
  /**
   * 生成完整的比赛预测
   * @param {Object} match - 比赛数据
   * @param {Object} stats - 统计数据（战绩、交锋、伤病等）
   */
  generate(match, stats = {}) {
    const baseProbs = this._calcBaseProbability(match)
    const adjusted = this._applyAdjustments(baseProbs, match, stats)
    const upset = this._calcUpset(adjusted)
    const scores = this._predictScores(adjusted, stats)
    const tactical = this._generateTacticalAnalysis(match, stats)
    const coach = this._generateCoachAnalysis(match)

    return {
      matchId: match.id,
      // 胜负预测
      homeWinProb: adjusted.homeWin,
      drawProb: adjusted.draw,
      awayWinProb: adjusted.awayWin,
      upsetProb: upset.prob,
      upsetLevel: upset.level,
      tacticalAnalysis: tactical,
      coachComparison: coach,
      keyFactors: this._keyFactors(match, stats, adjusted),
      // 比分预测
      scorePrediction: scores,
      generatedAt: new Date().toISOString()
    }
  }

  /**
   * 基于 FIFA 排名差距计算基础概率
   * 使用 Logistic 回归模型
   */
  _calcBaseProbability(match) {
    const rankDiff = match.awayTeam.fifaRank - match.homeTeam.fifaRank
    // ELO式转换：每10名排名差 ≈ 0.04 预期得分差
    const advantage = Math.tanh(rankDiff * 0.008)

    // 主胜 = 0.33 + advantage*0.25 (主场优势)
    const homeWin = Math.max(0.15, Math.min(0.65, 0.33 + advantage * 0.25))
    const awayWin = Math.max(0.15, Math.min(0.65, 0.33 - advantage * 0.22))
    const draw = Math.max(0.15, 1.0 - homeWin - awayWin)

    // 归一化
    const total = homeWin + draw + awayWin
    return {
      homeWin: homeWin / total,
      draw: draw / total,
      awayWin: awayWin / total
    }
  }

  /**
   * 应用修正因子
   */
  _applyAdjustments(base, match, stats) {
    let homeWin = base.homeWin
    let awayWin = base.awayWin
    let draw = base.draw

    // 1. 近期战绩加权 (5场)
    if (stats.homeRecent?.length) {
      const winRate = stats.homeRecent.filter(r => r === 'W').length / stats.homeRecent.length
      homeWin += (winRate - 0.5) * 0.08
    }
    if (stats.awayRecent?.length) {
      const winRate = stats.awayRecent.filter(r => r === 'W').length / stats.awayRecent.length
      awayWin += (winRate - 0.5) * 0.08
    }

    // 2. 主场加成
    if (match.venue?.includes(match.homeTeam.name)) {
      homeWin += 0.06
      awayWin -= 0.04
    }

    // 3. 核心球员伤病影响
    const homeInjuries = stats.homeInjuries || 0
    const awayInjuries = stats.awayInjuries || 0
    homeWin -= homeInjuries * 0.03
    awayWin -= awayInjuries * 0.03

    // 4. 近期交锋记录
    if (stats.h2hWins) {
      const h2hAdv = (stats.h2hWins.home - stats.h2hWins.away) / (stats.h2hWins.total || 5)
      homeWin += h2hAdv * 0.05
      awayWin -= h2hAdv * 0.05
    }

    // 归一化 + clamp
    homeWin = Math.max(0.10, Math.min(0.70, homeWin))
    awayWin = Math.max(0.10, Math.min(0.70, awayWin))
    draw = Math.max(0.10, 1.0 - homeWin - awayWin)

    const total = homeWin + draw + awayWin
    return {
      homeWin: +(homeWin / total).toFixed(4),
      draw: +(draw / total).toFixed(4),
      awayWin: +(awayWin / total).toFixed(4)
    }
  }

  /**
   * 计算爆冷概率
   */
  _calcUpset(probs) {
    const favorite = Math.max(probs.homeWin, probs.awayWin)
    const underdog = Math.min(probs.homeWin, probs.awayWin)
    const gap = favorite - underdog

    // gap 越大爆冷概率越低
    const upsetProb = Math.max(0.05, Math.min(0.6, 0.5 - gap * 0.8))

    let level = 'low'
    if (upsetProb > 0.30) level = 'medium'
    if (upsetProb > 0.45) level = 'high'

    return { prob: +upsetProb.toFixed(4), level }
  }

  /**
   * 生成比分概率分布
   * 基于 Poisson 分布模拟
   */
  _predictScores(probs, stats) {
    const favorite = probs.homeWin > probs.awayWin ? 'home' : 'away'
    const gap = Math.abs(probs.homeWin - probs.awayWin)

    // 预期进球
    const avgHomeGoals = 1.2 + gap * 1.5 + (stats.homeGoalsAvg || 0) * 0.3
    const avgAwayGoals = 1.2 - gap * 1.2 + (stats.awayGoalsAvg || 0) * 0.3

    // 生成比分概率表
    const scoreProbs = []
    for (let h = 0; h <= 5; h++) {
      for (let a = 0; a <= 5; a++) {
        if (h <= 3 && a <= 3 || (h + a) <= 6) {
          const pH = this._poisson(h, avgHomeGoals)
          const pA = this._poisson(a, avgAwayGoals)
          const prob = pH * pA
          if (prob > 0.005) {
            scoreProbs.push({ score: `${h}:${a}`, probability: prob })
          }
        }
      }
    }

    // 归一化并排序取 Top10
    const totalP = scoreProbs.reduce((s, x) => s + x.probability, 0)
    const topScores = scoreProbs
      .map(s => ({ score: s.score, probability: +(s.probability / totalP).toFixed(4) }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 10)

    // 总进球数概率
    const totalGoals = [0, 0, 0, 0]
    topScores.forEach(s => {
      const [h, a] = s.score.split(':').map(Number)
      const total = h + a
      if (total <= 1) totalGoals[0] += s.probability
      else if (total <= 3) totalGoals[1] += s.probability
      else if (total <= 5) totalGoals[2] += s.probability
      else totalGoals[3] += s.probability
    })

    const avgGoals = +(avgHomeGoals + avgAwayGoals).toFixed(1)

    return {
      mostLikelyScore: topScores[0]?.score || '1:0',
      topScores,
      totalGoals: [
        { range: '0-1球', probability: +totalGoals[0].toFixed(4) },
        { range: '2-3球', probability: +totalGoals[1].toFixed(4) },
        { range: '4-5球', probability: +totalGoals[2].toFixed(4) },
        { range: '6球以上', probability: +totalGoals[3].toFixed(4) }
      ],
      avgGoals
    }
  }

  /**
   * Poisson 概率质量函数
   */
  _poisson(k, lambda) {
    if (k < 0 || lambda <= 0) return 0
    let logP = -lambda + k * Math.log(lambda)
    for (let i = 2; i <= k; i++) logP -= Math.log(i)
    return Math.exp(logP)
  }

  /**
   * 生成战术分析文字
   */
  _generateTacticalAnalysis(match, stats) {
    const h = match.homeTeam
    const a = match.awayTeam
    return `${h.name}队预计采用${h.formation || '4-3-3'}阵型，${h.style || '强调控球与快速反击'}。` +
      `防守端${h.defenseStyle || '区域防守为主'}，${h.attackStyle || '边路突破是核心进攻手段'}。\n\n` +
      `${a.name}队则延续${a.formation || '4-4-2'}${a.style || '务实主义打法'}，` +
      `依靠${a.starPlayer || '核心球员'}的${a.keyTactic || '个人能力与团队配合'}。`
  }

  /**
   * 生成教练对比分析
   */
  _generateCoachAnalysis(match) {
    return `${match.homeTeam.coach || '主教练'} vs ${match.awayTeam.coach || '客队教练'}：` +
      `两位教练的战术理念${match.homeTeam.coachStyle || '各具特色'}，临场调整能力将是比赛的关键变量。`
  }

  /**
   * 提取关键影响因素
   */
  _keyFactors(match, stats, probs) {
    const factors = []
    const gap = Math.abs(probs.homeWin - probs.awayWin)
    const favorite = probs.homeWin > probs.awayWin ? match.homeTeam.name : match.awayTeam.name

    if (gap < 0.08) factors.push(`实力接近，${favorite}略占优势`)
    else factors.push(`${favorite}综合实力明显占优`)

    if (match.venue) factors.push(`比赛地点：${match.venue}`)
    if (stats.homeInjuries) factors.push(`${match.homeTeam.name}有${stats.homeInjuries}名核心球员伤停`)
    if (stats.awayInjuries) factors.push(`${match.awayTeam.name}有${stats.awayInjuries}名核心球员伤停`)
    if (stats.weatherImpact) factors.push(`天气因素：${stats.weatherImpact}`)

    return factors
  }
}

module.exports = new PredictionEngine()