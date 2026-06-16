<template>
  <view class="card">
    <text class="section-title">核心球员状态</text>

    <!-- 两队球员对比 -->
    <view class="teams-grid">
      <!-- 主队 -->
      <view class="team-col">
        <view class="team-label"><image class="team-flag-sm" :src="match.homeTeam.flagUrl" mode="aspectFit" /><text>{{ match.homeTeam.name }}</text></view>
        <view class="player-card" v-for="p in homePlayers" :key="p.number"
          :class="{ 'star-player': p.isStarPlayer }">
          <view class="player-header">
            <text class="player-number">{{ p.number }}</text>
            <text class="player-name">{{ p.name }}</text>
            <text class="position-badge" :class="'pos-' + p.position">{{ p.position }}</text>
          </view>
          <view class="player-stats">
            <view class="stat-item">
              <text class="stat-label">状态</text>
              <text class="stat-value" :class="formClass(p.recentForm)">{{ p.recentForm.toFixed(1) }}</text>
            </view>
            <view class="stat-item">
              <text class="stat-label">进球</text>
              <text class="stat-value">{{ p.recentGoals }}</text>
            </view>
            <view class="stat-item">
              <text class="stat-label">助攻</text>
              <text class="stat-value">{{ p.recentAssists }}</text>
            </view>
          </view>
          <!-- 伤病标签 -->
          <view v-if="p.injury" class="injury-tag" :class="'injury-' + p.injury.status">
            <text>{{ injuryIcon(p.injury.status) }} {{ p.injury.description }}</text>
          </view>
          <view v-if="p.isStarPlayer" class="star-badge">
            <text>⭐ 核心</text>
          </view>
        </view>
      </view>

      <!-- 客队 -->
      <view class="team-col">
        <view class="team-label"><image class="team-flag-sm" :src="match.awayTeam.flagUrl" mode="aspectFit" /><text>{{ match.awayTeam.name }}</text></view>
        <view class="player-card" v-for="p in awayPlayers" :key="p.number"
          :class="{ 'star-player': p.isStarPlayer }">
          <view class="player-header">
            <text class="player-number">{{ p.number }}</text>
            <text class="player-name">{{ p.name }}</text>
            <text class="position-badge" :class="'pos-' + p.position">{{ p.position }}</text>
          </view>
          <view class="player-stats">
            <view class="stat-item">
              <text class="stat-label">状态</text>
              <text class="stat-value" :class="formClass(p.recentForm)">{{ p.recentForm.toFixed(1) }}</text>
            </view>
            <view class="stat-item">
              <text class="stat-label">进球</text>
              <text class="stat-value">{{ p.recentGoals }}</text>
            </view>
            <view class="stat-item">
              <text class="stat-label">助攻</text>
              <text class="stat-value">{{ p.recentAssists }}</text>
            </view>
          </view>
          <view v-if="p.injury" class="injury-tag" :class="'injury-' + p.injury.status">
            <text>{{ injuryIcon(p.injury.status) }} {{ p.injury.description }}</text>
          </view>
          <view v-if="p.isStarPlayer" class="star-badge">
            <text>⭐ 核心</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Match, Player } from '@/repository'

defineProps<{
  match: Match
  homePlayers: Player[]
  awayPlayers: Player[]
}>()

function formClass(value: number) {
  if (value >= 8.5) return 'form-excellent'
  if (value >= 7.0) return 'form-good'
  if (value >= 5.5) return 'form-average'
  return 'form-poor'
}

function injuryIcon(status: string) {
  return { fit: '✅', doubtful: '⚠️', out: '🔴' }[status] || '❓'
}
</script>

<style lang="scss" scoped>
.teams-grid {
  display: flex;
  gap: 16rpx;
}

.team-col {
  flex: 1;
  min-width: 0;
}

.team-label {
  font-size: 26rpx;
  font-weight: 800;
  color: $primary;
  margin-bottom: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  letter-spacing: 1rpx;
}

.team-flag-sm {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 1rpx solid rgba(255, 184, 0, 0.2);
  background: rgba(255, 255, 255, 0.06);
}

.player-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16rpx;
  padding: 18rpx;
  margin-bottom: 12rpx;
  border: 1rpx solid $border;
  position: relative;
  transition: all 0.2s;

  &.star-player {
    border-color: rgba(255, 184, 0, 0.3);
    background: $primary-glow;
  }
}

.player-header {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 12rpx;
}

.player-number {
  font-size: 22rpx;
  color: $text-muted;
  background: rgba(255, 255, 255, 0.06);
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.player-name {
  font-size: 24rpx;
  font-weight: 700;
  color: $text-primary;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.position-badge {
  font-size: 18rpx;
  padding: 3rpx 10rpx;
  border-radius: 6rpx;
  font-weight: 700;
  letter-spacing: 1rpx;

  &.pos-FW { background: rgba(255, 71, 87, 0.15); color: $danger; }
  &.pos-MF { background: rgba(0, 229, 160, 0.15); color: $success; }
  &.pos-DF { background: rgba(91, 141, 239, 0.15); color: $info; }
  &.pos-GK { background: $primary-glow; color: $primary; }
}

.player-stats {
  display: flex;
  gap: 6rpx;
}

.stat-item {
  flex: 1;
  text-align: center;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 10rpx;
  padding: 8rpx 4rpx;
}

.stat-label {
  font-size: 18rpx;
  color: $text-muted;
  display: block;
  font-weight: 500;
}

.stat-value {
  font-size: 24rpx;
  font-weight: 700;
  font-variant-numeric: tabular-nums;

  &.form-excellent { color: $success; }
  &.form-good      { color: $info; }
  &.form-average   { color: $warning; }
  &.form-poor      { color: $danger; }
}

.injury-tag {
  margin-top: 10rpx;
  font-size: 20rpx;
  padding: 6rpx 12rpx;
  border-radius: 8rpx;
  text-align: center;
  font-weight: 600;

  &.injury-fit      { background: rgba(0, 229, 160, 0.1); color: $success; }
  &.injury-doubtful { background: $primary-glow; color: $warning; }
  &.injury-out      { background: rgba(255, 71, 87, 0.1); color: $danger; }
}

.star-badge {
  position: absolute;
  top: -8rpx;
  right: 10rpx;
  font-size: 18rpx;
  color: $bg-dark;
  background: $gradient-gold;
  padding: 3rpx 12rpx;
  border-radius: 8rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
}
</style>