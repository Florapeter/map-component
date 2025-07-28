<template>
  <div class="gr-map-root" ref="rootRef">
    <button class="back-btn" @click="$emit('back')">返回</button>
    <div ref="chartRef" style="width: 100%; height: 100%; position: relative;"></div>
    <transition name="bubble-switch" mode="out-in">
      <div
        v-if="showInfo"
        :style="infoStyle"
        class="custom-info-bubble"
        ref="infoBubbleRef"
        :key="currentPointName"
      >
        <div class="info-content-bubble">
          <div class="info-card-bubble">
            <div class="info-desc-bubble">{{currentInfo?.desc}}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import geojson from '@/echarts/map.json'

const chartRef = ref<HTMLDivElement | null>(null)
const rootRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null
const infoBubbleRef = ref<HTMLElement | null>(null)

// 弹窗相关状态
const showInfo = ref(false)
const infoStyle = ref<any>({})
const currentInfo = ref<any>(null)
const currentPointName = ref('')

// 轮播相关状态
const autoShowIndex = ref(0)
let autoShowTimer: any = null
const isHoveringPoint = ref(false)
let lastHoverPointName = ''
let resumeFromHoverIndex = 0 // 记录hover结束后应从哪个索引继续

const geoCoordMap: Record<string, number[]> = {
  '广州塞维拉': [113.4716020723584, 22.98223284511603],
  '广州广日电梯工业有限公司': [113.46893841079651, 22.98131874687681],
  '广州广日电气设备有限公司': [113.4718693932324, 22.97983332404823],
};

const pointData = [
  {
    name: '广州塞维拉',
    value: 86,
    color: 'red',
    infoList: [
      { desc: '广州塞维拉示例点' }
    ]
  },
  {
    name: '广州广日电梯工业有限公司',
    value: 65,
    color: 'green',
    infoList: [
      { desc: '广州广日电梯工业有限公司' }
    ]
  },
  {
    name: '广州广日电气设备有限公司',
    value: 65,
    color: 'yellow',
    infoList: [
      { desc: '广州广日电气设备有限公司' }
    ]
  }
]

function updateBubblePosition(coord: number[]) {
  if (!chart || !chartRef.value || !infoBubbleRef.value || !rootRef.value) return
  try {
    const pixel = chart.convertToPixel('geo', coord)
    if (!Array.isArray(pixel)) return
    const bubble = infoBubbleRef.value
    const width = bubble.offsetWidth
    const height = bubble.offsetHeight
    // 以 gr-map-root 为参考
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

async function showPointInfo(point: any, isHover: boolean = false) {
  if (!point || !chart) return
  
  // 如果是hover事件且点位没有变化，则不做处理
  if (isHover && point.name === lastHoverPointName) {
    return
  }
  
  // 记录当前悬停的点位名称
  if (isHover) {
    lastHoverPointName = point.name
    // 更新hover索引为当前点位索引
    resumeFromHoverIndex = pointData.findIndex(p => p.name === point.name)
  } else {
    lastHoverPointName = ''
  }
  
  // 先隐藏弹窗确保动画能重新触发
  showInfo.value = false
  
  // 等待DOM更新完成
  await nextTick()
  
  // 更新当前点位信息
  currentPointName.value = point.name
  currentInfo.value = point.infoList[0]
  
  // 再次等待DOM更新
  await nextTick()
  
  const coord = geoCoordMap[point.name]
  if (!coord) return
  
  // 显示弹窗
  showInfo.value = true
  
  // 强制图表重绘确保坐标转换准确
  chart.resize()
  
  // 添加短暂延迟确保渲染完成
  setTimeout(() => {
    updateBubblePosition(coord)
  }, 50)
}

function startAutoShow() {
  stopAutoShow()
  
  // 从记录的索引开始继续轮播
  autoShowIndex.value = resumeFromHoverIndex
  
  autoShowTimer = setInterval(() => {
    if (!pointData.length || isHoveringPoint.value) return
    
    autoShowIndex.value = (autoShowIndex.value + 1) % pointData.length
    const currentPoint = pointData[autoShowIndex.value]
    
    if (currentPoint) {
      showPointInfo(currentPoint)
    }
  }, 3000)
}

function stopAutoShow() {
  if (autoShowTimer) {
    clearInterval(autoShowTimer)
    autoShowTimer = null
  }
}

onMounted(async () => {
  if (!chartRef.value) return
  
  await nextTick()
  
  chart = echarts.init(chartRef.value)

  // 处理地理数据
  geojson.features.forEach((feature: any) => {
    feature.properties = feature.properties || {}
    feature.properties.name = String(feature.id)
  })
  echarts.registerMap('customMap', geojson as any)

  const regions = geojson.features.map((feature: any) => {
    const prop = feature.properties || {}
    return {
      name: String(feature.id),
      itemStyle: {
        areaColor: prop.fill || '#eee',
        borderColor: prop.stroke || '#333',
        borderWidth: prop['stroke-width'] || 1,
        opacity: prop['fill-opacity'] ?? 1,
      },
      emphasis: {
        itemStyle: {
          areaColor: prop.fill || '#eee',
          borderColor: prop.stroke || '#333',
          borderWidth: prop['stroke-width'] || 1,
          opacity: prop['fill-opacity'] ?? 1,
        },
        label: {
          show: false
        }
      }
    }
  })

  // 设置图表选项
  chart.setOption({
    geo: {
      map: 'customMap',
      roam: true,
      regions,
      silent: true,
      itemStyle: {
        areaColor: '#eee',
        borderColor: '#333',
        borderWidth: 1,
        opacity: 1,
      },
      emphasis: {
        disabled: true,
        itemStyle: {
          areaColor: '#eee',
          borderColor: '#333',
          borderWidth: 1,
          opacity: 1,
        },
        label: {
          show: false
        }
      },
      select: {
        disabled: true
      },
      label: {
        show: false
      }
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
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: false,
        emphasis: {
          disabled: true,
          itemStyle: {
            color: function(params: any) {
              return params.data.color || '#3db7fc';
            },
            shadowBlur: 8
          },
          label: {
            show: true,
            formatter: function(params: any) {
              return '{fline| ' + params.data.name + ' }';
            },
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
          formatter: function(params: any) {
            return '{fline| ' + params.data.name + ' }';
          },
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
          color: function(params: any) {
            return params.data.color || '#3db7fc';
          },
          shadowBlur: 8
        },
        z: 10
      }
    ]
  })

  // 延迟一帧再显示弹窗，确保图表渲染完成
  setTimeout(() => {
    autoShowIndex.value = 0;
    showPointInfo(pointData[0]);
    startAutoShow();
  }, 0);

  // 鼠标悬停事件
  chart.on('mouseover', { seriesType: 'effectScatter' }, (params: any) => {
    stopAutoShow();
    showPointInfo(params.data, true);
  });

  // 鼠标离开单个点时恢复轮播
  chart.on('mouseout', function(params: any) {
    if (params.componentType === 'series' && params.seriesType === 'effectScatter') {
      startAutoShow();
    }
  });

  //  鼠标离开整个图表区域时也恢复轮播
  chart.on('globalout', function() {
    startAutoShow();
  });

  const resizeHandler = () => {
    chart && chart.resize()
    if (showInfo.value && currentInfo.value) {
      const currentPoint = pointData.find(p => p.name === currentPointName.value)
      if (currentPoint) {
        updateBubblePosition(geoCoordMap[currentPoint.name])
      }
    }
  }
  window.addEventListener('resize', resizeHandler)

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
    if (chart) {
      chart.off('mouseover')
      chart.off('globalout')
      chart.off('mouseout')
      chart.dispose()
      chart = null
    }
    stopAutoShow()
  })
})
</script>

<style scoped lang="less">
/* 保持原有样式不变 */
.gr-map-root {
  width: 100%;
  height: 100%;
  position: relative;
  /* background: #000; */
  overflow: hidden;
}

.custom-info-bubble {
  position: absolute;
  width: 340px;
  height: 200px;
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
}

.custom-info-bubble:after {
  content: "";
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

.info-content-bubble {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.info-card-bubble {
  background: transparent;
  padding: 0;
  margin: 0;
}

.info-desc-bubble {
  font-size: 12px;
  color: #b8cfff;
  line-height: 1.7;
  font-weight: 400;
  letter-spacing: 0.2px;
}

.bubble-switch-enter-active,
.bubble-switch-leave-active {
  transition: opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1),
              transform 1.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.bubble-switch-enter-from,
.bubble-switch-leave-to {
  opacity: 0;
  transform: scale(0.92);
}

.bubble-switch-enter-to,
.bubble-switch-leave-from {
  opacity: 1;
  transform: scale(1);
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
}
.back-btn:hover {
  background: #1e2a4d;
}
</style>