<template>
  <div class="map-view">
    <ScaleMapView />
  </div>
</template>

<script setup>
import ScaleMapView from './ScaleMapView.vue'
</script>

<style scoped>
.map-view {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

:deep(.map-container) {
  width: 100%;
  height: 100%;
}
</style> 