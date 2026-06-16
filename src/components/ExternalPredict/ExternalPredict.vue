<template>
  <view class="card">
    <text class="section-title">知名平台预测汇总</text>

    <view class="prediction-list">
      <view class="predict-card" v-for="(item, i) in prediction.predictions" :key="i">
        <view class="predict-header">
          <view class="source-info">
            <text class="source-avatar">{{ item.avatar }}</text>
            <view class="source-meta">
              <text class="source-name">{{ item.source }}</text>
              <text class="source-type-tag">{{ typeLabel(item.sourceType) }}</text>
            </view>
          </view>
          <view class="confidence-badge" :class="confClass(item.confidence)">
            <text>{{ (item.confidence * 100).toFixed(0) }}%</text>
          </view>
        </view>

        <view class="predict-result">
          <text class="result-text">{{ item.prediction }}</text>
        </view>

        <view class="predict-analysis">
          <text class="analysis-text">{{ item.analysis }}</text>
        </view>
      </view>
    </view>

    <!-- 预测一致性 -->
    <view class="consensus-block" v-if="consensus">
      <text class="consensus-title">预测一致性</text>
      <text class="consensus-text">{{ consensus }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ExternalPredictData } from '@/repository'

const props = defineProps<{
  prediction: ExternalPredictData
}>()

function typeLabel(type: string) {
  return { platform: '数据平台', expert: '专家评论', media: '知名媒体' }[type] || type
}

function confClass(conf: number) {
  if (conf >= 0.7) return 'conf-high'
  if (conf >= 0.5) return 'conf-mid'
  return 'conf-low'
}

const consensus = computed(() => {
  const items = props.prediction.predictions
  if (items.length === 0) return ''
  return `共 ${items.length} 个来源，多维度分析仅供参考`
})
</script>

<style lang="scss" scoped>
.prediction-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.predict-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 18rpx;
  padding: 24rpx;
  border: 1rpx solid $border;
  transition: all 0.2s;
}

.predict-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14rpx;
}

.source-info {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.source-avatar {
  font-size: 40rpx;
}

.source-meta {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.source-name {
  font-size: 26rpx;
  font-weight: 700;
  color: $text-primary;
}

.source-type-tag {
  font-size: 20rpx;
  color: $text-muted;
  background: rgba(255, 255, 255, 0.06);
  padding: 3rpx 12rpx;
  border-radius: 6rpx;
  font-weight: 600;
}

.confidence-badge {
  font-size: 22rpx;
  font-weight: 700;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  letter-spacing: 1rpx;

  &.conf-high { background: rgba(0, 229, 160, 0.12); color: $success; }
  &.conf-mid  { background: $primary-glow; color: $warning; }
  &.conf-low  { background: rgba(255, 71, 87, 0.12); color: $danger; }
}

.predict-result {
  background: $primary-glow;
  border-radius: 10rpx;
  padding: 12rpx 18rpx;
  margin-bottom: 12rpx;
  border: 1rpx solid rgba(255, 184, 0, 0.15);
}

.result-text {
  font-size: 28rpx;
  font-weight: 800;
  color: $primary;
  letter-spacing: 1rpx;
}

.analysis-text {
  font-size: 24rpx;
  color: $text-secondary;
  line-height: 1.8;
}

.consensus-block {
  margin-top: 24rpx;
  padding: 20rpx;
  background: $primary-glow;
  border-radius: 16rpx;
  border: 1rpx solid rgba(255, 184, 0, 0.2);
  text-align: center;
}

.consensus-title {
  font-size: 24rpx;
  color: $text-secondary;
  display: block;
  margin-bottom: 8rpx;
  font-weight: 600;
}

.consensus-text {
  font-size: 26rpx;
  font-weight: 700;
  color: $primary;
  letter-spacing: 1rpx;
}
</style>