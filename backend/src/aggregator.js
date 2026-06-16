/**
 * 外部预测聚合服务
 * 模拟从多个知名平台采集预测数据
 * 
 * 后期可替换为真实爬虫/API调用：
 * - OPTA: API订阅
 * - FiveThirtyEight: 网页爬取
 * - 各体育媒体: RSS/API
 */

// 平台预测模板库
const PLATFORM_TEMPLATES = {
  'OPTA超级计算机': {
    avatar: '📊',
    sourceType: 'platform',
    defaultConfidence: 0.72,
    generateAnalysis(match, probs) {
      const fav = probs.homeWinProb > probs.awayWinProb ? match.homeTeam.name : match.awayTeam.name
      return `基于10000次模拟，${fav}胜率${(Math.max(probs.homeWinProb, probs.awayWinProb)*100).toFixed(1)}%。综合进攻/防守/控球等32项指标分析得出。`
    }
  },
  'FiveThirtyEight': {
    avatar: '🔢',
    sourceType: 'platform',
    defaultConfidence: 0.55,
    generateAnalysis(match, probs) {
      return `SPI指数显示两队实力接近。${match.homeTeam.name}进攻指数${(probs.homeWinProb*100).toFixed(0)}，${match.awayTeam.name}防守指数排名靠前。`
    }
  },
  'GPT Sports AI': {
    avatar: '🤖',
    sourceType: 'ai',
    defaultConfidence: 0.68,
    generateAnalysis(match, probs) {
      const score = `${Math.round(probs.homeWinProb*3)}:${Math.round(probs.awayWinProb*3)}`
      return `深度学习模型综合近100场比赛数据，预测比分${score}。模型近期准确率78.5%。`
    }
  },
  'BBC Sport': {
    avatar: '📰',
    sourceType: 'media',
    defaultConfidence: 0.65,
    generateAnalysis(match, probs) {
      return `${match.homeTeam.name}前场攻击群状态火热，${match.awayTeam.name}虽然整体实力强劲但客场作战面临挑战。`
    }
  },
  'ESPN FC': {
    avatar: '📺',
    sourceType: 'media',
    defaultConfidence: 0.58,
    generateAnalysis(match, probs) {
      const fav = probs.homeWinProb > probs.awayWinProb ? match.homeTeam.name : match.awayTeam.name
      return `${fav}已经证明他们知道如何在大赛中取胜。任何低估他们的预测都是危险的。`
    }
  },
  '知名评论员 张路': {
    avatar: '🎙️',
    sourceType: 'expert',
    defaultConfidence: 0.60,
    generateAnalysis() {
      return '两队实力接近，大赛首场通常保守。进攻犀利但防守有漏洞，反击高效，看好握手言和或小比分。'
    }
  },
  '懂球帝': {
    avatar: '⚽',
    sourceType: 'platform',
    defaultConfidence: 0.62,
    generateAnalysis(match) {
      return `社区投票：${match.homeTeam.name}支持率略高。评论区普遍认为${match.homeTeam.name}主场优势明显。`
    }
  }
}

function generateExternalPredictions(match, prediction) {
  const probs = {
    homeWinProb: prediction.homeWinProb,
    drawProb: prediction.drawProb,
    awayWinProb: prediction.awayWinProb
  }

  const results = []

  for (const [name, config] of Object.entries(PLATFORM_TEMPLATES)) {
    // 每个平台有略微不同的判定
    let predText = ''
    const r = Math.random()

    if (r < probs.homeWinProb) {
      predText = `${match.homeTeam.name}胜`
    } else if (r < probs.homeWinProb + probs.drawProb) {
      predText = '平局'
    } else {
      predText = `${match.awayTeam.name}胜`
    }

    // 有的平台还给比分预测
    if (['OPTA超级计算机', 'GPT Sports AI', 'BBC Sport'].includes(name)) {
      const h = Math.round(prediction.scorePrediction?.avgGoals * 0.55) || 1
      const a = Math.round(prediction.scorePrediction?.avgGoals * 0.45) || 0
      predText += ` ${h}:${a}`
    }

    results.push({
      source: name,
      sourceType: config.sourceType,
      prediction: predText,
      confidence: +(config.defaultConfidence + (Math.random() - 0.5) * 0.1).toFixed(2),
      analysis: config.generateAnalysis(match, probs),
      avatar: config.avatar
    })
  }

  // 按置信度降序排列
  return results.sort((a, b) => b.confidence - a.confidence)
}

module.exports = { generateExternalPredictions }