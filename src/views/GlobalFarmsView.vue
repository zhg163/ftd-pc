<template>
  <div class="global-farms-view">
    <div class="map-container" id="container" ref="mapContainer">
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <div class="loading-text">{{ loadingText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

const loading = ref(true)
const loadingText = ref('正在加载地图...')

// 农场数据
const farmData = {
  // 亚洲农场
  asia: [
    { coordinates: [121.4737, 31.2304], count: 35, name: "上海示范农场" },
    { coordinates: [139.6917, 35.6895], count: 30, name: "东京智能农场" },
    { coordinates: [103.8198, 1.3521], count: 25, name: "新加坡生态园" },
    { coordinates: [77.2090, 28.6139], count: 28, name: "新德里农业基地" },
    { coordinates: [114.1095, 22.3964], count: 26, name: "香港科技农场" }
  ],
  // 欧洲农场
  europe: [
    { coordinates: [2.3522, 48.8566], count: 32, name: "巴黎现代农场" },
    { coordinates: [-0.1276, 51.5074], count: 29, name: "伦敦智慧农场" },
    { coordinates: [13.4050, 52.5200], count: 27, name: "柏林生态基地" },
    { coordinates: [12.4964, 41.9028], count: 24, name: "罗马有机农场" },
    { coordinates: [4.9041, 52.3676], count: 23, name: "阿姆斯特丹温室" }
  ],
  // 北美农场
  northAmerica: [
    { coordinates: [-74.0059, 40.7128], count: 34, name: "纽约科技农场" },
    { coordinates: [-118.2437, 34.0522], count: 31, name: "洛杉矶绿色基地" },
    { coordinates: [-79.3832, 43.6532], count: 28, name: "多伦多智能农场" },
    { coordinates: [-123.1207, 49.2827], count: 26, name: "温哥华生态园" },
    { coordinates: [-112.0740, 33.4484], count: 25, name: "凤凰城沙漠农场" }
  ],
  // 南美洲农场
  southAmerica: [
    { coordinates: [-46.6333, -23.5505], count: 28, name: "巴西圣保罗农场" },
    { coordinates: [-58.3816, -34.6037], count: 24, name: "阿根廷布宜诺斯艾利斯农场" },
    { coordinates: [-70.6483, -33.4489], count: 20, name: "智利圣地亚哥农场" }
  ],
  // 大洋洲农场
  oceania: [
    { coordinates: [151.2093, -33.8688], count: 32, name: "澳大利亚悉尼农场" },
    { coordinates: [174.7633, -36.8485], count: 18, name: "新西兰奥克兰农场" }
  ],
  // 非洲农场
  africa: [
    { coordinates: [18.4241, -33.9249], count: 22, name: "南非开普敦农场" },
    { coordinates: [36.8219, -1.2921], count: 26, name: "肯尼亚内罗毕农场" },
    { coordinates: [-7.5898, 33.5731], count: 19, name: "摩洛哥卡萨布兰卡农场" }
  ]
}

// 合并所有农场数据
const allFarms = [
  ...farmData.asia,
  ...farmData.europe,
  ...farmData.northAmerica,
  ...farmData.southAmerica,
  ...farmData.oceania,
  ...farmData.africa
]

let map = null
let loca = null

// 预加载地图资源
const preloadMapResources = () => {
  const preloadLink = document.createElement('link')
  preloadLink.rel = 'preload'
  preloadLink.as = 'script'
  preloadLink.href = `https://webapi.amap.com/maps?v=2.0&key=${import.meta.env.VITE_AMAP_KEY}`
  document.head.appendChild(preloadLink)
}

onMounted(async () => {
  try {
    preloadMapResources()
    
    // 加载 AMap
    loadingText.value = '正在加载地图资源...'
    const AMap = await AMapLoader.load({
      key: import.meta.env.VITE_AMAP_KEY,
      version: '2.0',
      plugins: [
        'AMap.Scale',
        'AMap.ToolBar',
        'AMap.ControlBar',
        'AMap.InfoWindow',
        'AMap.DistrictLayer'
      ],
      Loca: {
        version: '2.0.0'
      }
    })

    // 创建地图实例
    loadingText.value = '正在初始化地图...'
    map = new AMap.Map('container', {
      zoom: 3,
      center: [20, 0],
      viewMode: '3D',
      mapStyle: 'amap://styles/dark',
      showLabel: false,
      pitch: 45,
      rotation: 0,
      showBuildingBlock: false,
      features: ['bg', 'point', 'road'],
      preloadMode: true,
      fadeOnZoom: false,
      defaultCursor: 'pointer'
    })

    // 添加世界国家边界图层
    const worldDistrict = new AMap.DistrictLayer.World({
      zIndex: 5,
      styles: {
        'nation-stroke': '#22ffff',
        'coastline-stroke': '#22ffff',
        'fill': 'transparent',
        'nation-stroke-width': 1,
        'coastline-stroke-width': 1,
        'nation-stroke-opacity': 0.8
      }
    })
    map.add(worldDistrict)

    // 添加地图控件
    map.addControl(new AMap.Scale())
    map.addControl(new AMap.ToolBar({
      position: { top: '20px', right: '20px' }
    }))

    // 添加 3D 控制控件
    const controlBar = new AMap.ControlBar({
      position: { top: '80px', right: '20px' },
      showZoomBar: false,
      showControlButton: true
    })
    map.addControl(controlBar)

    // 创建 Loca 实例
    loadingText.value = '正在创建可视化图层...'
    const Loca = window.Loca
    loca = new Loca.Container({
      map,
      animate: false
    })

    // 创建点图层
    const pointLayer = new Loca.ScatterLayer({
      container: loca,
      zIndex: 10,
      opacity: 1,
      visible: true,
      zooms: [2, 22],
      blend: 'normal'
    })

    // 准备 GeoJSON 数据
    const geoJsonData = {
      type: 'FeatureCollection',
      features: allFarms.map(farm => ({
        type: 'Feature',
        properties: {
          name: farm.name,
          count: farm.count,
          value: farm.count
        },
        geometry: {
          type: 'Point',
          coordinates: farm.coordinates
        }
      }))
    }

    // 设置点图层数据
    const geo = new Loca.GeoJSONSource({
      data: geoJsonData
    })
    pointLayer.setSource(geo)

    // 设置点图层样式
    pointLayer.setStyle({
      unit: 'px',
      size: function(obj) {
        if (obj && obj.properties && typeof obj.properties.count === 'number') {
          return obj.properties.count / 1.5;
        }
        return 15; // 默认大小
      },
      color: '#FF8C00',  // 深橙色
      borderWidth: 2,
      borderColor: '#FFFAF0',  // 浅米色边框
      opacity: 0.9,
      blend: 'lighter'
    })

    // 创建连接线图层
    const lineLayer = new Loca.LinkLayer({
      container: loca,
      zIndex: 9,
      opacity: 0.8,
      visible: true,
      zooms: [2, 22],
      depth: true
    })

    // 创建连接线数据
    const lines = []
    for (let i = 0; i < allFarms.length; i++) {
      for (let j = i + 1; j < allFarms.length; j++) {
        if (Math.random() < 0.2) { // 随机生成20%的连接线
          lines.push({
            coordinates: [allFarms[i].coordinates, allFarms[j].coordinates]
          })
        }
      }
    }

    // 设置连接线数据
    const lineGeo = new Loca.GeoJSONSource({
      data: {
        type: 'FeatureCollection',
        features: lines.map(line => ({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: line.coordinates
          }
        }))
      }
    })
    lineLayer.setSource(lineGeo)

    // 设置连接线样式
    lineLayer.setStyle({
      unit: 'px',
      lineWidth: 2,
      opacity: 0.6,
      color: '#00FFFF',
      height: [0, 300],
      blend: 'lighter'
    })

    // 添加图层到容器
    loca.add(pointLayer)
    loca.add(lineLayer)

    // 等待地图加载完成
    await new Promise((resolve) => {
      map.on('complete', resolve)
    })

    // 计算非洲农场的边界
    const africaFarms = farmData.africa
    const africaBounds = new AMap.Bounds(
      [Math.min(...africaFarms.map(f => f.coordinates[0])) - 10, 
       Math.min(...africaFarms.map(f => f.coordinates[1])) - 10],
      [Math.max(...africaFarms.map(f => f.coordinates[0])) + 10,
       Math.max(...africaFarms.map(f => f.coordinates[1])) + 10]
    )

    // 调整视图以聚焦非洲
    map.setBounds(africaBounds)
    setTimeout(() => {
      map.setStatus({
        animateEnable: true,
        jogEnable: true
      })
      map.setPitch(45)
      map.setRotation(0)
    }, 100)

    // 所有初始化完成后，启用动画
    setTimeout(() => {
      // 更新点图层样式
      pointLayer.setStyle({
        unit: 'px',
        size: function(obj) {
          if (obj && obj.properties && typeof obj.properties.count === 'number') {
            const baseSize = obj.properties.count / 1.5;
            return [baseSize * 0.8, baseSize * 1.2];
          }
          return [12, 15]; // 默认动画大小范围
        },
        color: '#FF8C00',  // 深橙色
        borderWidth: 2,
        borderColor: '#FFFAF0',  // 浅米色边框
        opacity: 0.9,
        blend: 'lighter',
        animation: {
          enable: true,
          duration: 2000,
          easing: 'linear',
          opacity: [0.7, 1]
        }
      })

      // 更新连接线样式
      lineLayer.setStyle({
        unit: 'px',
        lineWidth: 1,
        opacity: 0.4,  // 降低连接线透明度
        color: '#FFA500',  // 橙色，与点颜色协调
        height: [0, 300],
        blend: 'lighter',
        animation: {
          enable: true,
          duration: 3000,
          easing: 'linear',
          opacity: [0.2, 0.4],
          height: [200, 400]
        }
      })

      loca.animate.start()
      loading.value = false
    }, 500)

    // 添加点击事件
    let currentInfoWindow = null
    pointLayer.on('mousemove', (e) => {
      const farm = e.rawData
      // 关闭之前的信息窗体
      if (currentInfoWindow) {
        currentInfoWindow.close()
      }
      // 显示信息窗体
      currentInfoWindow = new AMap.InfoWindow({
        content: `
          <div style="padding: 12px; background: rgba(0, 0, 0, 0.8); border-radius: 4px; min-width: 150px;">
            <h4 style="margin: 0 0 8px; color: #fff; font-size: 16px;">${farm.properties.name}</h4>
            <p style="margin: 0; color: #00ffff; font-size: 14px;">规模指数: ${farm.properties.value}</p>
          </div>
        `,
        offset: new AMap.Pixel(0, -20),
        closeWhenClickMap: true
      })
      currentInfoWindow.open(map, farm.geometry.coordinates)
    })

    // 添加点击事件，点击农场时聚焦并旋转视角
    pointLayer.on('click', (e) => {
      const farm = e.rawData
      map.setStatus({
        animateEnable: true,
        jogEnable: true
      })
      map.setZoomAndCenter(4, farm.geometry.coordinates, false, 1000)
      map.setPitch(60)
      map.setRotation(-45)
    })

    // 添加地图点击事件，恢复默认视角
    map.on('click', () => {
      if (currentInfoWindow) {
        currentInfoWindow.close()
        currentInfoWindow = null
      }
    })

    // 添加双击事件，恢复默认视角
    map.on('dblclick', () => {
      map.setStatus({
        animateEnable: true,
        jogEnable: true
      })
      map.setZoomAndCenter(2, [40, 0], false, 1000)
      map.setPitch(35)
      map.setRotation(0)
    })

  } catch (error) {
    console.error('Failed to load map:', error)
    loading.value = false
    loadingText.value = '地图加载失败，请刷新重试'
  }
})

onUnmounted(() => {
  if (loca) {
    loca.animate.stop()
    loca.destroy()
  }
  if (map) {
    map.destroy()
  }
})
</script>

<style scoped>
.global-farms-view {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #000;
  margin: -16px;
  overflow: hidden;
}

.map-container {
  flex: 1;
  min-height: 0;
  position: relative;
  box-shadow: inset 0 0 50px rgba(0, 255, 255, 0.1);
}

:deep(.amap-container) {
  background: #000 !important;
}

:deep(.amap-scale) {
  background-color: rgba(0, 0, 0, 0.6) !important;
  border-color: rgba(0, 255, 255, 0.3) !important;
  color: #00FFFF !important;
  padding: 2px 4px !important;
  border-radius: 2px !important;
}

:deep(.amap-toolbar) {
  background-color: rgba(0, 0, 0, 0.6) !important;
  border: 1px solid rgba(0, 255, 255, 0.3) !important;
  border-radius: 4px !important;
}

:deep(.amap-toolbar .amap-toolbar-item) {
  border-color: rgba(0, 255, 255, 0.3) !important;
  color: #00FFFF !important;
}

:deep(.amap-controlbar) {
  background-color: rgba(0, 0, 0, 0.6) !important;
  border: 1px solid rgba(0, 255, 255, 0.3) !important;
  border-radius: 4px !important;
}

:deep(.amap-controlbar .amap-controlbar-item) {
  border-color: rgba(0, 255, 255, 0.3) !important;
  color: #00FFFF !important;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 255, 255, 0.1);
  border-top: 3px solid #00FFFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
}

.loading-text {
  color: #00FFFF;
  font-size: 14px;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 全屏模式样式 */
:fullscreen .global-farms-view,
::backdrop .global-farms-view {
  margin: 0;
}

/* 添加地图边框发光效果 */
.map-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  box-shadow: inset 0 0 100px rgba(0, 255, 255, 0.1);
  z-index: 1;
}

/* 添加角落装饰 */
.map-container::after {
  content: '';
  position: absolute;
  width: 100px;
  height: 100px;
  border: 2px solid rgba(0, 255, 255, 0.2);
  border-radius: 0 0 100% 0;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}
</style> 