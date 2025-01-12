<template>
  <div class="scale-map-view">
    <div id="map" class="map-container"></div>
    <div class="layer-switch">
      <div class="layer-item">
        <input type="radio" id="normal" name="layer" value="normal" v-model="currentLayer" checked>
        <label for="normal">标准图层</label>
      </div>
      <div class="layer-item">
        <input type="radio" id="satellite" name="layer" value="satellite" v-model="currentLayer">
        <label for="satellite">卫星图</label>
      </div>
      <div class="layer-item">
        <input type="checkbox" id="roadNet" v-model="showRoadNet">
        <label for="roadNet">路网</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { MAP_CONFIG } from '@/config/map'

const map = ref(null)
const infoWindow = ref(null)
const markers = ref([])
const satelliteLayer = ref(null)
const roadNetLayer = ref(null)

// 控制图层显示的响应式数据
const currentLayer = ref('normal')
const showRoadNet = ref(false)

// 全球农业点数据
const farmPoints = [
  {
    position: [-73.2516, -3.7461],
    country: '秘鲁',
    region: '亚马孙平原',
    companyCount: 3,
    companyName: '秘鲁农业发展公司',
    farmCount: 5,
    totalArea: '50000亩',
    droneCount: 15,
    farms: [
      {
        name: '亚马孙农场1号',
        area: '15000亩',
        drones: 5,
        crops: '玉米、大豆',
        healthIndex: 88
      },
      {
        name: '亚马孙农场2号',
        area: '35000亩',
        drones: 10,
        crops: '咖啡、可可',
        healthIndex: 92
      }
    ]
  },
  {
    position: [-60.6253, -33.7577],
    country: '阿根廷',
    region: '潘帕斯草原',
    companyCount: 2,
    companyName: '阿根廷农业集团',
    farmCount: 4,
    totalArea: '80000亩',
    droneCount: 20,
    farms: [
      {
        name: '潘帕斯农场1号',
        area: '40000亩',
        drones: 12,
        crops: '小麦、大豆',
        healthIndex: 95
      },
      {
        name: '潘帕斯农场2号',
        area: '40000亩',
        drones: 8,
        crops: '玉米、向日葵',
        healthIndex: 90
      }
    ]
  },
  {
    position: [126.772535, 45.590819],
    country: '中国',
    region: '东北平原',
    companyCount: 5,
    companyName: '东北农业集团',
    farmCount: 8,
    totalArea: '100000亩',
    droneCount: 25,
    farms: [
      {
        name: '东北示范农场',
        area: '50000亩',
        drones: 15,
        crops: '水稻、大豆',
        healthIndex: 94
      },
      {
        name: '黑土地农场',
        area: '50000亩',
        drones: 10,
        crops: '玉米、大豆',
        healthIndex: 92
      }
    ]
  },
  {
    position: [144.9631, -37.8136],
    country: '澳大利亚',
    region: '默里达令盆地',
    companyCount: 4,
    companyName: '澳大利亚农业公司',
    farmCount: 6,
    totalArea: '120000亩',
    droneCount: 30,
    farms: [
      {
        name: '默里农场1号',
        area: '60000亩',
        drones: 15,
        crops: '小麦、大麦',
        healthIndex: 89
      },
      {
        name: '默里农场2号',
        area: '60000亩',
        drones: 15,
        crops: '油菜、棉花',
        healthIndex: 91
      }
    ]
  },
  {
    position: [3.0588, 36.7538],
    country: '阿尔及利亚',
    region: '米提扎平原',
    companyCount: 2,
    companyName: '阿尔及利亚农业公司',
    farmCount: 3,
    totalArea: '30000亩',
    droneCount: 10,
    farms: [
      {
        name: '米提扎农场1号',
        area: '15000亩',
        drones: 5,
        crops: '小麦、橄榄',
        healthIndex: 87
      },
      {
        name: '米提扎农场2号',
        area: '15000亩',
        drones: 5,
        crops: '柑橘、蔬菜',
        healthIndex: 90
      }
    ]
  }
]

// 监听底图切换
watch(currentLayer, (newValue) => {
  if (newValue === 'normal') {
    // 切换到标准图层
    satelliteLayer.value?.setMap(null)
    map.value.setMapStyle('amap://styles/normal')
  } else if (newValue === 'satellite') {
    // 切换到卫星图
    satelliteLayer.value?.setMap(map.value)
    map.value.setMapStyle('amap://styles/dark')
  }
})

// 监听路网显示
watch(showRoadNet, (newValue) => {
  if (roadNetLayer.value) {
    roadNetLayer.value.setMap(newValue ? map.value : null)
  }
})

// 初始化地图
const initMap = async () => {
  try {
    const AMap = await AMapLoader.load({
      key: MAP_CONFIG.key,
      version: MAP_CONFIG.version,
      plugins: [
        'AMap.Scale',
        'AMap.ToolBar',
        'AMap.TileLayer.Satellite',
        'AMap.TileLayer.RoadNet'
      ]
    })

    map.value = new AMap.Map('map', {
      zoom: 2,
      center: [0, 0],
      pitch: 0,
      viewMode: '3D',
      mapStyle: 'amap://styles/normal',
      features: ['bg', 'building', 'point', 'road', 'water'],
      showLabel: true
    })

    // 初始化图层
    satelliteLayer.value = new AMap.TileLayer.Satellite()
    roadNetLayer.value = new AMap.TileLayer.RoadNet()

    // 添加比例尺控件
    map.value.addControl(new AMap.Scale())

    // 添加工具条控件
    map.value.addControl(new AMap.ToolBar())

    // 创建信息窗体
    infoWindow.value = new AMap.InfoWindow({
      isCustom: true,
      autoMove: true,
      offset: new AMap.Pixel(0, -30)
    })

    // 创建标记点
    createMarkers()

    // 监听地图缩放
    map.value.on('zoomend', handleZoomChange)

    // 隐藏版权信息
    const hideCopyright = () => {
      const copyright = document.querySelector('.amap-copyright')
      const logo = document.querySelector('.amap-logo')
      if (copyright) copyright.style.display = 'none'
      if (logo) logo.style.display = 'none'
    }

    hideCopyright()
    setTimeout(hideCopyright, 100)
    setTimeout(hideCopyright, 500)
    map.value.on('complete', () => {
      hideCopyright()
      setTimeout(hideCopyright, 100)
    })

  } catch (error) {
    console.error('Failed to load map:', error)
  }
}

// 创建标记点
const createMarkers = () => {
  farmPoints.forEach(point => {
    const marker = new AMap.Marker({
      position: point.position,
      icon: new AMap.Icon({
        size: new AMap.Size(25, 34),
        imageSize: new AMap.Size(25, 34),
        image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png'
      })
    })

    marker.setMap(map.value)
    marker.on('mouseover', () => showInfoWindow(point))
    marker.on('dblclick', () => handleMarkerDblClick(point))
    markers.value.push(marker)
  })
}

// 显示信息窗体
const showInfoWindow = (point) => {
  const zoom = map.value.getZoom()
  let content = ''

  if (zoom <= 4) {
    content = `
      <div class="info-window">
        <h4>${point.country}</h4>
        <p>所在区域：${point.region}</p>
        <p>公司数量：${point.companyCount}家</p>
      </div>
    `
  } else if (zoom <= 8) {
    content = `
      <div class="info-window">
        <h4>${point.companyName}</h4>
        <p>所属农场数量：${point.farmCount}个</p>
        <p>总农场面积：${point.totalArea}</p>
        <p>无人机总数：${point.droneCount}台</p>
      </div>
    `
  } else if (zoom <= 12) {
    const farmsList = point.farms.map(farm =>
      `<p>• ${farm.name}（${farm.area}，${farm.drones}台无人机）</p>`
    ).join('')

    content = `
      <div class="info-window">
        <h4>${point.companyName}</h4>
        <div class="farms-list">
          ${farmsList}
        </div>
      </div>
    `
  } else {
    const farmsList = point.farms.map(farm => `
      <div class="farm-detail">
        <h5>${farm.name}</h5>
        <p>种植内容：${farm.crops}</p>
        <p>农场面积：${farm.area}</p>
        <p><a href="#" onclick="event.preventDefault()">农作物健康度：${farm.healthIndex}%</a></p>
      </div>
    `).join('')

    content = `
      <div class="info-window">
        <h4>${point.companyName}</h4>
        ${farmsList}
      </div>
    `
  }

  infoWindow.value.setContent(content)
  infoWindow.value.open(map.value, point.position)
}

// 处理标记点双击
const handleMarkerDblClick = (point) => {
  const zoom = map.value.getZoom()
  let newZoom = zoom

  if (zoom <= 4) {
    newZoom = 8
  } else if (zoom <= 8) {
    newZoom = 12
  } else if (zoom <= 12) {
    newZoom = 15
  }

  map.value.setZoomAndCenter(newZoom, point.position)
}

// 处理缩放变化
const handleZoomChange = () => {
  const zoom = map.value.getZoom()
  console.log('当前缩放级别:', zoom)

  if (infoWindow.value && infoWindow.value.getIsOpen()) {
    const position = infoWindow.value.getPosition()
    const point = farmPoints.find(p =>
      p.position[0] === position[0] && p.position[1] === position[1]
    )
    if (point) {
      showInfoWindow(point)
    }
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
.scale-map-view {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-container {
  width: 100%;
  height: 100%;
}

.layer-switch {
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.layer-item {
  margin: 5px 0;
  display: flex;
  align-items: center;
}

.layer-item label {
  margin-left: 8px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.layer-item input {
  cursor: pointer;
}

/* 隐藏版权信息和logo */
:deep(.amap-copyright),
:deep(.amap-logo) {
  display: none !important;
}

:deep(.info-window) {
  padding: 15px;
  max-width: 300px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(51, 102, 255, 0.2);
  backdrop-filter: blur(8px);
}

:deep(.info-window h4) {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding-bottom: 8px;
}

:deep(.info-window h5) {
  margin: 12px 0 8px 0;
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

:deep(.info-window p) {
  margin: 8px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  display: flex;
  align-items: center;
}

:deep(.info-window p::before) {
  content: '';
  display: inline-block;
  width: 4px;
  height: 4px;
  background: rgba(51, 102, 255, 0.6);
  border-radius: 50%;
  margin-right: 8px;
}

:deep(.info-window .farms-list) {
  max-height: 200px;
  overflow-y: auto;
}

:deep(.info-window .farm-detail) {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

:deep(.info-window .farm-detail:last-child) {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

:deep(.info-window a) {
  color: #3366FF;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  padding-bottom: 2px;
}

:deep(.info-window a:hover) {
  color: #668cff;
}

:deep(.info-window a::after) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transition: transform 0.3s ease;
  transform-origin: right;
}

:deep(.info-window a:hover::after) {
  transform: scaleX(1);
  transform-origin: left;
}
</style>