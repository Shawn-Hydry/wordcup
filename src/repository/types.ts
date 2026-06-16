/** 球队信息 */
export interface Team {
  id: string
  name: string
  flag: string          // emoji国旗（降级回退）
  flagUrl: string       // 圆形国旗图片URL
  fifaRank: number
  formation: string     // 常用阵型
  coach: Coach
  group: string
}

/** 教练信息 */
export interface Coach {
  name: string
  nationality: string
  style: string          // 战术风格
  formation: string      // 常用阵型
  experience: string     // 执教经历简述
}

/** 进球事件 */
export interface GoalEvent {
  minute: number           // 进球时间（含补时如 45+2）
  isExtraTime: boolean     // 是否伤停补时
  player: string           // 进球球员
  team: 'home' | 'away'    // 进球方
  type: 'goal' | 'own_goal' | 'penalty'  // 进球类型
}

/** 比赛结果 */
export interface MatchResult {
  homeScore: number
  awayScore: number
  homeScorers: string[]   // 进球球员
  awayScorers: string[]
  timeline: GoalEvent[]   // 进球时间轴
}

/** 比赛信息 */
export interface Match {
  id: string
  homeTeam: Team
  awayTeam: Team
  matchDate: string      // 2026-06-16
  kickoffTime: string    // 21:00
  venue: string
  stage: string          // 小组赛/淘汰赛
  status: 'upcoming' | 'live' | 'finished'
  result?: MatchResult   // 已完赛时有值
}

/** 伤病信息 */
export interface Injury {
  status: 'fit' | 'doubtful' | 'out'
  description: string
}

/** 球员信息 */
export interface Player {
  name: string
  number: number
  position: 'GK' | 'DF' | 'MF' | 'FW'
  recentForm: number        // 近期状态 1-10
  recentGoals: number       // 近5场进球
  recentAssists: number     // 近5场助攻
  isStarPlayer: boolean
  injury: Injury | null
}

/** 球员状态汇总 */
export interface PlayerStatusData {
  matchId: string
  homePlayers: Player[]
  awayPlayers: Player[]
}

/** 胜平负预测 */
export interface WinPrediction {
  matchId: string
  homeWinProb: number
  drawProb: number
  awayWinProb: number
  upsetProb: number
  upsetLevel: 'low' | 'medium' | 'high'
  tacticalAnalysis: string
  coachComparison: string
  keyFactors: string[]
}

/** 比分概率 */
export interface ScoreProb {
  score: string
  probability: number
}

/** 总进球概率 */
export interface TotalGoalsProb {
  range: string
  probability: number
}

/** 比分预测 */
export interface ScorePrediction {
  matchId: string
  mostLikelyScore: string
  topScores: ScoreProb[]
  totalGoals: TotalGoalsProb[]
  avgGoals: number
}

/** 外部预测 */
export interface ExternalPrediction {
  source: string
  sourceType: 'platform' | 'expert' | 'media'
  prediction: string
  confidence: number
  analysis: string
  avatar: string
}

/** 外部预测汇总 */
export interface ExternalPredictData {
  matchId: string
  predictions: ExternalPrediction[]
}

/** 完整预测数据 */
export interface FullPrediction {
  match: Match
  winPrediction: WinPrediction
  playerStatus: PlayerStatusData
  scorePrediction: ScorePrediction
  externalPredict: ExternalPredictData
}