const express = require('express')
const router = express.Router()
const engine = require('./engine')
const repo = require('./repository')
const aggregator = require('./aggregator')
const { seedMatches, seedPlayerData, seedStats } = require('./seedData')

// ============ 比赛接口 ============

/** GET /api/matches?date=2026-06-13 */
router.get('/matches', async (req, res) => {
  try {
    const date = req.query.date
    let matches
    if (date) {
      matches = await repo.getMatchesByDate(date)
    } else {
      matches = await repo.getAllMatches()
    }
    res.json({ success: true, data: matches })
  } catch (e) {
    res.status(500).json({ success: false, error: e.message })
  }
})

/** GET /api/matches/:id */
router.get('/matches/:id', async (req, res) => {
  try {
    const { match, prediction } = await repo.getFullPrediction(req.params.id)
    if (!match) return res.status(404).json({ success: false, error: '比赛不存在' })
    res.json({ success: true, data: { match, prediction } })
  } catch (e) {
    res.status(500).json({ success: false, error: e.message })
  }
})

// ============ 预测接口 ============

/** GET /api/predict/:matchId/full - 获取完整预测数据 */
router.get('/predict/:matchId/full', async (req, res) => {
  try {
    const { matchId } = req.params
    const match = (await repo.getFullPrediction(matchId)).match
    if (!match) return res.status(404).json({ success: false, error: '比赛不存在' })

    // 1. AI 预测引擎
    const stats = seedStats[matchId] || {}
    const prediction = engine.generate(match, stats)

    // 2. 外部预测聚合
    const externals = aggregator.generateExternalPredictions(match, prediction)

    // 3. 球员状态
    const players = seedPlayerData[matchId] || { homePlayers: [], awayPlayers: [] }

    // 4. 持久化
    await repo.savePrediction(prediction)
    await repo.saveExternalPredictions(matchId, externals)
    await repo.savePlayerStatus(matchId, players)

    res.json({
      success: true,
      data: {
        match,
        winPrediction: {
          homeWinProb: prediction.homeWinProb,
          drawProb: prediction.drawProb,
          awayWinProb: prediction.awayWinProb,
          upsetProb: prediction.upsetProb,
          upsetLevel: prediction.upsetLevel,
          tacticalAnalysis: prediction.tacticalAnalysis,
          coachComparison: prediction.coachComparison,
          keyFactors: prediction.keyFactors
        },
        playerStatus: players,
        scorePrediction: prediction.scorePrediction,
        externalPredict: { matchId, predictions: externals },
        generatedAt: prediction.generatedAt
      }
    })
  } catch (e) {
    console.error('[Predict] Error:', e)
    res.status(500).json({ success: false, error: e.message })
  }
})

// ============ 管理后台接口 ============

/** POST /api/admin/seed - 初始化种子数据 */
router.post('/admin/seed', async (req, res) => {
  try {
    const results = []
    for (const match of seedMatches) {
      const saved = await repo.saveMatch(match)

      // 为每场比赛生成预测
      const stats = seedStats[match.id] || {}
      const prediction = engine.generate(match, stats)
      await repo.savePrediction(prediction)

      const externals = aggregator.generateExternalPredictions(match, prediction)
      await repo.saveExternalPredictions(match.id, externals)

      const players = seedPlayerData[match.id] || { homePlayers: [], awayPlayers: [] }
      await repo.savePlayerStatus(match.id, players)

      results.push({ id: match.id, home: match.homeTeam.name, away: match.awayTeam.name })
    }
    res.json({ success: true, message: `已初始化 ${results.length} 场比赛`, data: results })
  } catch (e) {
    res.status(500).json({ success: false, error: e.message })
  }
})

/** POST /api/admin/matches - 手动录入比赛 */
router.post('/admin/matches', async (req, res) => {
  try {
    const match = req.body
    if (!match.id || !match.homeTeam || !match.awayTeam) {
      return res.status(400).json({ success: false, error: '缺少必填字段' })
    }
    const saved = await repo.saveMatch(match)
    res.json({ success: true, data: saved })
  } catch (e) {
    res.status(500).json({ success: false, error: e.message })
  }
})

module.exports = router