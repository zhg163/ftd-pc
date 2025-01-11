<template>
  <div class="map-container">
    <div id="container" class="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { MAP_CONFIG } from '@/config/map'

const map = ref(null)
const infoWindow = ref(null)
const markers = ref([])
// 添加行政区图层变量
const worldLayer = ref(null)
const provinceLayer = ref(null)
const districtPolygons = ref([])
const districtSearch = ref(null)
const townshipSearch = ref(null)  // 添加乡镇查询对象
const villageSearch = ref(null)  // 添加村级查询对象

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
    position: [126.6869, 45.7556],
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

// 初始化地图
const initMap = async () => {
  try {
    const AMap = await AMapLoader.load({
      key: MAP_CONFIG.key,
      version: MAP_CONFIG.version,
      plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.DistrictLayer', 'AMap.DistrictSearch']
    })

    // 创建地图实例
    map.value = new AMap.Map('container', {
      zoom: 2,
      center: [0, 0],
      pitch: 0,
      viewMode: '3D',
      mapStyle: 'amap://styles/normal'
    })

    // 添加比例尺控件
    map.value.addControl(new AMap.Scale({
      position: 'LT',
      offset: new AMap.Pixel(10, 10)
    }))
    
    // 添加工具条控件
    map.value.addControl(new AMap.ToolBar({
      position: 'RB',
      offset: new AMap.Pixel(10, 30)
    }))

    // 添加世界国家边界图层
    worldLayer.value = new AMap.DistrictLayer.World({
      zIndex: 10,
      styles: {
        'nation-stroke': '#3366FF',
        'coastline-stroke': '#3366FF',
        'nation-stroke-width': 2,
        'coastline-stroke-width': 2,
        'fill': '#FFFFFF',
        'fill-opacity': 0.8
      }
    })
    map.value.add(worldLayer.value)

    // 创建省级行政区图层
    provinceLayer.value = new AMap.DistrictLayer.Province({
      zIndex: 12,
      styles: {
        'fill': '#FFFFFF',
        'province-stroke': '#3366FF',
        'province-stroke-width': 1,
        'fill-opacity': 0.7
      }
    })
    
    // 创建行政区查询对象
    districtSearch.value = new AMap.DistrictSearch({
      level: 'district',
      subdistrict: 1,
      showbiz: false,
      extensions: 'all'
    })

    // 创建乡镇查询对象
    townshipSearch.value = new AMap.DistrictSearch({
      level: 'street',
      subdistrict: 1,
      showbiz: false,
      extensions: 'all'
    })

    // 创建村级查询对象
    villageSearch.value = new AMap.DistrictSearch({
      level: 'village',
      subdistrict: 1,
      showbiz: false,
      extensions: 'all'
    })

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
  } catch (e) {
    console.error('地图加载失败：', e)
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
        image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png'  // 使用蓝色标记
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

  if (zoom <= 4) {  // 全球视图 1:2000km
    content = `
      <div class="info-window">
        <h4>${point.country}</h4>
        <p>所在区域：${point.region}</p>
        <p>公司数量：${point.companyCount}家</p>
      </div>
    `
  } else if (zoom <= 8) {  // 国家视图 1:100km
    content = `
      <div class="info-window">
        <h4>${point.companyName}</h4>
        <p>所属农场数量：${point.farmCount}个</p>
        <p>总农场面积：${point.totalArea}</p>
        <p>无人机总数：${point.droneCount}台</p>
      </div>
    `
  } else if (zoom <= 12) {  // 区域视图 1:50km
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
  } else {  // 农场视图 1:500m
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
    newZoom = 8  // 切换到国家视图
  } else if (zoom <= 8) {
    newZoom = 12  // 切换到区域视图
  } else if (zoom <= 12) {
    newZoom = 15  // 切换到农场视图
  }

  map.value.setZoomAndCenter(newZoom, point.position)
}

// 处理缩放变化
const handleZoomChange = () => {
  const zoom = map.value.getZoom()
  console.log('当前缩放级别:', zoom)  // 添加日志
  
  // 清除所有现有边界
  if (districtPolygons.value.length) {
    map.value.remove(districtPolygons.value)
    districtPolygons.value = []
  }
  
  // 控制不同级别行政区边界的显示
  if (zoom >= 5) {  // 1:500公里时显示省级边界
    worldLayer.value.hide()
    provinceLayer.value.setMap(map.value)
    console.log('显示省级边界')  // 添加日志
    
    // 在缩放到1:20公里时，显示县级边界
    if (zoom >= 10) {
      const center = map.value.getCenter()
      console.log('搜索县级边界, 中心点:', center)  // 添加日志
      
      // 先搜索县级边界
      districtSearch.value.search(center, (status, result) => {
        console.log('县级搜索结果:', status, result)  // 添加日志
        if (status === 'complete' && result.districtList && result.districtList.length > 0) {
          const district = result.districtList[0]
          console.log('找到县级区域:', district.name)  // 添加日志
          
          if (district.boundaries) {
            const polygons = district.boundaries.map(bound => {
              return new AMap.Polygon({
                path: bound,
                strokeColor: '#3366FF',
                strokeWeight: 1,
                fillColor: '#FFFFFF',
                fillOpacity: 0.5,
                zIndex: 13
              })
            })
            districtPolygons.value.push(...polygons)
            map.value.add(polygons)
          }

          // 在缩放到1:2公里时，显示乡镇边界
          if (zoom >= 14) {
            console.log('搜索乡镇边界')  // 添加日志
            townshipSearch.value.search(district.name, (status, result) => {
              console.log('乡镇搜索结果:', status, result)  // 添加日志
              if (status === 'complete' && result.districtList && result.districtList.length > 0) {
                result.districtList.forEach(township => {
                  if (township.boundaries) {
                    const townPolygons = township.boundaries.map(bound => {
                      return new AMap.Polygon({
                        path: bound,
                        strokeColor: '#3366FF',
                        strokeWeight: 1,
                        strokeStyle: 'dashed',
                        fillColor: '#FFFFFF',
                        fillOpacity: 0.3,
                        zIndex: 14
                      })
                    })
                    districtPolygons.value.push(...townPolygons)
                    map.value.add(townPolygons)
                  }

                  // 在缩放到1:1公里时，显示村级边界
                  if (zoom >= 16) {
                    console.log('搜索村级边界')  // 添加日志
                    villageSearch.value.search(township.name, (status, result) => {
                      console.log('村级搜索结果:', status, result)  // 添加日志
                      if (status === 'complete' && result.districtList && result.districtList.length > 0) {
                        result.districtList.forEach(village => {
                          if (village.boundaries) {
                            const villagePolygons = village.boundaries.map(bound => {
                              return new AMap.Polygon({
                                path: bound,
                                strokeColor: '#3366FF',
                                strokeWeight: 1,
                                strokeStyle: 'dotted',
                                fillColor: '#FFFFFF',
                                fillOpacity: 0.2,
                                zIndex: 15
                              })
                            })
                            districtPolygons.value.push(...villagePolygons)
                            map.value.add(villagePolygons)
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        }
      })
    }
  } else {
    // 缩小时恢复世界地图边界
    worldLayer.value.show()
    provinceLayer.value.setMap(null)
  }

  // 更新信息窗口内容
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
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.map {
  width: 100%;
  height: 100%;
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