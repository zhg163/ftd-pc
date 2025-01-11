<template>
  <div class="map-container" id="container">
    <div class="layer-switch">
      <button 
        :class="{ active: currentLayer === 'standard' }" 
        @click="switchLayer('standard')">
        标准地图
      </button>
      <button 
        :class="{ active: currentLayer === 'satellite' }" 
        @click="switchLayer('satellite')">
        卫星地图
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { MAP_CONFIG } from '../config/map'

let map = null
const countryLabels = ref([])
const currentLayer = ref('standard')
let satelliteLayer = null
let roadNetLayer = null

const switchLayer = (type) => {
  if (type === currentLayer.value) return
  
  currentLayer.value = type
  if (type === 'satellite') {
    satelliteLayer.show()
    roadNetLayer.show()
  } else {
    satelliteLayer.hide()
    roadNetLayer.hide()
  }
}

const initMap = async () => {
  const container = document.getElementById('container')
  const canvas = document.createElement('canvas')
  canvas.setAttribute('willReadFrequently', 'true')
  container.appendChild(canvas)

  const AMap = await AMapLoader.load({
    key: MAP_CONFIG.key,
    version: '2.0',
    plugins: ['AMap.LabelMarker', 'AMap.TileLayer.Satellite', 'AMap.TileLayer.RoadNet']
  })
  
  map = new AMap.Map('container', {
    zoom: 2,
    center: [18.5353, 4.3947]
  })

  // 初始化卫星图层和路网图层
  satelliteLayer = new AMap.TileLayer.Satellite()
  roadNetLayer = new AMap.TileLayer.RoadNet()
  map.add([satelliteLayer, roadNetLayer])
  satelliteLayer.hide()
  roadNetLayer.hide()

  // 创建国家名称标签，使用 LabelMarker
  const countries = [
    { name: '中国', position: [105.0, 35.0] },
    { name: '美国', position: [-100.0, 40.0] },
    { name: '俄罗斯', position: [100.0, 60.0] },
    { name: '巴西', position: [-55.0, -10.0] },
    { name: '印度', position: [78.0, 20.0] },
    { name: '澳大利亚', position: [133.0, -25.0] },
    { name: '加拿大', position: [-95.0, 60.0] },
    { name: '中非共和国', position: [18.5353, 4.3947] }
  ]

  countries.forEach(country => {
    const labelMarker = new AMap.LabelMarker({
      position: country.position,
      text: {
        content: country.name,
        direction: 'center',
        style: {
          fontSize: 14,
          fontWeight: 'bold',
          fillColor: '#333',
          strokeColor: '#fff',
          strokeWidth: 2,
          padding: [3, 10],
          backgroundColor: 'rgba(255,255,255,0.7)',
          borderRadius: 3
        }
      },
      rank: 2,
      zIndex: 10
    })
    countryLabels.value.push(labelMarker)
  })

  // 创建标注图层
  const labelLayer = new AMap.LabelsLayer({
    zooms: [2, 4.6],  // 显示范围
    zIndex: 1000,
    collision: true,  // 开启标注避让
    animation: true   // 开启标注动画效果
  })

  // 将标注图层添加到地图
  map.add(labelLayer)
  
  // 将标注添加到标注图层
  labelLayer.add(countryLabels.value)

  map.on('zoomend', handleZoomChange)
  handleZoomChange()
}

const handleZoomChange = () => {
  const zoom = map.getZoom()
  // LabelMarker 会自动根据 zooms 范围显示/隐藏，不需要手动控制
}

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    countryLabels.value.forEach(label => label.setMap(null))
    map.destroy()
  }
})
</script>

<style scoped>
.map-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.layer-switch {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
  background: white;
  padding: 5px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.layer-switch button {
  padding: 6px 12px;
  margin: 0 4px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 2px;
  font-size: 14px;
}

.layer-switch button.active {
  background: #409EFF;
  color: white;
  border-color: #409EFF;
}

.layer-switch button:hover {
  opacity: 0.8;
}
</style> 