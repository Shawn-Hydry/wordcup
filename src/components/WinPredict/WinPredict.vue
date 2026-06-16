<template>
  <view class="card">
    <text class="section-title">胜平负预测</text>

    <!-- 概率条 -->
    <view class="prob-section">
      <view class="prob-bar">
        <text class="prob-label">主胜</text>
        <view class="prob-track">
          <view class="prob-fill prob-home" :style="{ width: (prediction.homeWinProb * 100) + '%' }" />
        </view>
        <text class="prob-value">{{ (prediction.homeWinProb * 100).toFixed(1) }}%</text>
      </view>

      <view class="prob-bar">
        <text class="prob-label">平局</text>
        <view class="prob-track">
          <view class="prob-fill prob-draw" :style="{ width: (prediction.drawProb * 100) + '%' }" />
        </view>
        <text class="prob-value">{{ (prediction.drawProb * 100).toFixed(1) }}%</text>
      </view>

      <view class="prob-bar">
        <text class="prob-label">客胜</text>
        <view class="prob-track">
          <view class="prob-fill prob-away" :style="{ width: (prediction.awayWinProb * 100) + '%' }" />
        </view>
        <text class="prob-value">{{ (prediction.awayWinProb * 100).toFixed(1) }}%</text>
      </view>
    </view>

    <!-- 爆冷指数 -->
    <view class="upset-box">
      <view class="upset-header">
        <text class="upset-label">爆冷指数</text>
        <text class="upset-value" :class="'upset-' + prediction.upsetLevel">
          {{ upsetText }}
        </text>
      </view>
      <view class="upset-bar">
        <view class="upset-fill" :class="'upset-' + prediction.upsetLevel"
          :style="{ width: (prediction.upsetProb * 100) + '%' }" />
      </view>
    </view>

    <view class="divider" />

    <!-- 打法分析 -->
    <view class="analysis-block">
      <text class="block-title">战术打法分析</text>
      <text class="block-text">{{ prediction.tacticalAnalysis }}</text>
    </view>

    <view class="divider" />

    <!-- 教练对比 -->
    <view class="analysis-block">
      <text class="block-title">教练对比分析</text>
      <text class="block-text">{{ prediction.coachComparison }}</text>
    </view>

    <view class="divider" />

    <!-- 关键因素 -->
    <view class="factors-block">
      <text class="block-title">关键因素</text>
      <view class="factor-item" v-for="(factor, i) in prediction.keyFactors" :key="i">
        <text class="factor-dot" />
        <text class="factor-text">{{ factor }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WinPrediction } from '@/repository'

const props = defineProps<{
  prediction: WinPrediction
}>()

const upsetText = computed(() => {
  const map = { low: '低风险', medium: '中等风险', high: '高风险' }
  return map[props.prediction.upsetLevel] + ' (' + (props.prediction.upsetProb * 100).toFixed(0) + '%)'
})
</script>

<style lang="scss" scoped>
.prob-section {
  margin-bottom: 20rpx;
}

.prob-home { background: linear-gradient(90deg, #00E5A0, #00B87D); }
.prob-draw { background: $gradient-gold; }
.prob-away { background: linear-gradient(90deg, #5B8DEF, #3D6FD9); }

.upset-box {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16rpx;
  padding: 24rpx;
  border: 1rpx solid $border;

  .upset-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14rpx;
  }

  .upset-label {
    font-size: 26rpx;
    color: $text-secondary;
    font-weight: 600;
  }

  .upset-value {
    font-size: 26rpx;
    font-weight: 700;
    padding: 6rpx 18rpx;
    border-radius: 10rpx;
    letter-spacing: 1rpx;

    &.upset-low    { color: $success; background: rgba(0, 229, 160, 0.12); }
    &.upset-medium { color: $warning; background: $primary-glow; }
    &.upset-high   { color: $danger; background: rgba(255, 71, 87, 0.12); }
  }

  .upset-bar {
    height: 14rpx;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 7rpx;
    overflow: hidden;

    .upset-fill {
      height: 100%;
      border-radius: 7rpx;
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);

      &.upset-low    { background: $success; }
      &.upset-medium { background: $gradient-gold; }
      &.upset-high   { background: $danger; }
    }
  }
}

.analysis-block, .factors-block {
  margin: 12rpx 0;
}

.block-title {
  font-size: 28rpx;
  font-weight: 800;
  color: $primary;
  margin-bottom: 14rpx;
  display: block;
  letter-spacing: 1rpx;
}

.block-text {
  font-size: 26rpx;
  color: $text-secondary;
  line-height: 1.9;
  white-space: pre-line;
}

.factor-item {
  display: flex;
  align-items: flex-start;
  gap: 14rpx;
  margin: 10rpx 0;
}

.factor-dot {
  width: 12rpx;
  height: 12rpx;
  background: $gradient-gold;
  border-radius: 50%;
  margin-top: 14rpx;
  flex-shrink: 0;
}

.factor-text {
  font-size: 26rpx;
  color: $text-secondary;
  line-height: 1.7;
}
</style>