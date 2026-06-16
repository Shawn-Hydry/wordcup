import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getRepository } from '@/repository'
import type { Match, WinPrediction, PlayerStatusData, ScorePrediction, ExternalPredictData } from '@/repository'

export const usePredictionStore = defineStore('prediction', () => {
  const repo = getRepository()

  // 状态
  const loading = ref(false)
  const match = ref<Match | null>(null)
  const winPrediction = ref<WinPrediction | null>(null)
  const playerStatus = ref<PlayerStatusData | null>(null)
  const scorePrediction = ref<ScorePrediction | null>(null)
  const externalPredict = ref<ExternalPredictData | null>(null)
  const error = ref<string | null>(null)

  // 计算属性
  const homePlayers = computed(() => playerStatus.value?.homePlayers ?? [])
  const awayPlayers = computed(() => playerStatus.value?.awayPlayers ?? [])
  const starPlayers = computed(() => [
    ...homePlayers.value.filter(p => p.isStarPlayer),
    ...awayPlayers.value.filter(p => p.isStarPlayer)
  ])
  const injuredPlayers = computed(() => [
    ...homePlayers.value.filter(p => p.injury),
    ...awayPlayers.value.filter(p => p.injury)
  ])

  // 操作
  async function fetchFullPrediction(matchId: string) {
    loading.value = true
    error.value = null
    try {
      const data = await repo.getFullPrediction(matchId)
      match.value = data.match
      winPrediction.value = data.winPrediction
      playerStatus.value = data.playerStatus
      scorePrediction.value = data.scorePrediction
      externalPredict.value = data.externalPredict
    } catch (e: any) {
      error.value = e.message || '加载失败'
    } finally {
      loading.value = false
    }
  }

  async function fetchMatchesByDate(date: string) {
    loading.value = true
    error.value = null
    try {
      const matches = await repo.getMatchesByDate(date)
      if (matches.length > 0) {
        match.value = matches[0]
      }
    } catch (e: any) {
      error.value = e.message || '加载失败'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    match,
    winPrediction,
    playerStatus,
    scorePrediction,
    externalPredict,
    error,
    homePlayers,
    awayPlayers,
    starPlayers,
    injuredPlayers,
    fetchFullPrediction,
    fetchMatchesByDate
  }
})