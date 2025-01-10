<template>
  <main class="app-main">
    <router-view></router-view>
  </main>
</template>

<script setup>
</script>

<style scoped>
.app-main {
  flex: 1;
  height: 100%;
  overflow: auto;
  background-color: #f0f2f5;
  padding: 1rem;
}

/* 自定义滚动条样式 */
.app-main::-webkit-scrollbar {
  width: 8px;
}

.app-main::-webkit-scrollbar-track {
  background: #f0f2f5;
}

.app-main::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.app-main::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style> 