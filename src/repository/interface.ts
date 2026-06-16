import type { FullPrediction, Match, WinPrediction, PlayerStatusData, ScorePrediction, ExternalPredictData } from './types'

/**
 * Repository 接口 - 定义数据访问契约
 * 当前用 Mock 实现，后续可替换为云数据库/API 实现
 */
export interface IPredictionRepository {
  /** 获取指定日期的比赛列表 */
  getMatchesByDate(date: string): Promise<Match[]>

  /** 获取完整预测数据 */
  getFullPrediction(matchId: string): Promise<FullPrediction>

  /** 获取胜负预测 */
  getWinPrediction(matchId: string): Promise<WinPrediction>

  /** 获取球员状态 */
  getPlayerStatus(matchId: string): Promise<PlayerStatusData>

  /** 获取比分预测 */
  getScorePrediction(matchId: string): Promise<ScorePrediction>

  /** 获取外部预测 */
  getExternalPredict(matchId: string): Promise<ExternalPredictData>
}