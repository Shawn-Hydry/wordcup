import type { IPredictionRepository } from './interface'
import type { Match, FullPrediction, WinPrediction, PlayerStatusData, ScorePrediction, ExternalPredictData } from './types'

// API 基地址，开发环境默认后端地址
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

/** 封装 uni.request 为 Promise */
function request<T>(options: UniApp.RequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const body = res.data as any
          if (body.success === false) {
            reject(new Error(body.error || '请求失败'))
          } else {
            resolve(body.data as T)
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}`))
        }
      },
      fail(err) {
        reject(new Error(err.errMsg || '网络请求失败'))
      }
    })
  })
}

/**
 * API Repository 实现
 * 通过 HTTP 请求调用后端 Express API 获取数据
 */
export class ApiRepository implements IPredictionRepository {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE
  }

  async getMatchesByDate(date: string): Promise<Match[]> {
    return request<Match[]>({
      url: `${this.baseUrl}/api/matches?date=${encodeURIComponent(date)}`,
      method: 'GET'
    })
  }

  async getFullPrediction(matchId: string): Promise<FullPrediction> {
    const data = await request<any>({
      url: `${this.baseUrl}/api/predict/${encodeURIComponent(matchId)}/full`,
      method: 'GET'
    })
    // 后端返回格式: { match, winPrediction, playerStatus, scorePrediction, externalPredict, generatedAt }
    return {
      match: data.match,
      winPrediction: data.winPrediction,
      playerStatus: data.playerStatus,
      scorePrediction: data.scorePrediction,
      externalPredict: data.externalPredict
    }
  }

  async getWinPrediction(matchId: string): Promise<WinPrediction> {
    const full = await this.getFullPrediction(matchId)
    return full.winPrediction
  }

  async getPlayerStatus(matchId: string): Promise<PlayerStatusData> {
    const full = await this.getFullPrediction(matchId)
    return full.playerStatus
  }

  async getScorePrediction(matchId: string): Promise<ScorePrediction> {
    const full = await this.getFullPrediction(matchId)
    return full.scorePrediction
  }

  async getExternalPredict(matchId: string): Promise<ExternalPredictData> {
    const full = await this.getFullPrediction(matchId)
    return full.externalPredict
  }
}
