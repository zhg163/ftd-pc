import{_ as $,r,i as f,d as x,g as I,c as N,a as t,w as c,j as h,k as S,A as b,M as w,o as L}from"./index-Dcpcl8Lb.js";const _={class:"scale-map-view"},z={class:"layer-switch"},T={class:"layer-item"},Z={class:"layer-item"},B={class:"layer-item"},V={__name:"ScaleMapView",setup(D){const n=r(null),i=r(null),M=r([]),m=r(null),p=r(null),d=r("normal"),u=r(!1),v=[{position:[-73.2516,-3.7461],country:"秘鲁",region:"亚马孙平原",companyCount:3,companyName:"秘鲁农业发展公司",farmCount:5,totalArea:"50000亩",droneCount:15,farms:[{name:"亚马孙农场1号",area:"15000亩",drones:5,crops:"玉米、大豆",healthIndex:88},{name:"亚马孙农场2号",area:"35000亩",drones:10,crops:"咖啡、可可",healthIndex:92}]},{position:[-60.6253,-33.7577],country:"阿根廷",region:"潘帕斯草原",companyCount:2,companyName:"阿根廷农业集团",farmCount:4,totalArea:"80000亩",droneCount:20,farms:[{name:"潘帕斯农场1号",area:"40000亩",drones:12,crops:"小麦、大豆",healthIndex:95},{name:"潘帕斯农场2号",area:"40000亩",drones:8,crops:"玉米、向日葵",healthIndex:90}]},{position:[126.772535,45.590819],country:"中国",region:"东北平原",companyCount:5,companyName:"东北农业集团",farmCount:8,totalArea:"100000亩",droneCount:25,farms:[{name:"东北示范农场",area:"50000亩",drones:15,crops:"水稻、大豆",healthIndex:94},{name:"黑土地农场",area:"50000亩",drones:10,crops:"玉米、大豆",healthIndex:92}]},{position:[144.9631,-37.8136],country:"澳大利亚",region:"默里达令盆地",companyCount:4,companyName:"澳大利亚农业公司",farmCount:6,totalArea:"120000亩",droneCount:30,farms:[{name:"默里农场1号",area:"60000亩",drones:15,crops:"小麦、大麦",healthIndex:89},{name:"默里农场2号",area:"60000亩",drones:15,crops:"油菜、棉花",healthIndex:91}]},{position:[3.0588,36.7538],country:"阿尔及利亚",region:"米提扎平原",companyCount:2,companyName:"阿尔及利亚农业公司",farmCount:3,totalArea:"30000亩",droneCount:10,farms:[{name:"米提扎农场1号",area:"15000亩",drones:5,crops:"小麦、橄榄",healthIndex:87},{name:"米提扎农场2号",area:"15000亩",drones:5,crops:"柑橘、蔬菜",healthIndex:90}]}];f(d,a=>{var e,o;a==="normal"?((e=m.value)==null||e.setMap(null),n.value.setMapStyle("amap://styles/normal")):a==="satellite"&&((o=m.value)==null||o.setMap(n.value),n.value.setMapStyle("amap://styles/dark"))}),f(u,a=>{p.value&&p.value.setMap(a?n.value:null)});const C=async()=>{try{const a=await b.load({key:w.key,version:w.version,plugins:["AMap.Scale","AMap.ToolBar","AMap.TileLayer.Satellite","AMap.TileLayer.RoadNet"]});n.value=new a.Map("map",{zoom:2,center:[0,0],pitch:0,viewMode:"3D",mapStyle:"amap://styles/normal",features:["bg","building","point","road","water"],showLabel:!0}),m.value=new a.TileLayer.Satellite,p.value=new a.TileLayer.RoadNet,n.value.addControl(new a.Scale),n.value.addControl(new a.ToolBar),i.value=new a.InfoWindow({isCustom:!0,autoMove:!0,offset:new a.Pixel(0,-30)}),g(),n.value.on("zoomend",A);const e=()=>{const o=document.querySelector(".amap-copyright"),s=document.querySelector(".amap-logo");o&&(o.style.display="none"),s&&(s.style.display="none")};e(),setTimeout(e,100),setTimeout(e,500),n.value.on("complete",()=>{e(),setTimeout(e,100)})}catch(a){console.error("Failed to load map:",a)}},g=()=>{v.forEach(a=>{const e=new AMap.Marker({position:a.position,icon:new AMap.Icon({size:new AMap.Size(25,34),imageSize:new AMap.Size(25,34),image:"https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png"})});e.setMap(n.value),e.on("mouseover",()=>y(a)),e.on("dblclick",()=>k(a)),M.value.push(e)})},y=a=>{const e=n.value.getZoom();let o="";if(e<=4)o=`
      <div class="info-window">
        <h4>${a.country}</h4>
        <p>所在区域：${a.region}</p>
        <p>公司数量：${a.companyCount}家</p>
      </div>
    `;else if(e<=8)o=`
      <div class="info-window">
        <h4>${a.companyName}</h4>
        <p>所属农场数量：${a.farmCount}个</p>
        <p>总农场面积：${a.totalArea}</p>
        <p>无人机总数：${a.droneCount}台</p>
      </div>
    `;else if(e<=12){const s=a.farms.map(l=>`<p>• ${l.name}（${l.area}，${l.drones}台无人机）</p>`).join("");o=`
      <div class="info-window">
        <h4>${a.companyName}</h4>
        <div class="farms-list">
          ${s}
        </div>
      </div>
    `}else{const s=a.farms.map(l=>`
      <div class="farm-detail">
        <h5>${l.name}</h5>
        <p>种植内容：${l.crops}</p>
        <p>农场面积：${l.area}</p>
        <p><a href="#" onclick="event.preventDefault()">农作物健康度：${l.healthIndex}%</a></p>
      </div>
    `).join("");o=`
      <div class="info-window">
        <h4>${a.companyName}</h4>
        ${s}
      </div>
    `}i.value.setContent(o),i.value.open(n.value,a.position)},k=a=>{const e=n.value.getZoom();let o=e;e<=4?o=8:e<=8?o=12:e<=12&&(o=15),n.value.setZoomAndCenter(o,a.position)},A=()=>{const a=n.value.getZoom();if(console.log("当前缩放级别:",a),i.value&&i.value.getIsOpen()){const e=i.value.getPosition(),o=v.find(s=>s.position[0]===e[0]&&s.position[1]===e[1]);o&&y(o)}};return x(()=>{C()}),I(()=>{n.value&&n.value.destroy()}),(a,e)=>(L(),N("div",_,[e[6]||(e[6]=t("div",{id:"map",class:"map-container"},null,-1)),t("div",z,[t("div",T,[c(t("input",{type:"radio",id:"normal",name:"layer",value:"normal","onUpdate:modelValue":e[0]||(e[0]=o=>d.value=o),checked:""},null,512),[[h,d.value]]),e[3]||(e[3]=t("label",{for:"normal"},"标准图层",-1))]),t("div",Z,[c(t("input",{type:"radio",id:"satellite",name:"layer",value:"satellite","onUpdate:modelValue":e[1]||(e[1]=o=>d.value=o)},null,512),[[h,d.value]]),e[4]||(e[4]=t("label",{for:"satellite"},"卫星图",-1))]),t("div",B,[c(t("input",{type:"checkbox",id:"roadNet","onUpdate:modelValue":e[2]||(e[2]=o=>u.value=o)},null,512),[[S,u.value]]),e[5]||(e[5]=t("label",{for:"roadNet"},"路网",-1))])])]))}},R=$(V,[["__scopeId","data-v-aa538075"]]);export{R as default};
