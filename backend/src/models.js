/**
 * 数据模型类型定义
 */

// 球队
const TEAM_POSITIONS = {
  FW: '前锋',
  MF: '中场',
  DF: '后卫',
  GK: '门将'
}

// 比赛阶段
const MATCH_STAGES = [
  '小组赛', '1/8决赛', '1/4决赛', '半决赛', '三四名决赛', '决赛'
]

// 爆冷等级
const UPSET_LEVELS = {
  low: { label: '低风险', min: 0, max: 0.25 },
  medium: { label: '中等风险', min: 0.25, max: 0.5 },
  high: { label: '高风险', min: 0.5, max: 1.0 }
}

// 预测来源类型
const SOURCE_TYPES = {
  platform: '数据平台',
  expert: '专家评论',
  media: '知名媒体',
  ai: 'AI模型'
}

// 伤病状态
const INJURY_STATUS = {
  fit: '健康',
  doubtful: '疑似伤停',
  out: '确认伤停'
}

/**
 * 验证函数
 */
function validateMatch(match) {
  const errors = []
  if (!match.id) errors.push('缺少 match.id')
  if (!match.homeTeam?.name) errors.push('缺少主队名称')
  if (!match.awayTeam?.name) errors.push('缺少客队名称')
  if (!match.matchDate) errors.push('缺少比赛日期')
  if (!match.kickoffTime) errors.push('缺少开球时间')
  return errors
}

function validatePrediction(pred) {
  const errors = []
  const sum = (pred.homeWinProb || 0) + (pred.drawProb || 0) + (pred.awayWinProb || 0)
  if (Math.abs(sum - 1.0) > 0.01) errors.push(`概率之和不等于1: ${sum}`)
  if (pred.homeWinProb < 0 || pred.homeWinProb > 1) errors.push('主胜概率超出范围')
  return errors
}

module.exports = {
  TEAM_POSITIONS,
  MATCH_STAGES,
  UPSET_LEVELS,
  SOURCE_TYPES,
  INJURY_STATUS,
  validateMatch,
  validatePrediction
}