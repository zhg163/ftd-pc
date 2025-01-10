<template>
  <header class="app-header">
    <div class="left">
      <button @click="toggleSidebar" class="toggle-btn">
        <i class="fas fa-bars"></i>
      </button>
      <h1 class="title">飞鹏农田管理系统</h1>
    </div>
    <div class="right">
      <button @click="toggleFullscreen" class="action-btn fullscreen-btn" :title="isFullscreen ? '退出全屏' : '全屏显示'">
        <i class="fas fa-desktop"></i>
        <i :class="['fas', isFullscreen ? 'fa-compress-alt' : 'fa-expand-alt']"></i>
      </button>
      <div class="user-info">
        <span class="welcome">欢迎，</span>
        <span class="username">管理员</span>
        <div class="user-avatar">
          <i class="fas fa-user"></i>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['toggle-sidebar', 'fullscreen-change'])
const props = defineProps({
  isFullscreen: {
    type: Boolean,
    default: false
  }
})

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

const toggleFullscreen = async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen()
    emit('fullscreen-change', true)
  } else {
    await document.exitFullscreen()
    emit('fullscreen-change', false)
  }
}
</script>

<style scoped>
.app-header {
  height: 64px;
  width: 100%;
  background-color: #fff;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 1000;
  min-width: 0;
}

.left {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  white-space: nowrap;
}

.fullscreen-btn {
  position: relative;
  padding: 8px 12px;
  width: auto;
  gap: 8px;
  background-color: #f5f5f5;
  border: 1px solid #e8e8e8;
}

.fullscreen-btn i:first-child {
  font-size: 1.1rem;
  color: #1890ff;
}

.fullscreen-btn i:last-child {
  font-size: 0.9rem;
  color: #1890ff;
}

.fullscreen-btn:hover {
  background-color: #e6f7ff;
  border-color: #1890ff;
}

.toggle-btn,
.action-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.toggle-btn:hover,
.action-btn:hover {
  background-color: #f5f5f5;
  color: #1890ff;
}

.right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
  white-space: nowrap;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.welcome {
  color: #8c8c8c;
  font-size: 0.9rem;
}

.username {
  color: #262626;
  font-weight: 500;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8c8c8c;
  flex-shrink: 0;
}

.user-avatar i {
  font-size: 1.1rem;
}
</style> 