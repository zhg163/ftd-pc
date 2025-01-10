<template>
  <div class="loca-demo">
    <div id="container"></div>
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <div class="loading-text">{{ loadingText }}</div>
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

// 合并所有农场数据为一个数组
const allFarms = [
  ...farmData.asia,
  ...farmData.europe,
  ...farmData.northAmerica,
  ...farmData.southAmerica,
  ...farmData.oceania,
  ...farmData.africa
]

// 生成示例数据
const confucius_data = allFarms.map(farm => ({
  lnglat: farm.coordinates,
  name: farm.name,
  value: farm.count
}))

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
      plugins: [], // 移除不必要的插件
      Loca: {
        version: '2.0.0'
      }
    })

    // 创建地图实例
    loadingText.value = '正在初始化地图...'
    map = new AMap.Map('container', {
      zoom: 2,
      center: [40, 0],
      viewMode: '3D',
      mapStyle: 'amap://styles/dark',
      showLabel: false,
      pitch: 35,
      rotation: 0,
      showBuildingBlock: false,
      features: ['bg', 'point'], // 只加载必要的地图要素
      preloadMode: true, // 开启预加载模式
      fadeOnZoom: false, // 禁用缩放动画
      defaultCursor: 'default'
    })

    // 创建 Loca 实例
    loadingText.value = '正在创建可视化图层...'
    const Loca = window.Loca
    loca = new Loca.Container({
      map,
      animate: false // 初始禁用动画
    })

    // 创建图层
    const layer = new Loca.ScatterLayer({
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
      features: confucius_data.map(item => ({
        type: 'Feature',
        properties: {
          name: item.name,
          value: item.value
        },
        geometry: {
          type: 'Point',
          coordinates: item.lnglat
        }
      }))
    }

    // 设置数据
    const geo = new Loca.GeoJSONSource({
      data: geoJsonData
    })
    layer.setSource(geo)

    // 设置样式 - 简化动画效果
    layer.setStyle({
      unit: 'px',
      size: 15,
      color: '#00FFFF',
      borderWidth: 1,
      borderColor: '#ffffff',
      opacity: 0.8
    })

    // 添加图层到容器
    loca.add(layer)

    // 等待地图加载完成
    await new Promise((resolve) => {
      map.on('complete', resolve)
    })

    // 调整视图
    const bounds = new AMap.Bounds(
      [Math.min(...confucius_data.map(d => d.lnglat[0])) - 10, 
       Math.min(...confucius_data.map(d => d.lnglat[1])) - 10],
      [Math.max(...confucius_data.map(d => d.lnglat[0])) + 10,
       Math.max(...confucius_data.map(d => d.lnglat[1])) + 10]
    )
    map.setBounds(bounds)

    // 所有初始化完成后，启用动画
    setTimeout(() => {
      layer.setStyle({
        unit: 'px',
        size: [15, 15],
        color: '#00FFFF',
        borderWidth: 1,
        borderColor: '#ffffff',
        opacity: 0.8,
        animation: {
          enable: true,
          duration: 2000,
          easing: 'linear',
          size: [15, 20]
        }
      })
      loca.animate.start()
      loading.value = false
    }, 500)

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
.loca-demo {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

#container {
  width: 100%;
  height: 100%;
  background: #000;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #00FFFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  color: #fff;
  font-size: 14px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 