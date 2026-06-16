import { MockRepository } from './mockRepository'
import { ApiRepository } from './apiRepository'
import type { IPredictionRepository } from './interface'

/**
 * Repository 工厂
 * 根据环境变量切换数据源：
 * - VITE_USE_API=true → ApiRepository（后端 API）
 * - 其他 → MockRepository（本地 Mock 数据）
 */
let _instance: IPredictionRepository | null = null

const USE_API = import.meta.env.VITE_USE_API === 'true' || true

export function getRepository(): IPredictionRepository {
  if (!_instance) {
    _instance = USE_API ? new ApiRepository() : new MockRepository()
  }
  return _instance
}

/** 重置实例（用于切换数据源后重新初始化） */
export function resetRepository(): void {
  _instance = null
}

export type { IPredictionRepository }
export type * from './types'
