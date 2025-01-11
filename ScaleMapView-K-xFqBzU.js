import{_ as M,r as i,b as k,d as g,c as h,a as l,n as u,A as $,M as m,o as b}from"./index-DKXKY2aF.js";const C={class:"map-container"},_={class:"scale-controls"},A={__name:"ScaleMapView",setup(S){const o=i(null),t=i(null),r=i(null),n=i("large"),a={position:[116.397428,39.90923],country:"中国",region:"北京市",farmName:"示例农场",introduction:"这是一个示范性的智慧农场",area:"1000亩",droneCount:5,crops:"小麦、玉米",healthIndex:85},v=async()=>{try{const e=await $.load({key:m.key,version:m.version,plugins:["AMap.Scale","AMap.ToolBar"]});o.value=new e.Map("container",{zoom:13,center:a.position}),o.value.addControl(new e.Scale),r.value=new e.InfoWindow({isCustom:!0,autoMove:!0,offset:new e.Pixel(0,-30)}),d(),o.value.on("zoomend",w)}catch(e){console.error("地图加载失败：",e)}},d=()=>{t.value&&t.value.setMap(null),t.value=new AMap.Marker({position:a.position,icon:new AMap.Icon({size:new AMap.Size(25,34),imageSize:new AMap.Size(25,34),image:"https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png"})}),t.value.setMap(o.value),t.value.on("mouseover",()=>{f()})},f=()=>{let e="";switch(n.value){case"large":e=`
        <div class="info-window">
          <h4>基本信息</h4>
          <p>国家：${a.country}</p>
          <p>区域：${a.region}</p>
          <p>农场：${a.farmName}</p>
        </div>
      `;break;case"medium":e=`
        <div class="info-window">
          <h4>${a.farmName}</h4>
          <p>简介：${a.introduction}</p>
          <p>种植面积：${a.area}</p>
          <p>无人机数量：${a.droneCount}台</p>
        </div>
      `;break;case"small":e=`
        <div class="info-window">
          <h4>${a.farmName}</h4>
          <p>种植内容：${a.crops}</p>
          <p>种植面积：${a.area}</p>
          <p><a href="#" onclick="event.preventDefault()">农作物健康度：${a.healthIndex}%</a></p>
        </div>
      `;break}r.value.setContent(e),r.value.open(o.value,a.position)},c=e=>{switch(n.value=e,e){case"large":o.value.setZoom(15);break;case"medium":o.value.setZoom(12);break;case"small":o.value.setZoom(9);break}},w=()=>{const e=o.value.getZoom();e>=14?n.value="large":e>=11?n.value="medium":n.value="small"};return k(()=>{v()}),g(()=>{o.value&&o.value.destroy()}),(e,s)=>(b(),h("div",C,[s[3]||(s[3]=l("div",{id:"container",class:"map"},null,-1)),l("div",_,[l("button",{onClick:s[0]||(s[0]=p=>c("large")),class:u({active:n.value==="large"})},"大比例尺",2),l("button",{onClick:s[1]||(s[1]=p=>c("medium")),class:u({active:n.value==="medium"})},"中比例尺",2),l("button",{onClick:s[2]||(s[2]=p=>c("small")),class:u({active:n.value==="small"})},"小比例尺",2)])]))}},y=M(A,[["__scopeId","data-v-d8397b26"]]);export{y as default};
