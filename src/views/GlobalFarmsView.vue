<template>
  <div class="global-farms-view">
    <div class="demo-title">
      <h1>圆点—孔子学院：文化资产的分布及影响</h1>
      <h3>大小点表达孔子学院在各国的开设分布及影响，学院的开设数量随时间发生变化</h3>
    </div>
    <div id="map" class="map-container"></div>
    <canvas id="player"></canvas>
    <div class="count">
      <div class="num">{{ currentCount }}</div>
      <div class="txt">locations</div>
    </div>
    <div class="legend">
      <h4>年份</h4>
      <ul>
        <li v-for="entry in dataMap" :key="entry.label">
          <span :style="{ backgroundColor: entry.color }" class="color-box"></span>
          {{ entry.label }}
        </li>
      </ul>
    </div>
    <div class="timeline">
      <input type="range" min="2005" max="2017" v-model="currentYear" @input="updateSource(currentYear)" />
      <div class="year-label">{{ currentYear }}年</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

const map = ref(null)
const loca = ref(null)
const currentCount = ref(0)
const yearRange = [2005, 2017]
const currentYear = ref(yearRange[0])

// Define colors for each year
const colors = [
  'rgba(156, 4, 24,0.8)',
  'rgba(172, 15, 41,0.8)',
  'rgba(187, 29, 54,0.8)',
  'rgba(201, 44, 66,0.8)',
  'rgba(213, 58, 75,0.8)',
  'rgba(224, 75, 81,0.8)',
  'rgba(233, 91, 86,0.8)',
  'rgba(242, 108, 88,0.8)',
  'rgba(249, 125, 90,0.8)',
  'rgba(253, 143, 91,0.8)',
  'rgba(255, 161, 94,0.8)',
  'rgba(255, 178, 105,0.8)',
  'rgba(255, 195, 136,0.8)'
]

// Map years to colors
const dataMap = [
  { label: '2017年', color: colors[12] },
  { label: '2015年', color: colors[10] },
  { label: '2013年', color: colors[8] },
  { label: '2011年', color: colors[6] },
  { label: '2009年', color: colors[4] },
  { label: '2007年', color: colors[2] },
  { label: '2005年', color: colors[0] }
]

// Mock data for demonstration
const universities = {
  features: [
    { properties: { date: '2005-01-01' }, geometry: { coordinates: [-7.3828125, 8.059229627200192] } },
    { properties: { date: '2010-01-01' }, geometry: { coordinates: [-3.3828125, 5.059229627200192] } },
    { properties: { date: '2015-01-01' }, geometry: { coordinates: [0.3828125, 2.059229627200192] } }
  ]
}

onMounted(async () => {
  try {
    const AMap = await AMapLoader.load({
      key: import.meta.env.VITE_AMAP_KEY,
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.ControlBar']
    })

    map.value = new AMap.Map('map', {
      zoom: 2.4,
      showLabel: false,
      viewMode: '3D',
      center: [-7.3828125, 8.059229627200192],
      mapStyle: 'amap://styles/dark'
    })

    loca.value = new Loca.Container({
      map: map.value
    })

    const pl = new Loca.PointLayer({
      zIndex: 10,
      opacity: 1
    })

    const updateSource = (year) => {
      const features = universities.features.filter(f => {
        const yy = parseInt(f.properties.date.split('-')[0])
        return yy <= year
      })
      currentCount.value = features.length
      const geo = new Loca.GeoJSONSource({
        data: {
          type: 'FeatureCollection',
          features: features.map(f => ({
            type: 'Feature',
            properties: f.properties,
            geometry: f.geometry
          }))
        }
      })
      pl.setSource(geo)
    }

    updateSource(currentYear.value)

    pl.setStyle({
      unit: 'px',
      size: 10,
      color: (index, feature) => {
        const year = parseInt(feature.properties.date.split('-')[0])
        const colorEntry = dataMap.find(entry => year >= parseInt(entry.label))
        return colorEntry ? colorEntry.color : '#FF8C00'
      },
      borderWidth: 1,
      borderColor: '#FFFAF0',
      opacity: 0.9
    })

    loca.value.add(pl)

    // Simulate timeline progression
    setInterval(() => {
      if (currentYear.value < yearRange[1]) {
        currentYear.value++
      } else {
        currentYear.value = yearRange[0]
      }
      updateSource(currentYear.value)
    }, 2000)

  } catch (error) {
    console.error('Failed to load map:', error)
  }
})
</script>

<style scoped>
.global-farms-view {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-container {
  width: 100%;
  height: 100%;
}

.demo-title {
  position: absolute;
  top: 25px;
  left: 25px;
  z-index: 1;
}

h1 {
  font-size: 18px;
  margin: 0;
  color: rgb(180, 180, 190);
}

h3 {
  font-size: 12px;
  font-weight: normal;
  margin-top: 5px;
  color: rgb(150, 150, 150);
}

.count {
  position: absolute;
  bottom: 40px;
  left: 50px;
  z-index: 1;
}

.num {
  font-size: 26px;
  color: #B44322;
}

.txt {
  font-size: 16px;
  color: #775032;
}

#player {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 80%;
  height: 90px;
  padding: 10px;
  background: rgba(100, 100, 100, 0.3);
}

.legend {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 5px;
  color: #fff;
}

.legend h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
}

.legend ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.legend li {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.color-box {
  width: 12px;
  height: 12px;
  display: inline-block;
  margin-right: 8px;
}

.timeline {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  text-align: center;
  color: #fff;
}

.timeline input[type="range"] {
  width: 100%;
}

.year-label {
  margin-top: 5px;
  font-size: 14px;
}
</style>