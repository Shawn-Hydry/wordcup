<template>
  <view class="card">
    <text class="section-title">比分预测分析</text>

    <!-- 最可能比分 -->
    <view class="most-likely">
      <text class="most-label">最可能比分</text>
      <text class="most-score">{{ prediction.mostLikelyScore }}</text>
      <text class="most-avg">预期进球 {{ prediction.avgGoals }} 球</text>
    </view>

    <view class="divider" />

    <!-- 比分概率 Top10 -->
    <text class="sub-title">比分概率 Top 10</text>
    <view class="score-list">
      <view class="score-row" v-for="(item, i) in prediction.topScores" :key="item.score"
        :class="{ 'top-1': i === 0 }">
        <text class="score-rank" :class="'rank-' + (i + 1)">{{ i + 1 }}</text>
        <text class="score-text">{{ item.score }}</text>
        <view class="score-bar-track">
          <view class="score-bar-fill" :style="{ width: (item.probability / maxProb * 100) + '%' }" />
        </view>
        <text class="score-prob">{{ (item.probability * 100).toFixed(2) }}%</text>
      </view>
    </view>

    <view class="divider" />

    <!-- 总进球数概率 -->
    <text class="sub-title">总进球数概率</text>
    <view class="goals-grid">
      <view class="goal-card" v-for="item in prediction.totalGoals" :key="item.range">
        <text class="goal-range">{{ item.range }}</text>
        <view class="goal-ring">
          <view class="goal-ring-inner" :style="{ height: (item.probability * 100) + '%' }" />
        </view>
        <text class="goal-prob">{{ (item.probability * 100).toFixed(0) }}%</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ScorePrediction } from '@/repository'

const props = defineProps<{
  prediction: ScorePrediction
}>()

const maxProb = computed(() => props.prediction.topScores[0]?.probability ?? 0.2)
</script>

<style lang="scss" scoped>
.most-likely {
  text-align: center;
  padding: 28rpx 0;
  background: $primary-glow;
  border-radius: 20rpx;
  border: 1rpx solid rgba(255, 184, 0, 0.2);
}

.most-label {
  font-size: 24rpx;
  color: $text-secondary;
  display: block;
  margin-bottom: 10rpx;
  font-weight: 500;
}

.most-score {
  font-size: 60rpx;
  font-weight: 900;
  color: $primary;
  display: block;
  letter-spacing: 10rpx;
  text-shadow: 0 0 24rpx rgba(255, 184, 0, 0.3);
}

.most-avg {
  font-size: 22rpx;
  color: $text-muted;
  margin-top: 10rpx;
  display: block;
  font-weight: 500;
}

.sub-title {
  font-size: 26rpx;
  font-weight: 700;
  color: $text-secondary;
  margin-bottom: 18rpx;
  display: block;
  letter-spacing: 1rpx;
}

.score-list {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.score-row {
  display: flex;
  align-items: center;
  gap: 14rpx;

  &.top-1 {
    background: $primary-glow;
    border-radius: 12rpx;
    padding: 10rpx;
  }
}

.score-rank {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.06);
  color: $text-muted;

  &.rank-1 { background: $gradient-gold; color: $bg-dark; }
  &.rank-2 { background: rgba(192, 192, 192, 0.2); color: #c0c0c0; }
  &.rank-3 { background: rgba(205, 127, 50, 0.2); color: #cd7f32; }
}

.score-text {
  width: 80rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: $text-primary;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.score-bar-track {
  flex: 1;
  height: 14rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 7rpx;
  overflow: hidden;

  .score-bar-fill {
    height: 100%;
    background: $gradient-gold;
    border-radius: 7rpx;
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.score-prob {
  width: 88rpx;
  font-size: 24rpx;
  font-weight: 700;
  color: $primary;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.goals-grid {
  display: flex;
  gap: 14rpx;
}

.goal-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16rpx;
  padding: 18rpx 10rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  border: 1rpx solid $border;
}

.goal-range {
  font-size: 22rpx;
  color: $text-secondary;
  font-weight: 600;
}

.goal-ring {
  width: 40rpx;
  height: 120rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 20rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column-reverse;

  .goal-ring-inner {
    width: 100%;
    background: $gradient-gold;
    border-radius: 20rpx;
    transition: height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.goal-prob {
  font-size: 24rpx;
  font-weight: 700;
  color: $primary;
}
</style>