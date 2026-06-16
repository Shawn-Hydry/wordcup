<template>
  <view class="page">
    <!-- 加载态 -->
    <view v-if="loading && !match" class="loading-wrap">
      <view class="spinner" />
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 错误态 -->
    <view v-else-if="error" class="loading-wrap">
      <text style="font-size:48rpx">⚠️</text>
      <text class="loading-text">{{ error }}</text>
      <view class="retry-btn" @tap="loadMatchesByDate(selectedDate)">
        <text>重新加载</text>
      </view>
    </view>

    <!-- 主内容 -->
    <template v-else>
      <!-- 日期选择器 -->
      <view class="date-bar">
        <view class="date-arrow" @tap="changeDate(-1)">
          <text class="arrow-icon">‹</text>
        </view>
        <picker
          mode="date"
          :value="selectedDate"
          :start="dateRangeStart"
          :end="dateRangeEnd"
          @change="onDatePick"
        >
          <view class="date-center">
            <text class="date-weekday">{{ dateWeekday }}</text>
            <text class="date-main">{{ dateDisplay }}</text>
            <text v-if="isTomorrow" class="date-tag">明日</text>
          </view>
        </picker>
        <view class="date-arrow" @tap="changeDate(1)">
          <text class="arrow-icon">›</text>
        </view>
      </view>

      <!-- 比赛选择器 -->
      <scroll-view v-if="matches.length > 0" class="match-selector" scroll-x :show-scrollbar="false" enable-flex>
        <view class="match-slider">
          <view
            v-for="m in matches" :key="m.id"
            class="match-card" :class="{ active: m.id === currentMatchId, finished: m.status === 'finished' }"
            @tap="selectMatch(m.id)"
          >
            <view class="card-teams">
              <view class="card-team">
                <image class="card-flag" :src="m.homeTeam.flagUrl" mode="aspectFit" />
                <text class="card-team-name">{{ m.homeTeam.name }}</text>
                <text class="card-team-tag">主</text>
              </view>
              <view class="card-center">
                <text v-if="m.status === 'finished' && m.result" class="card-score">{{ m.result.homeScore }} : {{ m.result.awayScore }}</text>
                <text v-else class="card-vs">VS</text>
              </view>
              <view class="card-team">
                <image class="card-flag" :src="m.awayTeam.flagUrl" mode="aspectFit" />
                <text class="card-team-name">{{ m.awayTeam.name }}</text>
              </view>
            </view>
            <text class="card-time">{{ m.kickoffTime }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 无比赛空状态 -->
      <view v-if="matches.length === 0" class="empty-wrap">
        <text style="font-size:64rpx">⚽</text>
        <text class="empty-text">当日暂无比赛安排</text>
        <text class="empty-hint">试试切换其他日期</text>
      </view>

      <!-- 比赛信息头 -->
      <view v-if="match" class="match-header">
        <text class="stage-tag">{{ match.stage }}</text>
        <view class="teams-row">
          <view class="team-info">
            <image class="team-flag" :src="match.homeTeam.flagUrl" mode="aspectFit" />
            <text class="team-name">{{ match.homeTeam.name }}</text>
            <text class="team-meta">FIFA #{{ match.homeTeam.fifaRank }}</text>
            <text class="team-formation">{{ match.homeTeam.formation }}</text>
          </view>
          <!-- 已完赛显示比分 -->
          <view v-if="match.status === 'finished' && match.result" class="score-circle">
            <text class="score-num">{{ match.result.homeScore }}</text>
            <text class="score-sep">:</text>
            <text class="score-num">{{ match.result.awayScore }}</text>
          </view>
          <!-- 未开赛显示 VS -->
          <view v-else class="vs-circle">
            <text>VS</text>
          </view>
          <view class="team-info">
            <image class="team-flag" :src="match.awayTeam.flagUrl" mode="aspectFit" />
            <text class="team-name">{{ match.awayTeam.name }}</text>
            <text class="team-meta">FIFA #{{ match.awayTeam.fifaRank }}</text>
            <text class="team-formation">{{ match.awayTeam.formation }}</text>
          </view>
        </view>
        <!-- 已完赛显示进球球员 -->
        <view v-if="match.status === 'finished' && match.result" class="scorers-row">
          <view class="scorers-col">
            <text v-for="s in match.result.homeScorers" :key="s" class="scorer-text">{{ s }}</text>
          </view>
          <view class="scorers-col away">
            <text v-for="s in match.result.awayScorers" :key="s" class="scorer-text">{{ s }}</text>
          </view>
        </view>
        <view class="match-meta">
          <text>{{ match.matchDate }} {{ match.kickoffTime }}</text>
          <text>{{ match.venue }}</text>
        </view>
      </view>

      <!-- Tab 栏 -->
      <view v-if="match" class="tab-bar">
        <view
          v-for="(tab, i) in tabs" :key="i"
          class="tab-item" :class="{ active: currentTab === i }"
          @tap="currentTab = i"
        >
          <text class="tab-icon">{{ tab.icon }}</text>
          <text class="tab-label">{{ tab.label }}</text>
        </view>
      </view>

      <!-- Tab 内容 -->
      <view v-if="match" class="tab-content">
        <!-- 已完赛：比赛明细 + 球员状态 + 平台汇总 -->
        <view v-if="match.status === 'finished'">
          <view v-if="currentTab === 0" class="tab-panel">
            <MatchDetail v-if="match.result" :match="match" />
          </view>
          <view v-if="currentTab === 1" class="tab-panel">
            <PlayerStatus
              v-if="playerStatus && match"
              :match="match"
              :home-players="playerStatus.homePlayers"
              :away-players="playerStatus.awayPlayers"
            />
          </view>
          <view v-if="currentTab === 2" class="tab-panel">
            <ExternalPredict v-if="externalPredict" :prediction="externalPredict" />
          </view>
        </view>

        <!-- 未开赛：完整4个Tab -->
        <view v-else>
          <view v-if="currentTab === 0" class="tab-panel">
            <WinPredict v-if="winPrediction" :prediction="winPrediction" />
          </view>
          <view v-if="currentTab === 1" class="tab-panel">
            <PlayerStatus
              v-if="playerStatus && match"
              :match="match"
              :home-players="playerStatus.homePlayers"
              :away-players="playerStatus.awayPlayers"
            />
          </view>
          <view v-if="currentTab === 2" class="tab-panel">
            <ScorePredict v-if="scorePrediction" :prediction="scorePrediction" />
          </view>
          <view v-if="currentTab === 3" class="tab-panel">
            <ExternalPredict v-if="externalPredict" :prediction="externalPredict" />
          </view>
        </view>

        <view class="footer-note">
          <text>{{ match.status === 'finished' ? '比赛已结束' : 'AI模型生成 · 仅供参考' }}</text>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePredictionStore } from '@/stores/prediction'
import { storeToRefs } from 'pinia'
import WinPredict from '@/components/WinPredict/WinPredict.vue'
import PlayerStatus from '@/components/PlayerStatus/PlayerStatus.vue'
import ScorePredict from '@/components/ScorePredict/ScorePredict.vue'
import ExternalPredict from '@/components/ExternalPredict/ExternalPredict.vue'
import MatchDetail from '@/components/MatchDetail/MatchDetail.vue'
import type { Match } from '@/repository'
import { getRepository } from '@/repository'

const store = usePredictionStore()
const { loading, match, winPrediction, playerStatus, scorePrediction, externalPredict, error }
  = storeToRefs(store)

const matches = ref<Match[]>([])
const currentMatchId = ref('')
const currentTab = ref(0)

const tabs = computed(() => {
  const isFinished = match.value?.status === 'finished'
  if (isFinished) {
    return [
      { icon: '📋', label: '比赛明细' },
      { icon: '🏃', label: '球员状态' },
      { icon: '🌐', label: '平台汇总' }
    ]
  }
  return [
    { icon: '📊', label: '胜负预测' },
    { icon: '🏃', label: '球员状态' },
    { icon: '⚽', label: '比分预测' },
    { icon: '🌐', label: '平台汇总' }
  ]
})

// ====== 日期相关 ======
const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function getTomorrow(): Date {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d
}

const selectedDate = ref(formatDate(getTomorrow()))

const isTomorrow = computed(() => {
  return selectedDate.value === formatDate(getTomorrow())
})

const dateDisplay = computed(() => {
  const parts = selectedDate.value.split('-')
  return `${parseInt(parts[1])}月${parseInt(parts[2])}日`
})

const dateWeekday = computed(() => {
  const d = new Date(selectedDate.value)
  return weekdays[d.getDay()]
})

const dateRangeStart = '2026-06-12'

const dateRangeEnd = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return formatDate(d)
})

function changeDate(delta: number) {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() + delta)
  const newDate = formatDate(d)
  if (newDate < dateRangeStart || newDate > dateRangeEnd.value) return
  selectedDate.value = newDate
  loadMatchesByDate(newDate)
}

function onDatePick(e: any) {
  const val = e.detail.value
  if (val && val !== selectedDate.value) {
    selectedDate.value = val
    loadMatchesByDate(val)
  }
}

// ====== 数据加载 ======
async function loadMatchesByDate(date: string) {
  const repo = getRepository()
  const allMatches = await repo.getMatchesByDate(date)
  matches.value = allMatches
  currentMatchId.value = ''
  currentTab.value = 0
  if (allMatches.length > 0) {
    currentMatchId.value = allMatches[0].id
    await store.fetchFullPrediction(allMatches[0].id)
  } else {
    // 无比赛时清空预测数据
    store.$reset()
  }
}

async function selectMatch(id: string) {
  if (id === currentMatchId.value) return
  currentMatchId.value = id
  currentTab.value = 0
  await store.fetchFullPrediction(id)
}

onMounted(() => {
  loadMatchesByDate(selectedDate.value)
})
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: $bg-dark;
}

/* ====== 加载态 ====== */
.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 24rpx;
}

.spinner {
  width: 64rpx;
  height: 64rpx;
  border: 4rpx solid rgba(255, 184, 0, 0.15);
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 26rpx;
  color: $text-muted;
  letter-spacing: 2rpx;
}

.retry-btn {
  padding: 18rpx 56rpx;
  background: $primary-glow;
  border: 1rpx solid $primary;
  border-radius: 40rpx;
  color: $primary;
  font-size: 28rpx;
  font-weight: 600;
  margin-top: 16rpx;
  letter-spacing: 2rpx;
}

/* ====== 日期选择器 ====== */
.date-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx 24rpx 12rpx;
  gap: 28rpx;
}

.date-arrow {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: $bg-card;
  border: 1rpx solid $border;
  transition: all 0.2s;

  &:active {
    background: $primary-glow;
    border-color: $border-active;
  }
}

.arrow-icon {
  font-size: 36rpx;
  font-weight: 700;
  color: $primary;
  line-height: 1;
}

.date-center {
  display: flex;
  align-items: center;
  gap: 14rpx;
  padding: 14rpx 32rpx;
  border-radius: 44rpx;
  background: $bg-card;
  border: 1rpx solid $border;
}

.date-weekday {
  font-size: 26rpx;
  color: $text-muted;
  font-weight: 500;
}

.date-main {
  font-size: 32rpx;
  font-weight: 800;
  color: $text-primary;
  letter-spacing: 1rpx;
}

.date-tag {
  font-size: 20rpx;
  font-weight: 700;
  color: $bg-dark;
  background: $gradient-gold;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  letter-spacing: 1rpx;
}

/* ====== 空状态 ====== */
.empty-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 140rpx 0;
  gap: 20rpx;
}

.empty-text {
  font-size: 32rpx;
  font-weight: 700;
  color: $text-secondary;
}

.empty-hint {
  font-size: 24rpx;
  color: $text-muted;
}

/* ====== 比赛选择器 ====== */
.match-selector {
  padding: 16rpx 0 12rpx;
  background: transparent;
  white-space: nowrap;
  width: 100%;
}

.match-slider {
  display: inline-flex;
  gap: 20rpx;
  padding: 0 24rpx;
}

.match-card {
  flex-shrink: 0;
  width: 320rpx;
  background: $bg-card;
  border: 1rpx solid $border;
  border-radius: 24rpx;
  padding: 24rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.active {
    background: $bg-elevated;
    border-color: $border-active;
    box-shadow: $shadow-glow;
    transform: translateY(-2rpx);
  }

  &.finished {
    border-color: rgba(255, 255, 255, 0.04);

    &.active {
      border-color: $border-active;
      box-shadow: $shadow-glow;
    }
  }
}

.card-teams {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8rpx;
}

.card-team {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
  position: relative;
}

.card-flag {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(255, 184, 0, 0.2);
  background: rgba(255, 255, 255, 0.06);
}

.card-team-name {
  font-size: 22rpx;
  font-weight: 700;
  color: $text-primary;
  white-space: nowrap;
  overflow: visible;
}

.card-team-tag {
  font-size: 16rpx;
  font-weight: 700;
  color: $bg-dark;
  background: $gradient-gold;
  padding: 2rpx 12rpx;
  border-radius: 6rpx;
  letter-spacing: 1rpx;
}

.card-center {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 72rpx;
}

.card-score {
  font-size: 30rpx;
  font-weight: 900;
  color: $primary;
  letter-spacing: 2rpx;
}

.card-vs {
  font-size: 22rpx;
  font-weight: 800;
  color: $text-muted;
  letter-spacing: 2rpx;
}

.card-time {
  display: block;
  text-align: center;
  font-size: 20rpx;
  color: $text-muted;
  margin-top: 12rpx;
  font-weight: 500;
}

/* ====== 比赛信息头 ====== */
.match-header {
  background: $gradient-header;
  border-radius: 28rpx;
  margin: 12rpx 24rpx 0;
  padding: 32rpx 28rpx;
  text-align: center;
  border: 1rpx solid $border;
  box-shadow: $shadow-card;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -40%;
    left: -20%;
    width: 140%;
    height: 80%;
    background: radial-gradient(ellipse, rgba(255, 184, 0, 0.04), transparent 70%);
    pointer-events: none;
  }
}

.stage-tag {
  display: inline-block;
  padding: 6rpx 24rpx;
  border-radius: 10rpx;
  font-size: 22rpx;
  font-weight: 700;
  background: $primary-glow;
  color: $primary;
  margin-bottom: 20rpx;
  letter-spacing: 2rpx;
  border: 1rpx solid rgba(255, 184, 0, 0.2);
}

.teams-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
  margin: 20rpx 0;
}

.team-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.team-flag {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  border: 3rpx solid rgba(255, 184, 0, 0.25);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.3);
}

.team-name {
  font-size: 32rpx;
  font-weight: 800;
  color: $text-primary;
  letter-spacing: 1rpx;
}

.team-meta {
  font-size: 22rpx;
  color: $text-muted;
  font-weight: 500;
}

.team-formation {
  font-size: 20rpx;
  font-weight: 700;
  color: $primary;
  background: $primary-glow;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  border: 1rpx solid rgba(255, 184, 0, 0.15);
}

.vs-circle {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(255, 184, 0, 0.08);
  border: 2rpx solid rgba(255, 184, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 900;
  color: $primary;
  flex-shrink: 0;
  letter-spacing: 2rpx;
}

.score-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  gap: 12rpx;
}

.score-num {
  font-size: 64rpx;
  font-weight: 900;
  color: $primary;
  min-width: 56rpx;
  text-align: center;
  text-shadow: 0 0 20rpx rgba(255, 184, 0, 0.3);
}

.score-sep {
  font-size: 48rpx;
  font-weight: 700;
  color: $text-muted;
  margin: 0 4rpx;
}

.scorers-row {
  display: flex;
  justify-content: center;
  gap: 40rpx;
  margin-top: 12rpx;
}

.scorers-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;

  &.away {
    align-items: center;
  }
}

.scorer-text {
  font-size: 20rpx;
  color: $text-secondary;
  font-weight: 500;
}

.match-meta {
  display: flex;
  justify-content: center;
  gap: 24rpx;
  margin-top: 16rpx;
  font-size: 22rpx;
  color: $text-muted;
  font-weight: 500;
}

/* ====== Tab 栏 ====== */
.tab-bar {
  display: flex;
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: 24rpx;
  padding: 8rpx;
  gap: 6rpx;
  border: 1rpx solid $border;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 18rpx 0;
  border-radius: 18rpx;
  color: $text-muted;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.active {
    background: $primary-glow;
    color: $primary;
    box-shadow: 0 4rpx 16rpx rgba(255, 184, 0, 0.1);
  }
}

.tab-icon {
  display: block;
  font-size: 30rpx;
  margin-bottom: 4rpx;
}

.tab-label {
  font-size: 22rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
}

/* ====== Tab 内容 ====== */
.tab-content {
  flex: 1;
  padding: 20rpx 0 40rpx;
  overflow-y: auto;
}

.tab-panel {
  animation: fadeIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.footer-note {
  text-align: center;
  padding: 36rpx 24rpx;
  color: $text-muted;
  font-size: 22rpx;
  font-weight: 500;
  letter-spacing: 1rpx;
}
</style>