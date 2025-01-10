<template>
  <div class="homepage-map-container" ref="mapContainer">
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { MAP_CONFIG, PARTNER_FARMS } from '../config/map'

const mapContainer = ref(null)
let map = null
let markers = []
let infoWindow = null
const error = ref('')

onMounted(async () => {
  console.log('HomepageMap mounted, container:', mapContainer.value)
  console.log('MAP_CONFIG:', MAP_CONFIG)
  console.log('PARTNER_FARMS:', PARTNER_FARMS)

  try {
    // 加载地图
    console.log('Loading AMap...')
    const AMap = await AMapLoader.load(MAP_CONFIG)
    console.log('AMap loaded successfully')

    // 初始化地图
    console.log('Initializing map...')
    map = new AMap.Map(mapContainer.value, {
      zoom: 5,
      center: [116.397428, 39.90923],
      viewMode: '3D',
      mapStyle: 'amap://styles/dark',
      showBuildingBlock: true,
      pitch: 35,
      skyColor: '#1E1E1E'
    })
    console.log('Map initialized')

    // 添加地图控件
    map.addControl(new AMap.Scale())
    map.addControl(new AMap.ToolBar())
    map.addControl(new AMap.MapType())
    console.log('Controls added')

    // 创建共用的信息窗体
    infoWindow = new AMap.InfoWindow({
      isCustom: true,
      autoMove: true,
      offset: new AMap.Pixel(0, -30)
    })

    // 添加农场标记和信息窗体
    console.log('Adding markers...')
    PARTNER_FARMS.forEach((farm, index) => {
      console.log(`Adding marker for ${farm.name}`)
      const marker = new AMap.Marker({
        map: map,
        position: farm.location,
        title: farm.name,
        label: {
          content: farm.name,
          direction: 'top'
        },
        animation: 'AMAP_ANIMATION_DROP'
      })

      // 绑定点击事件
      marker.on('click', () => {
        infoWindow.setContent(`
          <div class="farm-info">
            <h4>${farm.name}</h4>
            <p>类型：${farm.type}</p>
            <p>面积：${farm.area}</p>
          </div>
        `)
        infoWindow.open(map, farm.location)
      })

      markers.push(marker)
    })
    console.log('All markers added')

    // 调整视图以包含所有标记
    map.setFitView(null, false, [60, 60, 60, 60])
    console.log('Map view adjusted')

  } catch (err) {
    console.error('地图加载失败:', err)
    error.value = `地图加载失败: ${err.message}`
  }
})

onUnmounted(() => {
  console.log('HomepageMap unmounting...')
  // 清理标记
  if (markers.length) {
    markers.forEach(marker => {
      marker.remove()
    })
    markers = []
  }

  // 清理信息窗体
  if (infoWindow) {
    infoWindow.close()
    infoWindow = null
  }

  // 销毁地图
  if (map) {
    map.destroy()
    map = null
  }
  console.log('HomepageMap cleanup completed')
})
</script>

<style>
.homepage-map-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 0, 0, 0.1);
  color: #ff4d4f;
  padding: 16px;
  border-radius: 4px;
  text-align: center;
}

.farm-info {
  padding: 12px;
  min-width: 200px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
}

.farm-info h4 {
  margin: 0 0 8px 0;
  color: #fff;
  font-size: 16px;
}

.farm-info p {
  margin: 4px 0;
  color: #e6e6e6;
  font-size: 14px;
}

.amap-info-content {
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
}

.amap-info-sharp {
  display: none;
}
</style> 