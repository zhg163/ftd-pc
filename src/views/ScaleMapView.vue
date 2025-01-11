<template>
  <div class="map-container">
    <div id="container" class="map"></div>
    <div class="scale-controls">
      <button @click="setScale('large')" :class="{ active: currentScale === 'large' }">大比例尺</button>
      <button @click="setScale('medium')" :class="{ active: currentScale === 'medium' }">中比例尺</button>
      <button @click="setScale('small')" :class="{ active: currentScale === 'small' }">小比例尺</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { MAP_CONFIG } from '@/config/map'

const map = ref(null)
const marker = ref(null)
const infoWindow = ref(null)
const currentScale = ref('large')

// 示例数据
const farmData = {
  position: [116.397428, 39.90923],
  country: '中国',
  region: '北京市',
  farmName: '示例农场',
  introduction: '这是一个示范性的智慧农场',
  area: '1000亩',
  droneCount: 5,
  crops: '小麦、玉米',
  healthIndex: 85
}

// 初始化地图
const initMap = async () => {
  try {
    const AMap = await AMapLoader.load({
      key: MAP_CONFIG.key,
      version: MAP_CONFIG.version,
      plugins: ['AMap.Scale', 'AMap.ToolBar']
    })

    map.value = new AMap.Map('container', {
      zoom: 13,
      center: farmData.position
    })

    // 添加比例尺控件
    map.value.addControl(new AMap.Scale())
    
    // 创建信息窗体
    infoWindow.value = new AMap.InfoWindow({
      isCustom: true,
      autoMove: true,
      offset: new AMap.Pixel(0, -30)
    })

    // 创建标记
    createMarker()

    // 监听地图缩放
    map.value.on('zoomend', handleZoomChange)
  } catch (e) {
    console.error('地图加载失败：', e)
  }
}

// 创建标记
const createMarker = () => {
  if (marker.value) {
    marker.value.setMap(null)
  }

  marker.value = new AMap.Marker({
    position: farmData.position,
    icon: new AMap.Icon({
      size: new AMap.Size(25, 34),
      imageSize: new AMap.Size(25, 34),
      image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png'
    })
  })

  marker.value.setMap(map.value)
  
  // 添加鼠标移入事件
  marker.value.on('mouseover', () => {
    showInfoWindow()
  })
}

// 显示信息窗体
const showInfoWindow = () => {
  let content = ''
  
  switch (currentScale.value) {
    case 'large':
      content = `
        <div class="info-window">
          <h4>基本信息</h4>
          <p>国家：${farmData.country}</p>
          <p>区域：${farmData.region}</p>
          <p>农场：${farmData.farmName}</p>
        </div>
      `
      break
    case 'medium':
      content = `
        <div class="info-window">
          <h4>${farmData.farmName}</h4>
          <p>简介：${farmData.introduction}</p>
          <p>种植面积：${farmData.area}</p>
          <p>无人机数量：${farmData.droneCount}台</p>
        </div>
      `
      break
    case 'small':
      content = `
        <div class="info-window">
          <h4>${farmData.farmName}</h4>
          <p>种植内容：${farmData.crops}</p>
          <p>种植面积：${farmData.area}</p>
          <p><a href="#" onclick="event.preventDefault()">农作物健康度：${farmData.healthIndex}%</a></p>
        </div>
      `
      break
  }

  infoWindow.value.setContent(content)
  infoWindow.value.open(map.value, farmData.position)
}

// 设置比例尺
const setScale = (scale) => {
  currentScale.value = scale
  switch (scale) {
    case 'large':
      map.value.setZoom(15)
      break
    case 'medium':
      map.value.setZoom(12)
      break
    case 'small':
      map.value.setZoom(9)
      break
  }
}

// 处理缩放变化
const handleZoomChange = () => {
  const zoom = map.value.getZoom()
  if (zoom >= 14) {
    currentScale.value = 'large'
  } else if (zoom >= 11) {
    currentScale.value = 'medium'
  } else {
    currentScale.value = 'small'
  }
}

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map.value) {
    map.value.destroy()
  }
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}

.scale-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.scale-controls button {
  margin: 0 5px;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.scale-controls button.active {
  background: #409EFF;
  color: white;
  border-color: #409EFF;
}

:deep(.info-window) {
  padding: 10px;
  max-width: 300px;
}

:deep(.info-window h4) {
  margin: 0 0 10px 0;
  color: #333;
}

:deep(.info-window p) {
  margin: 5px 0;
  color: #666;
}

:deep(.info-window a) {
  color: #409EFF;
  text-decoration: none;
}
</style> 