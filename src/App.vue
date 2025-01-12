<script setup>
import { RouterView, useRoute } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import AppSidebar from './components/layout/AppSidebar.vue'
import { ref, watch, computed } from 'vue'

const route = useRoute()
const isSidebarCollapsed = ref(false)
const isFullscreen = ref(false)
const previousSidebarState = ref(false)

const isFullscreenRoute = computed(() => route.meta.fullscreen)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const handleFullscreenChange = (fullscreen) => {
  isFullscreen.value = fullscreen
  if (fullscreen) {
    // 记住进入全屏前的导航栏状态
    previousSidebarState.value = isSidebarCollapsed.value
    isSidebarCollapsed.value = true
  } else {
    // 退出全屏时恢复导航栏状态
    isSidebarCollapsed.value = false
  }
}

// 监听全屏变化
document.addEventListener('fullscreenchange', () => {
  handleFullscreenChange(!!document.fullscreenElement)
})
</script>

<template>
  <div class="app">
    <template v-if="!isFullscreenRoute">
      <AppHeader 
        @toggle-sidebar="toggleSidebar" 
        @fullscreen-change="handleFullscreenChange"
        :is-fullscreen="isFullscreen"
      />
      <div class="main-container">
        <AppSidebar :collapsed="isSidebarCollapsed" @toggle-sidebar="toggleSidebar" />
        <main :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
          <RouterView />
        </main>
      </div>
    </template>
    <template v-else>
      <RouterView class="fullscreen-view" />
    </template>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.5;
}

.app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.main-container {
  flex: 1;
  display: flex;
  position: relative;
  min-height: 0;
  width: 100%;
  overflow: hidden;
}

main {
  flex: 1;
  padding: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 250px;
  overflow: auto;
  background-color: #f5f5f5;
  position: relative;
  min-width: 0;
  width: calc(100% - 250px);
}

main.sidebar-collapsed {
  margin-left: 24px;
  width: calc(100% - 24px);
}

.fullscreen-view {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  padding: 0;
  margin: 0;
  background-color: #fff;
}

/* 优化滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

/* 全屏模式样式 */
:fullscreen .app,
::backdrop .app {
  padding: 0;
  background: #fff;
}

:fullscreen main,
::backdrop main {
  margin-left: 0;
  padding: 0;
  width: 100%;
}
</style>
