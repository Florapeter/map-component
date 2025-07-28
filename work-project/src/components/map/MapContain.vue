<template>
    <div id="container"></div>
</template>

<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'
import { onMounted, onUnmounted, ref } from 'vue'
import { mapListApi } from '@/api/map'
import icon from '@/assets/flashIcon.png'
import station from '@/assets/station.jpg'

let map: any = null
const markersData = ref<any>([])
onMounted(() => {
    AMapLoader.load({
        key: '4debfb4dedb38932259f58e8ab5af7ed', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '1.4.15', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    })
        .then((AMap) => {
            map = new AMap.Map('container', {
                // 设置地图容器id
                viewMode: '2D',
                zoom: 4, // 初始化地图级别，显示全国
                center: [104.195397, 35.86166], // 中国地理中心
                mapStyle: 'amap://styles/normal',
                restrict: {
                  lnglat: [
                    [73.66, 3.86],    // 中国西南角
                    [135.05, 53.55]   // 中国东北角
                  ]
                }
            })
            //添加自定义标记
            mapListApi().then(({ data }) => {
                markersData.value = data
                //创建信息窗体
                const infoWindow = new AMap.InfoWindow({
                    offset: new AMap.Pixel(0, -30),
                })
                markersData.value.forEach((markerData: any) => {
                    const marker = new AMap.Marker({
                        position: markerData.position,
                        icon: icon, //添加 icon 图标 URL
                        title: '北京',
                    })
                    marker.on('click', () => {
                        infoWindow.setContent(`
                        <div style="display:flex;padding:10px;align-items:center"> 
                            <div>
                            <img src="${station}" width="200px"/>
                            </div>
                            <div style="width:180px;line-height:30px;margin-left:20px">
                            <h3>${markerData.title}</h3>
                            <p>充电桩数量：${markerData.count}</p>
                            <p>充电桩状态：<span style="color:blue">${
                                markerData.status == 1 ? '使用中' : '维护中'
                            }</span></p>
                            </div>
                        </div>
                        `)
                        infoWindow.open(map, marker.getPosition())
                    })
                    map.add(marker)
                })
            })
        })
        .catch((e) => {
            console.log(e)
        })
})

onUnmounted(()=>{
    map?.destroy()
})
</script>

<style scoped lang="less">
#container {
    width: 100%;
    height: 80vh;
}
</style>
