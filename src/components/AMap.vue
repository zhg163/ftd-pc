<template>
  <div class="map-container" ref="mapContainer"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { MAP_CONFIG } from '../config/map'

const mapContainer = ref(null)
const map = ref(null)

onMounted(async () => {
  try {
    const AMap = await AMapLoader.load(MAP_CONFIG)

    map.value = new AMap.Map(mapContainer.value, {
      zoom: 11,
      center: [116.397428, 39.90923],
      viewMode: '3D'
    })

    // 添加控件
    map.value.addControl(new AMap.Scale())
    map.value.addControl(new AMap.ToolBar())
    map.value.addControl(new AMap.MapType())

  } catch (error) {
    console.error('地图加载失败:', error)
  }
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
</style> 