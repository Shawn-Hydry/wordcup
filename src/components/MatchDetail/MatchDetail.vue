<template>
  <view class="match-detail">
    <!-- 比赛概要 -->
    <view class="summary-card">
      <view class="summary-teams">
        <view class="summary-team">
          <image class="summary-flag" :src="match.homeTeam.flagUrl" mode="aspectFit" />
          <text class="summary-name">{{ match.homeTeam.name }}</text>
        </view>
        <view class="summary-score">
          <text class="score-big">{{ match.result!.homeScore }}</text>
          <text class="score-dash">-</text>
          <text class="score-big">{{ match.result!.awayScore }}</text>
        </view>
        <view class="summary-team">
          <image class="summary-flag" :src="match.awayTeam.flagUrl" mode="aspectFit" />
          <text class="summary-name">{{ match.awayTeam.name }}</text>
        </view>
      </view>
      <view class="summary-meta">
        <text>{{ match.stage }}</text>
        <text>{{ match.matchDate }} {{ match.kickoffTime }}</text>
        <text>{{ match.venue }}</text>
      </view>
    </view>

    <!-- 进球时间轴 -->
    <view class="timeline-section">
      <view class="section-title">
        <text class="title-icon">⚽</text>
        <text class="title-text">比赛时间轴</text>
      </view>

      <!-- 空时间轴状态 -->
      <view v-if="!sortedTimeline.length" class="empty-timeline">
        <text class="empty-text">暂无时间轴数据</text>
      </view>

      <view v-else class="timeline">
        <!-- 上半场标记 -->
        <view class="period-marker">
          <view class="period-line" />
          <text class="period-label">上半场</text>
          <view class="period-line" />
        </view>

        <template v-for="(event, idx) in sortedTimeline" :key="idx">
          <!-- 半场分隔 -->
          <view v-if="isHalfStart(event, idx)" class="period-marker">
            <view class="period-line" />
            <text class="period-label">下半场</text>
            <view class="period-line" />
          </view>

          <view class="event-row" :class="{ 'event-away': event.team === 'away' }">
            <!-- 主队侧 -->
            <view class="event-side home-side">
              <template v-if="event.team === 'home'">
                <view class="event-badge" :class="badgeClass(event)">
                  <text class="badge-icon">{{ badgeIcon(event) }}</text>
                </view>
                <view class="event-info">
                  <text class="event-player">{{ event.player }}</text>
                  <text class="event-type">{{ typeLabel(event) }}</text>
                </view>
              </template>
            </view>

            <!-- 时间 -->
            <view class="event-time">
              <text class="time-num">{{ event.minute }}'</text>
              <text v-if="event.isExtraTime" class="time-extra">+</text>
            </view>

            <!-- 客队侧 -->
            <view class="event-side away-side">
              <template v-if="event.team === 'away'">
                <view class="event-info">
                  <text class="event-player">{{ event.player }}</text>
                  <text class="event-type">{{ typeLabel(event) }}</text>
                </view>
                <view class="event-badge" :class="badgeClass(event)">
                  <text class="badge-icon">{{ badgeIcon(event) }}</text>
                </view>
              </template>
            </view>
          </view>
        </template>

        <!-- 全场结束标记 -->
        <view class="period-marker final">
          <view class="period-line" />
          <text class="period-label final-label">全场结束</text>
          <view class="period-line" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Match, GoalEvent } from '@/repository'

const props = defineProps<{
  match: Match
}>()

const sortedTimeline = computed(() => {
  if (!props.match.result?.timeline) return []
  return [...props.match.result.timeline].sort((a, b) => a.minute - b.minute)
})

function isHalfStart(event: GoalEvent, idx: number): boolean {
  return event.minute > 45 && idx > 0 && sortedTimeline.value[idx - 1].minute <= 45
}

function badgeClass(event: GoalEvent): string {
  if (event.type === 'own_goal') return 'badge-own'
  if (event.type === 'penalty') return 'badge-penalty'
  return 'badge-goal'
}

function badgeIcon(event: GoalEvent): string {
  if (event.type === 'own_goal') return '😵'
  if (event.type === 'penalty') return '🎯'
  return '⚽'
}

function typeLabel(event: GoalEvent): string {
  if (event.type === 'own_goal') return '乌龙球'
  if (event.type === 'penalty') return '点球'
  return '进球'
}
</script>

<style lang="scss" scoped>
.match-detail {
  padding: 0 24rpx;
}

/* 比赛概要 */
.summary-card {
  background: $bg-card;
  border-radius: 24rpx;
  padding: 32rpx 28rpx;
  margin-bottom: 24rpx;
  border: 1rpx solid $border;
  box-shadow: $shadow-card;
}

.summary-teams {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28rpx;
}

.summary-team {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.summary-flag {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(255, 184, 0, 0.2);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3);
}

.summary-name {
  font-size: 28rpx;
  font-weight: 800;
  color: $text-primary;
  letter-spacing: 1rpx;
}

.summary-score {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.score-big {
  font-size: 56rpx;
  font-weight: 900;
  color: $primary;
  text-shadow: 0 0 20rpx rgba(255, 184, 0, 0.25);
}

.score-dash {
  font-size: 40rpx;
  color: $text-muted;
}

.summary-meta {
  display: flex;
  justify-content: center;
  gap: 20rpx;
  margin-top: 20rpx;
  font-size: 22rpx;
  color: $text-muted;
  font-weight: 500;
}

/* 时间轴区域 */
.timeline-section {
  background: $bg-card;
  border-radius: 24rpx;
  padding: 28rpx;
  border: 1rpx solid $border;
  box-shadow: $shadow-card;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 28rpx;
}

.title-icon {
  font-size: 32rpx;
}

.title-text {
  font-size: 30rpx;
  font-weight: 800;
  color: $text-primary;
  letter-spacing: 1rpx;
}

/* 半场分隔 */
.period-marker {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 14rpx 0;
}

.period-line {
  flex: 1;
  height: 1rpx;
  background: linear-gradient(90deg, transparent, rgba(255, 184, 0, 0.15), transparent);
}

.period-label {
  font-size: 22rpx;
  font-weight: 700;
  color: $text-muted;
  white-space: nowrap;
  letter-spacing: 2rpx;
}

.final-label {
  color: $primary;
}

/* 空时间轴 */
.empty-timeline {
  padding: 48rpx 0;
  text-align: center;
}

.empty-timeline .empty-text {
  font-size: 26rpx;
  color: $text-muted;
}

/* 事件行 */
.event-row {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  position: relative;

  &.event-away {
    flex-direction: row;
  }
}

.event-side {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  min-height: 52rpx;

  &.home-side {
    justify-content: flex-end;
  }

  &.away-side {
    justify-content: flex-start;
  }
}

.event-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.event-player {
  font-size: 26rpx;
  font-weight: 700;
  color: $text-primary;
}

.event-type {
  font-size: 18rpx;
  color: $text-muted;
  font-weight: 500;
}

.event-badge {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.badge-goal {
    background: $primary-glow;
    border: 1rpx solid rgba(255, 184, 0, 0.3);
  }

  &.badge-penalty {
    background: rgba(91, 141, 239, 0.15);
    border: 1rpx solid rgba(91, 141, 239, 0.3);
  }

  &.badge-own {
    background: rgba(255, 71, 87, 0.15);
    border: 1rpx solid rgba(255, 71, 87, 0.3);
  }
}

.badge-icon {
  font-size: 22rpx;
}

.event-time {
  width: 68rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
}

.time-num {
  font-size: 26rpx;
  font-weight: 800;
  color: $primary;
  font-variant-numeric: tabular-nums;
}

.time-extra {
  font-size: 18rpx;
  color: $primary;
  position: absolute;
  top: -4rpx;
  right: 4rpx;
  font-weight: 700;
}
</style>
