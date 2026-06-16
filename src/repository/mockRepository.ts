import type { IPredictionRepository } from './interface'
import type { Match, WinPrediction, PlayerStatusData, ScorePrediction, ExternalPredictData, FullPrediction } from './types'
import {
  matchesData, winPredictions, playerStatusData, scorePredictions, externalPredictData,
  matchData, winPrediction, playerStatus, scorePrediction, externalPredict
} from '@/mock/data'

/**
 * Mock Repository 实现
 * 模拟网络延迟，返回本地 Mock 数据
 * 支持按日期过滤和多场比赛查询
 */
export class MockRepository implements IPredictionRepository {
  private delay(ms = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getMatchesByDate(date: string): Promise<Match[]> {
    await this.delay()
    return matchesData.filter(m => m.matchDate === date)
  }

  async getFullPrediction(matchId: string): Promise<FullPrediction> {
    await this.delay(500)
    const match = matchesData.find(m => m.id === matchId) || matchData
    return {
      match,
      winPrediction: winPredictions[matchId] || winPrediction,
      playerStatus: playerStatusData[matchId] || playerStatus,
      scorePrediction: scorePredictions[matchId] || scorePrediction,
      externalPredict: externalPredictData[matchId] || externalPredict
    }
  }

  async getWinPrediction(matchId: string): Promise<WinPrediction> {
    await this.delay()
    return winPredictions[matchId] || winPrediction
  }

  async getPlayerStatus(matchId: string): Promise<PlayerStatusData> {
    await this.delay()
    return playerStatusData[matchId] || playerStatus
  }

  async getScorePrediction(matchId: string): Promise<ScorePrediction> {
    await this.delay()
    return scorePredictions[matchId] || scorePrediction
  }

  async getExternalPredict(matchId: string): Promise<ExternalPredictData> {
    await this.delay()
    return externalPredictData[matchId] || externalPredict
  }
}
