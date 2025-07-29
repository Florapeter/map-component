<template>
  <div class="interactive-map-root" ref="rootRef">
    <!-- 返回按钮，仅在需要时显示 -->
    <button v-if="showBackButton" class="back-btn" @click="$emit('back')">返回</button>
    
    <!-- 地图容器 -->
    <div ref="chartRef" style="width: 100%; height: 100%; position: relative;"></div>
    
    <!-- 信息弹窗 -->
    <transition name="bubble-switch" mode="out-in">
      <div
        v-if="showInfo"
        :style="infoStyle"
        class="custom-info-bubble"
        ref="infoBubbleRef"
        :key="currentPointName"
      >
        <img v-if="infoImg" :src="infoImg" class="info-img-bubble" @load="onBubbleImgLoad" />
        <div class="info-content-bubble">
          <div class="info-card-bubble">
            <div class="info-desc-bubble">{{ currentInfo?.desc }}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch, computed } from 'vue'
import * as echarts from 'echarts'

// 定义组件属性
interface PointData {
  name: string
  value: number
  color: string
  img?: string
  infoList: Array<{ desc: string; title?: string }>
}

interface MapConfig {
  type: 'china' | 'custom'
  mapData?: any // 自定义地图的 GeoJSON 数据
  backgroundColor?: string
  roam?: boolean
  zoom?: number
  center?: [number, number]
  disableProvinceHover?: boolean // 是否禁用省份悬停弹窗
}

interface Props {
  // 地图配置
  mapConfig: MapConfig
  // 坐标映射
  geoCoordMap: Record<string, [number, number]>
  // 点位数据
  pointData: PointData[]
  // 是否显示返回按钮
  showBackButton?: boolean
  // 自动轮播间隔（毫秒）
  autoShowInterval?: number
  // 是否启用自动轮播
  enableAutoShow?: boolean
  // 是否启用悬停交互
  enableHover?: boolean
  // 是否启用点击下钻
  enableDrillDown?: boolean
  // 点击事件回调
  onPointClick?: (pointName: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
  autoShowInterval: 4000,
  enableAutoShow: true,
  enableHover: true,
  enableDrillDown: false
})

const emit = defineEmits<{
  back: []
  pointClick: [pointName: string]
}>()

// 组件引用
const rootRef = ref<HTMLDivElement | null>(null)
const chartRef = ref<HTMLDivElement | null>(null)
const infoBubbleRef = ref<HTMLElement | null>(null)

// 图表实例
let chart: echarts.ECharts | null = null

// 弹窗相关状态
const showInfo = ref(false)
const infoStyle = ref<any>({})
const currentInfo = ref<any>(null)
const currentPointName = ref('')
const infoImg = ref('')

// 轮播相关状态
const autoShowIndex = ref(0)
let autoShowTimer: any = null
const isHoveringPoint = ref(false)
const lastHoveredIndex = ref(0)
let mouseoutTimer: any = null // 鼠标离开防抖定时器
let globaloutTimer: any = null // 全局离开防抖定时器

// 计算属性
const chartOption = computed(() => {
  const { mapConfig, geoCoordMap, pointData } = props
  
  if (mapConfig.type === 'china') {
    return getChinaMapOption(mapConfig, pointData)
  } else {
    return getCustomMapOption(mapConfig, geoCoordMap, pointData)
  }
})

// 中国地图配置
function getChinaMapOption(mapConfig: MapConfig, pointData: PointData[]) {
  const convertData = (data: PointData[]) => {
    const res: any[] = []
    for (let i = 0; i < data.length; i++) {
      const name = data[i].name
      const geoCoord = props.geoCoordMap[name]
      if (geoCoord) {
        res.push({
          name: name,
          value: geoCoord.concat(data[i].value),
          color: data[i].color,
          img: data[i].img,
          infoList: data[i].infoList
        })
      }
    }
    return res
  }

  return {
    backgroundColor: mapConfig.backgroundColor || '#000',
    tooltip: {
      show: !mapConfig.disableProvinceHover // 根据配置决定是否显示 tooltip
    },
    geo: {
      show: true,
      map: 'china',
      zoom: mapConfig.zoom || 1,
      label: {
        normal: { show: false },
        emphasis: { show: false }
      },
      roam: mapConfig.roam || false,
      silent: mapConfig.disableProvinceHover, // 根据配置决定是否禁用交互
      itemStyle: {
        normal: {
          areaColor: '#031525',
          borderWidth: 3,
          borderColor: '#00FEFF',
          shadowColor: 'rgba(3,221,255,0.8)',
          shadowBlur: 30
        },
        emphasis: {
          areaColor: mapConfig.disableProvinceHover ? '#031525' : '#031525' // 悬停时保持相同颜色
        }
      }
    },
    series: [
      {
        type: 'map',
        map: 'china',
        zoom: mapConfig.zoom || 1,
        geoIndex: 1,
        aspectScale: 0.75,
        showLegendSymbol: false,
        silent: mapConfig.disableProvinceHover, // 根据配置决定是否禁用交互
        tooltip: {
          show: !mapConfig.disableProvinceHover // 根据配置决定是否显示 tooltip
        },
        label: {
          normal: { show: false },
          emphasis: { show: false }
        },
        roam: mapConfig.roam || false,
        itemStyle: {
          normal: {
            areaColor: '#00177B',
            borderColor: '#0073DA',
            borderWidth: 1
          },
          emphasis: {
            areaColor: mapConfig.disableProvinceHover ? '#00177B' : '#00177B' // 悬停时保持相同颜色
          }
        },
        data: pointData
      },
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        geoIndex: 0,
        z: 10,
        data: convertData(pointData),
        symbolSize: () => 8,
        showEffectOn: 'render',
        rippleEffect: { brushType: 'stroke' },
        label: {
          normal: {
            show: true,
            formatter: (params: any) => `{fline| ${params.data.name} }`,
            position: 'top',
            distance: 20,
            backgroundColor: 'rgba(3,219,255,.8)',
            padding: [0, 0],
            borderRadius: 3,
            lineHeight: 24,
            verticalAlign: 'middle',
            color: '#fff',
            z: 11,
            rich: {
              fline: {
                padding: [0, 10],
                color: '#ffffff'
              }
            }
          }
        },
        itemStyle: {
          normal: {
            color: (params: any) => params.data.color || '#3db7fc',
            shadowBlur: 8
          }
        }
      }
    ]
  }
}

// 自定义地图配置
function getCustomMapOption(mapConfig: MapConfig, geoCoordMap: Record<string, [number, number]>, pointData: PointData[]) {
  if (!mapConfig.mapData) {
    console.error('自定义地图需要提供 mapData')
    return {}
  }

  // 处理地理数据
  mapConfig.mapData.features.forEach((feature: any) => {
    feature.properties = feature.properties || {}
    feature.properties.name = String(feature.id)
  })

  const regions = mapConfig.mapData.features.map((feature: any) => {
    const prop = feature.properties || {}
    return {
      name: String(feature.id),
      itemStyle: {
        areaColor: prop.fill || '#031525',
        borderColor: prop.stroke || '#00FEFF',
        borderWidth: prop['stroke-width'] || 1,
        opacity: prop['fill-opacity'] ?? 1,
      },
      emphasis: {
        itemStyle: {
          areaColor: prop.fill || '#031525',
          borderColor: prop.stroke || '#00FEFF',
          borderWidth: prop['stroke-width'] || 1,
          opacity: prop['fill-opacity'] ?? 1,
        },
        label: { show: false }
      }
    }
  })

  return {
    backgroundColor: mapConfig.backgroundColor || '#000',
    geo: {
      map: 'customMap',
      roam: mapConfig.roam || true,
      regions,
      silent: true,
      itemStyle: {
        areaColor: '#031525',
        borderColor: '#00FEFF',
        borderWidth: 1,
        opacity: 1,
      },
      emphasis: {
        disabled: true,
        itemStyle: {
          areaColor: '#031525',
          borderColor: '#00FEFF',
          borderWidth: 1,
          opacity: 1,
        },
        label: { show: false }
      },
      select: { disabled: true },
      label: { show: false }
    },
    series: [
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: pointData.map(item => ({
          name: item.name,
          value: geoCoordMap[item.name].concat(item.value),
          color: item.color,
          infoList: item.infoList
        })),
        symbolSize: 8,
        showEffectOn: 'render',
        rippleEffect: { brushType: 'stroke' },
        hoverAnimation: false,
        emphasis: {
          disabled: true,
          itemStyle: {
            color: (params: any) => params.data.color || '#3db7fc',
            shadowBlur: 8
          },
          label: {
            show: true,
            formatter: (params: any) => `{fline| ${params.data.name} }`,
            position: 'top',
            distance: 20,
            backgroundColor: 'rgba(3,219,255,.8)',
            padding: [0, 0],
            borderRadius: 3,
            lineHeight: 24,
            verticalAlign: 'middle',
            color: '#fff',
            z: 11,
            rich: {
              fline: {
                padding: [0, 10],
                color: '#ffffff'
              }
            }
          }
        },
        label: {
          show: true,
          formatter: (params: any) => `{fline| ${params.data.name} }`,
          position: 'top',
          distance: 20,
          backgroundColor: 'rgba(3,219,255,.8)',
          padding: [0, 0],
          borderRadius: 3,
          lineHeight: 24,
          verticalAlign: 'middle',
          color: '#fff',
          z: 11,
          rich: {
            fline: {
              padding: [0, 10],
              color: '#ffffff'
            }
          }
        },
        itemStyle: {
          color: (params: any) => params.data.color || '#3db7fc',
          shadowBlur: 8
        },
        z: 10
      }
    ]
  }
}

// 显示点位信息
function showPointInfo(pointData: any) {
  currentPointName.value = pointData.name
  showInfo.value = true
  infoImg.value = pointData.img || ''
  currentInfo.value = pointData.infoList ? pointData.infoList[0] : { desc: pointData.name }

  const geoCoord = props.geoCoordMap[pointData.name]
  if (geoCoord) {
    updateBubblePosition(geoCoord)
  }
}

// 更新弹窗位置
function updateBubblePosition(coord: [number, number]) {
  if (!chart || !chartRef.value || !infoBubbleRef.value || !rootRef.value) return
  
  try {
    const pixel = chart.convertToPixel('geo', coord)
    if (!Array.isArray(pixel)) return
    
    const bubble = infoBubbleRef.value
    const width = bubble.offsetWidth
    const height = bubble.offsetHeight
    
    infoStyle.value = {
      position: 'absolute',
      left: `${pixel[0] - width / 2}px`,
      top: `${pixel[1] - height - 16}px`,
      zIndex: 1000,
      pointerEvents: 'none'
    }
  } catch (e) {
    console.error('更新弹窗位置失败:', e)
    setTimeout(() => updateBubblePosition(coord), 100)
  }
}

// 图片加载完成后重新计算位置
function onBubbleImgLoad() {
  nextTick(() => {
    const geoCoord = props.geoCoordMap[currentPointName.value]
    if (geoCoord) {
      updateBubblePosition(geoCoord)
    }
  })
}

// 自动轮播相关函数
function startAutoShow() {
  if (!props.enableAutoShow || !props.pointData.length) return
  
  stopAutoShow()
  autoShowTimer = setInterval(() => {
    if (isHoveringPoint.value) return
    
    autoShowIndex.value = (autoShowIndex.value + 1) % props.pointData.length
    showPointInfo(props.pointData[autoShowIndex.value])
  }, props.autoShowInterval)
}

function stopAutoShow() {
  if (autoShowTimer) {
    clearInterval(autoShowTimer)
    autoShowTimer = null
  }
}

// 清除所有定时器
function clearAllTimers() {
  if (autoShowTimer) {
    clearInterval(autoShowTimer)
    autoShowTimer = null
  }
  if (mouseoutTimer) {
    clearTimeout(mouseoutTimer)
    mouseoutTimer = null
  }
  if (globaloutTimer) {
    clearTimeout(globaloutTimer)
    globaloutTimer = null
  }
}

function startAutoShowFromIndex(startIndex: number) {
  autoShowIndex.value = startIndex
  showPointInfo(props.pointData[startIndex])
  startAutoShow()
}

function getPointIndexByName(pointName: string): number {
  return props.pointData.findIndex(item => item.name === pointName)
}

// 事件处理函数
function handleMapClick(params: any) {
  if (params.componentType === 'series' && params.seriesType === 'effectScatter') {
    const pointName = params.data.name
    emit('pointClick', pointName)
    
    if (props.onPointClick) {
      props.onPointClick(pointName)
    }
  }
}

// 初始化地图
function initMap() {
  if (!chartRef.value) return
  
  // 注册地图
  if (props.mapConfig.type === 'china') {
    import('echarts/map/json/china.json').then((chinaJson) => {
      echarts.registerMap('china', chinaJson.default as any)
      createChart()
    })
  } else if (props.mapConfig.mapData) {
    echarts.registerMap('customMap', props.mapConfig.mapData as any)
    createChart()
  }
}

function createChart() {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  chart.setOption(chartOption.value)
  
  // 绑定事件
  if (props.enableDrillDown) {
    chart.on('click', handleMapClick)
  }
  
  if (props.enableHover) {
    chart.on('mouseover', { seriesType: 'effectScatter' }, (params: any) => {
      // 清除所有相关定时器
      if (mouseoutTimer) {
        clearTimeout(mouseoutTimer)
        mouseoutTimer = null
      }
      if (globaloutTimer) {
        clearTimeout(globaloutTimer)
        globaloutTimer = null
      }
      
      isHoveringPoint.value = true
      stopAutoShow()
      lastHoveredIndex.value = getPointIndexByName(params.data.name)
      showPointInfo(params.data)
    })
    
    chart.on('mouseout', (params: any) => {
      if (params.componentType === 'series' && params.seriesType === 'effectScatter') {
        // 清除之前的定时器
        if (mouseoutTimer) {
          clearTimeout(mouseoutTimer)
        }
        
        isHoveringPoint.value = false
        // 延迟隐藏弹窗，避免鼠标快速移动时的闪烁
        mouseoutTimer = setTimeout(() => {
          if (!isHoveringPoint.value) {
            showInfo.value = false
            infoImg.value = ''
            startAutoShowFromIndex(lastHoveredIndex.value)
          }
        }, 100)
      }
    })
    
    chart.on('globalout', () => {
      // 清除之前的定时器
      if (globaloutTimer) {
        clearTimeout(globaloutTimer)
      }
      
      if (isHoveringPoint.value) {
        isHoveringPoint.value = false
        // 延迟恢复自动轮播，避免与mouseout事件冲突
        globaloutTimer = setTimeout(() => {
          if (!isHoveringPoint.value) {
            startAutoShowFromIndex(lastHoveredIndex.value)
          }
        }, 200)
      }
    })
  }
  
  // 启动自动轮播
  if (props.enableAutoShow && props.pointData.length > 0) {
    startAutoShow()
    showPointInfo(props.pointData[0])
  }
  
  // 响应窗口大小变化
  const resizeHandler = () => {
    chart && chart.resize()
    if (showInfo.value && currentInfo.value) {
      const geoCoord = props.geoCoordMap[currentPointName.value]
      if (geoCoord) {
        updateBubblePosition(geoCoord)
      }
    }
  }
  window.addEventListener('resize', resizeHandler)
  
  // 清理函数
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
    if (chart) {
      chart.dispose()
      chart = null
    }
    clearAllTimers()
  })
}

// 监听数据变化
watch(() => props.pointData, () => {
  if (chart && props.pointData.length > 0) {
    chart.setOption(chartOption.value)
    if (props.enableAutoShow) {
      startAutoShow()
      showPointInfo(props.pointData[0])
    }
  }
}, { deep: true })

onMounted(() => {
  nextTick(() => {
    initMap()
  })
})
</script>

<style scoped lang="less">
.interactive-map-root {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.custom-info-bubble {
  position: absolute;
  width: 340px;
  min-height: 200px;
  background: rgba(24, 34, 64, 0.88);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.22);
  border-radius: 18px;
  border: none;
  padding: 14px 14px 12px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
  will-change: transform, opacity;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -16px;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 16px solid transparent;
    border-right: 16px solid transparent;
    border-top: 16px solid rgba(24, 34, 64, 0.88);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.13));
  }

  .info-img-bubble {
    width: 320px;
    height: 150px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.10);
    margin-bottom: 14px;
    border: none;
    background: #fff;
    display: block;
  }

  .info-content-bubble {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .info-card-bubble {
      background: transparent;
      padding: 0;
      margin: 0;

      .info-desc-bubble {
        font-size: 12px;
        color: #b8cfff;
        line-height: 1.7;
        font-weight: 400;
        letter-spacing: 0.2px;
      }
    }
  }
}

.bubble-switch {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), 
                transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: scale(0.92);
  }

  &-enter-to,
  &-leave-from {
    opacity: 1;
    transform: scale(1);
  }
}

.back-btn {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 2000;
  background: rgba(24,34,64,0.95);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  transition: background 0.2s;
  
  &:hover {
    background: #1e2a4d;
  }
}
</style> 