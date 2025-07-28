<template>
    <div id="china-map-carousel" style="width: 100%; height: 80vh;"></div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'
  import AMapLoader from '@amap/amap-jsapi-loader'
  
  // 示例点数据
  const points = [
    {
      position: [116.397428, 39.90923],
      info: ['北京点1信息', '北京点2信息', '北京点3信息']
    },
    {
      position: [121.473701, 31.230416],
      info: ['上海点1', '上海点2']
    },
    {
      position: [113.264385, 23.129112],
      info: ['广州点1', '广州点2', '广州点3', '广州点4']
    }
  ]
  
  let map: any = null
  let infoWindows: any[] = []
  let carousels: any[] = []
  
  onMounted(() => {
    AMapLoader.load({
      key: '4debfb4dedb38932259f58e8ab5af7ed',
      version: '1.4.15',
      plugins: [],
    }).then((AMap) => {
      map = new AMap.Map('china-map-carousel', {
        viewMode: '2D',
        zoom: 4,
        center: [104.195397, 35.86166],
        mapStyle: 'amap://styles/normal',
        restrict: {
          lnglat: [
            [73.66, 3.86],
            [135.05, 53.55]
          ]
        }
      })
      // 打点并添加轮播信息窗体
      points.forEach((point, idx) => {
        const marker = new AMap.Marker({
          position: point.position,
          title: `点${idx + 1}`
        })
        map.add(marker)
        // 创建信息窗体
        let currentIndex = 0
        const infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(0, -30),
          content: `<div id="carousel-${idx}" style="min-width:160px;min-height:40px;text-align:center;font-size:16px;">${point.info[0]}</div>`
        })
        infoWindows.push(infoWindow)
        // 打开信息窗体
        infoWindow.open(map, marker.getPosition())
        // 轮播动画
        const carousel = setInterval(() => {
          currentIndex = (currentIndex + 1) % point.info.length
          const el = document.getElementById(`carousel-${idx}`)
          if (el) {
            el.innerHTML = point.info[currentIndex]
          }
        }, 2000)
        carousels.push(carousel)
      })
    })
  })
  
  onUnmounted(() => {
    map?.destroy()
    carousels.forEach(c => clearInterval(c))
  })
  </script>
  