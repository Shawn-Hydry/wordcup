<template>
  <view class="match-header">
    <view class="stage-badge">
      <text class="tag tag-primary">{{ match.stage }}</text>
    </view>

    <view class="teams-row">
      <view class="team team-home">
        <text class="team-flag">{{ match.homeTeam.flag }}</text>
        <text class="team-name">{{ match.homeTeam.name }}</text>
        <text class="team-rank">FIFA #{{ match.homeTeam.fifaRank }}</text>
      </view>

      <view class="vs-badge">
        <text class="vs-text">VS</text>
        <text class="match-time">{{ match.kickoffTime }}</text>
      </view>

      <view class="team team-away">
        <text class="team-flag">{{ match.awayTeam.flag }}</text>
        <text class="team-name">{{ match.awayTeam.name }}</text>
        <text class="team-rank">FIFA #{{ match.awayTeam.fifaRank }}</text>
      </view>
    </view>

    <view class="match-info">
      <text class="info-text">📅 {{ match.matchDate }}</text>
      <text class="info-text">🏟️ {{ match.venue }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Match } from '@/repository'

defineProps<{
  match: Match
}>()
</script>

<style lang="scss" scoped>
.match-header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20rpx;
  padding: 32rpx 24rpx;
  margin: 16rpx;
  text-align: center;
}

.stage-badge {
  margin-bottom: 20rpx;
}

.teams-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
  margin: 24rpx 0;
}

.team {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.team-flag {
  font-size: 72rpx;
}

.team-name {
  font-size: 30rpx;
  font-weight: 700;
  color: #e0e0e0;
}

.team-rank {
  font-size: 22rpx;
  color: #6a6a7a;
}

.vs-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.vs-text {
  font-size: 36rpx;
  font-weight: 900;
  color: #00d4ff;
  background: rgba(0, 212, 255, 0.1);
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.match-time {
  font-size: 24rpx;
  color: #a0a0b0;
}

.match-info {
  display: flex;
  justify-content: center;
  gap: 32rpx;
  margin-top: 16rpx;
}

.info-text {
  font-size: 24rpx;
  color: #6a6a7a;
}
</style>