<template>
  <aside class="app-sidebar" :class="{ collapsed }">
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/dashboard" class="nav-link">
            <i class="fas fa-desktop"></i>
            <span class="nav-text">合作大屏</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/global-farms" class="nav-link">
            <i class="fas fa-globe"></i>
            <span class="nav-text">全球农场</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/" class="nav-link">
            <i class="fas fa-home"></i>
            <span class="nav-text">我的农场</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/map" class="nav-link">
            <i class="fas fa-map-marked-alt"></i>
            <span class="nav-text">农田地图</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/analysis" class="nav-link">
            <i class="fas fa-chart-line"></i>
            <span class="nav-text">数据分析</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/tasks" class="nav-link">
            <i class="fas fa-tasks"></i>
            <span class="nav-text">任务管理</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/alerts" class="nav-link">
            <i class="fas fa-bell"></i>
            <span class="nav-text">预警信息</span>
          </router-link>
        </li>
      </ul>
    </nav>
    <button class="collapse-btn" @click="$emit('toggle-sidebar')">
      <i :class="['fas', collapsed ? 'fa-angle-right' : 'fa-angle-left']"></i>
    </button>
  </aside>
</template>

<script setup>
defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-sidebar'])
</script>

<style scoped>
.app-sidebar {
  width: 250px;
  min-width: 250px;
  background-color: #fff;
  border-right: 1px solid #f0f0f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-x: hidden;
  height: 100%;
  position: fixed;
  left: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.app-sidebar.collapsed {
  width: 24px;
  min-width: 24px;
}

.nav-list {
  list-style: none;
  padding: 8px;
  margin: 0;
  height: 100%;
  overflow-y: auto;
}

.nav-item {
  margin: 4px 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #595959;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 6px;
  gap: 16px;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.nav-link:hover {
  background-color: #f5f5f5;
  color: #1890ff;
  transform: translateX(4px);
}

.nav-link.router-link-active {
  background-color: #e6f7ff;
  color: #1890ff;
  font-weight: 500;
}

.nav-link.router-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 16px;
  background-color: #1890ff;
  border-radius: 0 3px 3px 0;
}

.nav-link i {
  width: 20px;
  text-align: center;
  font-size: 1.1rem;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.nav-text {
  font-size: 0.95rem;
  opacity: 0.95;
  white-space: nowrap;
  transition: opacity 0.3s ease, width 0.3s ease;
  overflow: hidden;
}

.app-sidebar.collapsed .nav-link {
  padding: 12px;
  justify-content: center;
}

.app-sidebar.collapsed .nav-text {
  opacity: 0;
  width: 0;
  margin: 0;
}

.app-sidebar.collapsed .nav-link:hover {
  transform: translateX(0) scale(1.1);
}

.collapse-btn {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #1890ff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1001;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

.collapse-btn:hover {
  background: #40a9ff;
  color: #fff;
  box-shadow: 0 2px 12px rgba(24, 144, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}
</style> 