import{_ as S,r as i,d as b,e as _,c as P,a as D,A as N,M,o as W}from"./index-Cs4UhnJB.js";const B={class:"map-container"},Z={__name:"ScaleMapView",setup(O){const a=i(null),l=i(null),x=i([]),m=i(null),v=i(null),r=i([]),f=i(null),y=i(null),w=i(null),F=[{position:[-73.2516,-3.7461],country:"秘鲁",region:"亚马孙平原",companyCount:3,companyName:"秘鲁农业发展公司",farmCount:5,totalArea:"50000亩",droneCount:15,farms:[{name:"亚马孙农场1号",area:"15000亩",drones:5,crops:"玉米、大豆",healthIndex:88},{name:"亚马孙农场2号",area:"35000亩",drones:10,crops:"咖啡、可可",healthIndex:92}]},{position:[-60.6253,-33.7577],country:"阿根廷",region:"潘帕斯草原",companyCount:2,companyName:"阿根廷农业集团",farmCount:4,totalArea:"80000亩",droneCount:20,farms:[{name:"潘帕斯农场1号",area:"40000亩",drones:12,crops:"小麦、大豆",healthIndex:95},{name:"潘帕斯农场2号",area:"40000亩",drones:8,crops:"玉米、向日葵",healthIndex:90}]},{position:[126.6869,45.7556],country:"中国",region:"东北平原",companyCount:5,companyName:"东北农业集团",farmCount:8,totalArea:"100000亩",droneCount:25,farms:[{name:"东北示范农场",area:"50000亩",drones:15,crops:"水稻、大豆",healthIndex:94},{name:"黑土地农场",area:"50000亩",drones:10,crops:"玉米、大豆",healthIndex:92}]},{position:[144.9631,-37.8136],country:"澳大利亚",region:"默里达令盆地",companyCount:4,companyName:"澳大利亚农业公司",farmCount:6,totalArea:"120000亩",droneCount:30,farms:[{name:"默里农场1号",area:"60000亩",drones:15,crops:"小麦、大麦",healthIndex:89},{name:"默里农场2号",area:"60000亩",drones:15,crops:"油菜、棉花",healthIndex:91}]},{position:[3.0588,36.7538],country:"阿尔及利亚",region:"米提扎平原",companyCount:2,companyName:"阿尔及利亚农业公司",farmCount:3,totalArea:"30000亩",droneCount:10,farms:[{name:"米提扎农场1号",area:"15000亩",drones:5,crops:"小麦、橄榄",healthIndex:87},{name:"米提扎农场2号",area:"15000亩",drones:5,crops:"柑橘、蔬菜",healthIndex:90}]}],A=async()=>{try{const e=await N.load({key:M.key,version:M.version,plugins:["AMap.Scale","AMap.ToolBar","AMap.DistrictLayer","AMap.DistrictSearch"]});a.value=new e.Map("container",{zoom:2,center:[0,0],pitch:0,viewMode:"3D",mapStyle:"amap://styles/normal"}),a.value.addControl(new e.Scale({position:"LT",offset:new e.Pixel(10,10)})),a.value.addControl(new e.ToolBar({position:"RB",offset:new e.Pixel(10,30)})),m.value=new e.DistrictLayer.World({zIndex:10,styles:{"nation-stroke":"#3366FF","coastline-stroke":"#3366FF","nation-stroke-width":2,"coastline-stroke-width":2,fill:"#FFFFFF","fill-opacity":.8}}),a.value.add(m.value),v.value=new e.DistrictLayer.Province({zIndex:12,styles:{fill:"#FFFFFF","province-stroke":"#3366FF","province-stroke-width":1,"fill-opacity":.7}}),f.value=new e.DistrictSearch({level:"district",subdistrict:1,showbiz:!1,extensions:"all"}),y.value=new e.DistrictSearch({level:"street",subdistrict:1,showbiz:!1,extensions:"all"}),w.value=new e.DistrictSearch({level:"village",subdistrict:1,showbiz:!1,extensions:"all"}),l.value=new e.InfoWindow({isCustom:!0,autoMove:!0,offset:new e.Pixel(0,-30)}),I(),a.value.on("zoomend",$)}catch(e){console.error("地图加载失败：",e)}},I=()=>{F.forEach(e=>{const o=new AMap.Marker({position:e.position,icon:new AMap.Icon({size:new AMap.Size(25,34),imageSize:new AMap.Size(25,34),image:"https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png"})});o.setMap(a.value),o.on("mouseover",()=>g(e)),o.on("dblclick",()=>L(e)),x.value.push(o)})},g=e=>{const o=a.value.getZoom();let n="";if(o<=4)n=`
      <div class="info-window">
        <h4>${e.country}</h4>
        <p>所在区域：${e.region}</p>
        <p>公司数量：${e.companyCount}家</p>
      </div>
    `;else if(o<=8)n=`
      <div class="info-window">
        <h4>${e.companyName}</h4>
        <p>所属农场数量：${e.farmCount}个</p>
        <p>总农场面积：${e.totalArea}</p>
        <p>无人机总数：${e.droneCount}台</p>
      </div>
    `;else if(o<=12){const s=e.farms.map(t=>`<p>• ${t.name}（${t.area}，${t.drones}台无人机）</p>`).join("");n=`
      <div class="info-window">
        <h4>${e.companyName}</h4>
        <div class="farms-list">
          ${s}
        </div>
      </div>
    `}else{const s=e.farms.map(t=>`
      <div class="farm-detail">
        <h5>${t.name}</h5>
        <p>种植内容：${t.crops}</p>
        <p>农场面积：${t.area}</p>
        <p><a href="#" onclick="event.preventDefault()">农作物健康度：${t.healthIndex}%</a></p>
      </div>
    `).join("");n=`
      <div class="info-window">
        <h4>${e.companyName}</h4>
        ${s}
      </div>
    `}l.value.setContent(n),l.value.open(a.value,e.position)},L=e=>{const o=a.value.getZoom();let n=o;o<=4?n=8:o<=8?n=12:o<=12&&(n=15),a.value.setZoomAndCenter(n,e.position)},$=()=>{const e=a.value.getZoom();if(console.log("当前缩放级别:",e),r.value.length&&(a.value.remove(r.value),r.value=[]),e>=5){if(m.value.hide(),v.value.setMap(a.value),console.log("显示省级边界"),e>=10){const o=a.value.getCenter();console.log("搜索县级边界, 中心点:",o),f.value.search(o,(n,s)=>{if(console.log("县级搜索结果:",n,s),n==="complete"&&s.districtList&&s.districtList.length>0){const t=s.districtList[0];if(console.log("找到县级区域:",t.name),t.boundaries){const p=t.boundaries.map(c=>new AMap.Polygon({path:c,strokeColor:"#3366FF",strokeWeight:1,fillColor:"#FFFFFF",fillOpacity:.5,zIndex:13}));r.value.push(...p),a.value.add(p)}e>=14&&(console.log("搜索乡镇边界"),y.value.search(t.name,(p,c)=>{console.log("乡镇搜索结果:",p,c),p==="complete"&&c.districtList&&c.districtList.length>0&&c.districtList.forEach(h=>{if(h.boundaries){const u=h.boundaries.map(d=>new AMap.Polygon({path:d,strokeColor:"#3366FF",strokeWeight:1,strokeStyle:"dashed",fillColor:"#FFFFFF",fillOpacity:.3,zIndex:14}));r.value.push(...u),a.value.add(u)}e>=16&&(console.log("搜索村级边界"),w.value.search(h.name,(u,d)=>{console.log("村级搜索结果:",u,d),u==="complete"&&d.districtList&&d.districtList.length>0&&d.districtList.forEach(C=>{if(C.boundaries){const k=C.boundaries.map(z=>new AMap.Polygon({path:z,strokeColor:"#3366FF",strokeWeight:1,strokeStyle:"dotted",fillColor:"#FFFFFF",fillOpacity:.2,zIndex:15}));r.value.push(...k),a.value.add(k)}})}))})}))}})}}else m.value.show(),v.value.setMap(null);if(l.value&&l.value.getIsOpen()){const o=l.value.getPosition(),n=F.find(s=>s.position[0]===o[0]&&s.position[1]===o[1]);n&&g(n)}};return b(()=>{A()}),_(()=>{a.value&&a.value.destroy()}),(e,o)=>(W(),P("div",B,o[0]||(o[0]=[D("div",{id:"container",class:"map"},null,-1)])))}},T=S(Z,[["__scopeId","data-v-d6c556ee"]]);export{T as default};
