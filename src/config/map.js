// 地图配置
export const MAP_CONFIG = {
  key: import.meta.env.VITE_AMAP_KEY,
  version: '2.0',
  plugins: [
    'AMap.InfoWindow',
    'AMap.Marker',
    'AMap.LabelMarker',
    'AMap.Scale',
    'AMap.ToolBar',
    'AMap.MapType'
  ]
}

// 合作农场数据
export const PARTNER_FARMS = [
  {
    name: '北京示范农场',
    location: [116.4074, 39.9042],
    type: '水稻种植',
    area: '2000亩'
  },
  {
    name: '上海现代农场',
    location: [121.4737, 31.2304],
    type: '智能温室',
    area: '1500亩'
  },
  {
    name: '广州生态农场',
    location: [113.2644, 23.1291],
    type: '有机蔬菜',
    area: '1800亩'
  },
  {
    name: '成都示范基地',
    location: [104.0665, 30.5723],
    type: '果蔬种植',
    area: '2200亩'
  },
  {
    name: '武汉智慧农场',
    location: [114.3055, 30.5928],
    type: '水稻种植',
    area: '2500亩'
  },
  {
    name: '西安农业基地',
    location: [108.9402, 34.3416],
    type: '粮食作物',
    area: '3000亩'
  }
] 