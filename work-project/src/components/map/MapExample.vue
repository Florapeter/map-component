<template>
  <div class="map-example">
    <h2>地图组件示例</h2>
    
    <!-- 中国地图示例 -->
    <div class="map-container">
      <h3>中国地图 - 设备分布</h3>
      <InteractiveMap
        :map-config="chinaMapConfig"
        :geo-coord-map="chinaGeoCoordMap"
        :point-data="chinaPointData"
        :enable-auto-show="true"
        :enable-hover="true"
        :enable-drill-down="true"
        :auto-show-interval="4000"
        @point-click="handleChinaPointClick"
      />
    </div>
    
    <!-- 自定义地图示例 -->
    <div class="map-container">
      <h3>自定义地图 - 工业园分布</h3>
      <InteractiveMap
        :map-config="customMapConfig"
        :geo-coord-map="customGeoCoordMap"
        :point-data="customPointData"
        :show-back-button="true"
        :enable-auto-show="true"
        :enable-hover="true"
        :auto-show-interval="3000"
        @back="handleBack"
        @point-click="handleCustomPointClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import InteractiveMap from './InteractiveMap.vue'
import guangzhouImg from '@/assets/guangzhou.jpg'
import kunshanImg from '@/assets/kunshan.png'
import tianjinImg from '@/assets/tianjing.jpg'
import chengduImg from '@/assets/chengdu.jpg'
import jinanImg from '@/assets/jinan.jpg'
// 导入地图数据
import geojson from '@/echarts/map.json'

// 中国地图配置
const chinaMapConfig = {
  type: 'china' as const,
  backgroundColor: '#000',
  roam: false,
  zoom: 1,
  // 禁用省份悬停弹窗的配置
  disableProvinceHover: true
}

// 中国地图坐标映射
const chinaGeoCoordMap: Record<string, [number, number]> = {
  '华南基地(广日工业园)': [113.4814, 22.9856],
  '华东基地(昆山工业园)': [121.0379, 31.1885],
  '华北基地(天津工业园)': [117.4427, 39.4522],
  '西部基地(成都工业园)': [104.0456, 30.6289],
  '济南华东数字化产业区': [117.1423, 37.2841],
}

// 中国地图点位数据
const chinaPointData = [
  {
    name: '华南基地(广日工业园)',
    value: 86,
    color: 'red',
    img: guangzhouImg,
    infoList: [
      { 
        desc: '华南基地(广日工业园)位于广东省广州市番禺区，它是一座集研发、生产、物流、培训、商务等功能为一体的世界级现代综合产业园，也是国内最大的电梯、电梯零部件及关联产业的生产基地。' 
      }
    ]
  },
  {
    name: '西部基地(成都工业园)',
    value: 65,
    color: '#27ae60',
    img: chengduImg,
    infoList: [
      { 
        desc: '广日股份西部基地（成都工业园）是广日股份在西部地区的重要生产和服务据点，成都作为西部地区的重要中心城市，具有强大的辐射力，能够有效覆盖西部地区广阔的市场。' 
      }
    ]
  },
  {
    name: '华北基地(天津工业园)',
    value: 65,
    color: '#f1c40f',
    img: tianjinImg,
    infoList: [
      { 
        desc: '华北基地(天津工业园)地处华北地区重要位置，能够有效辐射京津冀等北方主要市场，缩短产品运输半径，降低物流成本，提高市场响应速度。' 
      }
    ]
  },
  {
    name: '济南华东数字化产业区',
    value: 65,
    color: '#8e44ad',
    img: jinanImg,
    infoList: [
      { 
        desc: '济南华东数字化产业区位于山东商河经济开发区北区,集广日电梯华东数字化产业园、广日电气（山东）智能制造基地、广日物流（山东）智慧产业园三大子项目于一体。' 
      }
    ]
  },
  {
    name: '华东基地(昆山工业园)',
    value: 65,
    color: '#f39c12',
    img: kunshanImg,
    infoList: [
      { 
        desc: '华东基地(昆山工业园)位于江苏省昆山市淀山湖镇北苑路南侧，毗邻上海虹桥枢纽，地处长三角核心区域，地理位置优越，能够便捷地辐射华东地区。' 
      }
    ]
  }
]

// 自定义地图配置（提供实际的GeoJSON数据）
const customMapConfig = {
  type: 'custom' as const,
  mapData: geojson,
  roam: true,
  zoom: 1
}

// 自定义地图坐标映射
const customGeoCoordMap: Record<string, [number, number]> = {
  '广州塞维拉': [113.4716020723584, 22.98223284511603],
  '广州广日电梯工业有限公司': [113.46893841079651, 22.98131874687681],
  '广州广日电气设备有限公司': [113.4718693932324, 22.97983332404823],
}

// 自定义地图点位数据
const customPointData = [
  {
    name: '广州塞维拉',
    value: 86,
    color: 'red',
    infoList: [
      { desc: '广州塞维拉示例点 - 这是广日工业园的重要组成部分，专注于电梯核心零部件的研发和生产。' }
    ]
  },
  {
    name: '广州广日电梯工业有限公司',
    value: 65,
    color: 'green',
    infoList: [
      { desc: '广州广日电梯工业有限公司 - 作为广日股份的核心制造基地，承担着电梯整机的生产任务，年产能达到数万台。' }
    ]
  },
  {
    name: '广州广日电气设备有限公司',
    value: 65,
    color: 'yellow',
    infoList: [
      { desc: '广州广日电气设备有限公司 - 专注于电梯电气系统的研发和制造，为电梯产品提供可靠的电气控制解决方案。' }
    ]
  }
]

// 事件处理函数
function handleChinaPointClick(pointName: string) {
  console.log('中国地图点击:', pointName)
  // 这里可以处理下钻逻辑
  if (pointName === '华南基地(广日工业园)') {
    // 跳转到详细页面或显示更多信息
    alert(`点击了 ${pointName}，可以在这里实现下钻功能`)
  }
}

function handleCustomPointClick(pointName: string) {
  console.log('自定义地图点击:', pointName)
  // 处理自定义地图的点击事件
  alert(`点击了 ${pointName}`)
}

function handleBack() {
  console.log('返回按钮被点击')
  // 处理返回逻辑
}
</script>

<style scoped lang="less">
.map-example {
  padding: 20px;
  
  h2 {
    color: #333;
    margin-bottom: 20px;
  }
  
  .map-container {
    margin-bottom: 30px;
    
    h3 {
      color: #666;
      margin-bottom: 10px;
      font-size: 16px;
    }
    
    // 地图容器样式
    :deep(.interactive-map-root) {
      height: 400px;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }
  }
}
</style> 