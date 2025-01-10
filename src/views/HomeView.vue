<template>
  <div class="home-view">
    <div class="dashboard" :class="{ 'dashboard-hidden': isFullscreen }">
      <div class="dashboard-card">
        <i class="fas fa-map-marked-alt"></i>
        <div class="card-content">
          <h3>农田总数</h3>
          <p>12 块</p>
        </div>
      </div>
      <div class="dashboard-card">
        <i class="fas fa-chart-area"></i>
        <div class="card-content">
          <h3>总面积</h3>
          <p>1200 亩</p>
        </div>
      </div>
      <div class="dashboard-card">
        <i class="fas fa-tasks"></i>
        <div class="card-content">
          <h3>待处理任务</h3>
          <p>5 个</p>
        </div>
      </div>
      <div class="dashboard-card">
        <i class="fas fa-exclamation-triangle"></i>
        <div class="card-content">
          <h3>预警信息</h3>
          <p>2 条</p>
        </div>
      </div>
    </div>
    <div class="map-section" :class="{ 'map-fullscreen': isFullscreen }">
      <div class="map-container">
        <HomepageMap />
        <div class="map-controls">
          <button class="control-btn" @click="toggleFullscreen">
            <i :class="['fas', isFullscreen ? 'fa-compress' : 'fa-expand']"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HomepageMap from '../components/HomepageMap.vue'

const isFullscreen = ref(false)

const toggleFullscreen = async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    await document.exitFullscreen()
    isFullscreen.value = false
  }
}

// 监听全屏变化
document.addEventListener('fullscreenchange', () => {
  isFullscreen.value = !!document.fullscreenElement
})
</script>

<style scoped>
.home-view {
  padding: clamp(8px, 1vw, 12px);
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

h2 {
  color: #1a1a1a;
  font-size: clamp(1.2rem, 1.8vw, 1.4rem);
  font-weight: 600;
  margin-bottom: clamp(12px, 1.5vw, 16px);
  flex-shrink: 0;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(8px, 1vw, 12px);
  margin-bottom: clamp(8px, 1vw, 12px);
  flex-shrink: 0;
  opacity: 1;
  max-height: 100px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.dashboard-hidden {
  opacity: 0;
  max-height: 0;
  margin-bottom: 0;
  pointer-events: none;
}

.dashboard-card {
  background: white;
  padding: clamp(6px, 0.8vw, 10px);
  border-radius: 6px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: clamp(6px, 0.8vw, 10px);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  min-height: 50px;
}

.dashboard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.dashboard-card i {
  font-size: clamp(1rem, 1.4vw, 1.2rem);
  width: clamp(24px, 2.8vw, 32px);
  height: clamp(24px, 2.8vw, 32px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: #e6f7ff;
  color: #1890ff;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-content h3 {
  margin: 0;
  font-size: clamp(0.7rem, 0.8vw, 0.85rem);
  color: #8c8c8c;
  font-weight: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-content p {
  margin: 1px 0 0;
  font-size: clamp(0.9rem, 1.1vw, 1.1rem);
  font-weight: 600;
  color: #262626;
  line-height: 1.2;
}

.map-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  margin-bottom: 0;
  transition: all 0.3s ease;
}

.map-fullscreen {
  margin-top: -8px;
}

.map-section h3 {
  color: #1a1a1a;
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  font-weight: 600;
  margin-bottom: clamp(12px, 1.5vw, 16px);
  flex-shrink: 0;
}

.map-container {
  position: relative;
  flex: 1;
  min-height: 0;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
}

:deep(.homepage-map-container) {
  height: 100%;
  width: 100%;
}

.map-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #595959;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.control-btn:hover {
  background: #fff;
  color: #1890ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.control-btn i {
  font-size: 1.2rem;
}

@media screen and (max-width: 768px) {
  .dashboard {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 480px) {
  .dashboard {
    grid-template-columns: 1fr;
  }
}
</style> 