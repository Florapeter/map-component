<template>
  <div ref="chartRef" style="width: 100%; height: 100%; position: relative;"></div>
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
          <div class="info-desc-bubble">{{ carouselData[0]?.desc }}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang='ts'>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import chinaJson from 'echarts/map/json/china.json'
import guangzhouImg from '@/assets/guangzhou.jpg'
import kunshanImg from '@/assets/kunshan.png'
import tianjinImg from '@/assets/tianjing.jpg'
import chengduImg from '@/assets/chengdu.jpg'
import jinanImg from '@/assets/jinan.jpg'

const chartRef = ref(null)
let myChart: echarts.ECharts | null = null
const infoBubbleRef = ref(null)

// 1. 添加自动轮播相关状态变量
const showInfo = ref(false)
const infoStyle = ref<any>({})
const carouselData = ref<any[]>([])
// const carouselIndex = ref(0) // 移除轮播索引
const infoImg = ref('')
// let carouselTimer: any = null // 移除轮播定时器

// 新增自动轮播相关变量
const autoShowIndex = ref(0) // 当前自动展示的点索引
let autoShowTimer: any = null // 自动轮播定时器
const lastHoveredIndex = ref(0) // 记录最后悬停的点索引
const currentPointName = ref('');

echarts.registerMap('china', chinaJson as any);

var geoCoordMap = {
    '华南基地(广日工业园)':[113.4814,22.9856],
    '华东基地(昆山工业园)':[121.0379,31.1885],
    '华北基地(天津工业园)':[117.4427,39.4522],
    '西部基地(成都工业园)':[104.0456,30.6289],
    '济南华东数字化产业区':[117.1423,37.2841],
};

var chinaDatas = [
  {
    name: '华南基地(广日工业园)',
    value: 86,
    color: 'red',
    img: guangzhouImg,
    infoList: [
      { desc: '华南基地(广日工业园)位于广东省广州市番禺区，于2009年建成投产，占地约30万平方米（450亩）。它是一座集研发、生产、物流、培训、商务等功能为一体的世界级现代综合产业园，也是国内最大的电梯、电梯零部件及关联产业的生产基地。华南基地(广日工业园)集研发、生产、物流、培训、商务等功能为一体，是国内最大的电梯、电梯零部件及关联产业的生产基地。' },
    ]
  },
  {
    name: '西部基地(成都工业园)',
    value: 65,
    color: '#27ae60',
    img: chengduImg,
    infoList: [
      { desc: '广日股份西部基地（成都工业园）是广日股份在西部地区的重要生产和服务据点，成都作为西部地区的重要中心城市，具有强大的辐射力，能够有效覆盖西部地区广阔的市场。西部基地（成都工业园）依托广日股份的技术实力和管理经验，成都工业园在生产技术、质量管理、企业运营等方面都具有较高的水平，能够确保产品质量和企业的高效运作。' }  
  ]
    }
  ,
  {
    name: '华北基地(天津工业园)',
    value: 65,
    color: '#f1c40f',
    img: tianjinImg,
    infoList: [
      { desc: '华北基地(天津工业园)地处华北地区重要位置，能够有效辐射京津冀等北方主要市场，缩短产品运输半径，降低物流成本，提高市场响应速度，进一步完善了广日股份在华北地区电梯整机制造、电梯零部件生产及物流服务一体化经营的产业布局。充分共享总公司的技术资源和人才优势，不断进行技术创新和产品升级，培养和吸引了一批高素质的技术工人和专业管理人员，为园区的发展提供了强大的智力支持。' },
    ]
  },
  {
    name: '济南华东数字化产业区',
    value: 65,
    color: '#8e44ad',
    img: jinanImg,
    infoList: [
      { desc: '济南华东数字化产业区位于山东商河经济开发区北区,集广日电梯华东数字化产业园、广日电气（山东）智能制造基地、广日物流（山东）智慧产业园三大子项目于一体。济南华东数字化产业区建成后将成为长江以北最大的电梯整机生产基地，具备年产 2 万台套垂直电梯整机及自动扶梯的生产能力，并涵盖电梯核心零部件、电梯物流配套、智慧照明、电线电缆等一系列高科技产品线。' },
    ]
  },
  {
    name: '华东基地(昆山工业园)',
    value: 65,
    color: '#f39c12',
    img: kunshanImg,
    infoList: [
      { desc: '华东基地(昆山工业园)位于江苏省昆山市淀山湖镇北苑路南侧，毗邻上海虹桥枢纽，地处长三角核心区域，地理位置优越，能够便捷地辐射华东地区。华东基地(昆山工业园)为广日电梯在华东地区的生产和服务基地，在电梯零部件生产等业务基础上，逐步注入环保节能和低碳产业，致力于打造成为超 10 亿元的先进装备制造业基地。' },
    ]
  }
];

var convertData = function(data: string | any[]) {
    const res: any[] = [];
    for (let i = 0; i < data.length; i++) {
        const name = data[i].name;
        const geoCoord = geoCoordMap[name as keyof typeof geoCoordMap];
        if (geoCoord) {
            res.push({
                name: name,
                value: geoCoord.concat(data[i].value),
                color: data[i].color,
                img: data[i].img,
                infoList: data[i].infoList || [{ title: name, desc: data[i].value }]
            });
        }
    }
    return res;
};

var option = {
    backgroundColor: '#000',
    geo: {
        show: true,
        map: 'china',
        zoom: 1,
        label: {
            normal: {
                show: false
            },
            emphasis: {
                show: false,
            }
        },
        roam: false,
        itemStyle: {
            normal: {
                areaColor: '#031525',
                borderWidth: 3,
                borderColor: '#00FEFF',
                shadowColor: 'rgba(3,221,255,0.8)',
                shadowBlur: 30
            }
        }
    },
    series: [
        {
            type: 'map',
            map: 'china',
            zoom: 1,
            geoIndex: 1,
            aspectScale: 0.75,
            showLegendSymbol: false,
            label: {
                normal: {
                    show: false,
                },
                emphasis: {
                    show: false,
                    textStyle: {
                        color: '#fff'
                    }
                }
            },
            roam: false,
            itemStyle: {
                normal: {
                    areaColor: '#00177B',
                    borderColor: '#0073DA',
                    borderWidth: 1
                },
                emphasis: {
                    areaColor: '#00177B'
                }
            },
            data: chinaDatas
        },
        {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            geoIndex: 0, // 新增
            z: 10,
            data: convertData(chinaDatas),
            symbolSize: function() {
                return 8;
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            label: {
                normal: {
                    show: true,
                    formatter: function(params: { data: { name: string; }; }) {
                        return '{fline|' + ' ' + params.data.name + ' }';
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
            itemStyle: {
                normal: {
                    color: function(params: any) {
                        return params.data.color || '#3db7fc';
                    },
                    shadowBlur: 8
                }
            }
        }
    ]
};

// 2. 修改轮播函数，支持自动轮播
// function startCarousel(data: any[]) { // 移除轮播函数
//   carouselData.value = data
//   carouselIndex.value = 0
//   if (carouselTimer) clearInterval(carouselTimer)
//   if (data.length > 1) {
//     carouselTimer = setInterval(() => {
//       carouselIndex.value = (carouselIndex.value + 1) % carouselData.value.length
//     }, 3000)
//   }
// }

// 3. 新增自动轮播函数
function startAutoShow() {
  if (autoShowTimer) clearInterval(autoShowTimer)
  autoShowTimer = setInterval(() => {
    autoShowIndex.value = (autoShowIndex.value + 1) % chinaDatas.length
    showPointInfo(chinaDatas[autoShowIndex.value])
  }, 4000) // 每5.5秒切换一个点
}

function stopAutoShow() {
  if (autoShowTimer) {
    clearInterval(autoShowTimer)
    autoShowTimer = null
  }
}

// 4. 新增显示指定点信息的函数
function updateBubblePosition(name: string) {
  const geoCoord = geoCoordMap[name as keyof typeof geoCoordMap];
  if (geoCoord) {
    const coord = [geoCoord[0], geoCoord[1]];
    const pixel = myChart!.convertToPixel({ seriesIndex: 1 }, coord);
    const bubble = infoBubbleRef.value as HTMLElement | null;
    const width = bubble ? bubble.offsetWidth : 340;
    const height = bubble ? bubble.offsetHeight : 260;
    const chartDom = myChart!.getDom();
    const chartRect = chartDom.getBoundingClientRect();
    infoStyle.value = {
      position: 'fixed',
      left: (chartRect.left + pixel[0] - width / 2) + 'px',
      top: (chartRect.top + pixel[1] - height - 16) + 'px',
      zIndex: 1000,
      pointerEvents: 'none'
    };
  }
}

function showPointInfo(pointData: any) {
  currentPointName.value = pointData.name;
  showInfo.value = true;
  infoImg.value = pointData.img || '';
  carouselData.value = pointData.infoList ? [pointData.infoList[0]] : [{ desc: pointData.name }];
  nextTick(() => {
    updateBubblePosition(pointData.name);
  });
}

function onBubbleImgLoad() {
  updateBubblePosition(currentPointName.value);
}

// 新增：从指定索引开始自动轮播
function startAutoShowFromIndex(startIndex: number) {
  autoShowIndex.value = startIndex
  showPointInfo(chinaDatas[startIndex])
  startAutoShow()
}

// 新增：根据点名称获取索引
function getPointIndexByName(pointName: string): number {
  return chinaDatas.findIndex(item => item.name === pointName)
}

// 5. 修改停止轮播函数
// function stopCarousel() { // 移除轮播停止函数
//   if (carouselTimer) clearInterval(carouselTimer)
//   carouselTimer = null
// }

onMounted(() => {
  nextTick(() => {
    if (chartRef.value) {
      myChart = echarts.init(chartRef.value)
      myChart.setOption(option)
      
      // 启动自动轮播
      startAutoShow()
      // 立即显示第一个点的信息，让循环播放快速响应
      showPointInfo(chinaDatas[0])
      
      // 响应窗口大小变化
      const resizeHandler = () => {
        myChart && myChart.resize()
      }
      window.addEventListener('resize', resizeHandler)
      
      // 修改鼠标悬停事件
      myChart.on('mouseover', function(params: any) {
        if (params.componentType === 'series' && params.seriesType === 'effectScatter') {
          // 立即停止自动轮播和清除定时器
          stopAutoShow()
          
          // 记录当前悬停的点索引
          lastHoveredIndex.value = getPointIndexByName(params.data.name)
          
          // 立即显示悬停点的信息
          showInfo.value = true
          infoImg.value = params.data.img || ''
          carouselData.value = params.data.infoList ? [params.data.infoList[0]] : [{ desc: params.data.name }]
          
          // 计算弹窗位置
          const coord = [params.value[0], params.value[1]]
          const pixel = myChart!.convertToPixel({ seriesIndex: 1 }, coord)
          
          nextTick(() => {
            const bubble = infoBubbleRef.value as HTMLElement | null
            const width = bubble ? bubble.offsetWidth : 340
            const height = bubble ? bubble.offsetHeight : 260

            const chartDom = myChart!.getDom()
            const chartRect = chartDom.getBoundingClientRect()

            infoStyle.value = {
              position: 'fixed',
              left: (chartRect.left + pixel[0] - width / 2) + 'px',
              top: (chartRect.top + pixel[1] - height - 16) + 'px',
              zIndex: 1000,
              pointerEvents: 'none'
            }
          })
        }
      })
      
      // 修改鼠标离开事件
      myChart.on('mouseout', function(params: any) {
        showInfo.value = false
        // stopCarousel() // 移除轮播停止
        infoImg.value = ''
        // 从最后悬停的点开始继续自动轮播
        startAutoShowFromIndex(lastHoveredIndex.value)
      })
      
      // 卸载时移除监听
      onBeforeUnmount(() => {
        window.removeEventListener('resize', resizeHandler)
        if (myChart) {
          myChart.dispose()
          myChart = null
        }
        // stopCarousel() // 移除轮播停止
        stopAutoShow()
      })
    }
  })
})
</script>

<style scoped>
.custom-info-bubble {
  position: fixed;
  width: 340px;
  min-height: 200px;
  background: rgba(24, 34, 64, 0.88);
  box-shadow: 0 8px 32px rgba(0,0,0,0.22);
  border-radius: 18px;
  border: none;
  padding: 14px 14px 12px 14px; /* 缩小内边距 */
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
}
.custom-info-bubble::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -16px;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 16px solid transparent;
  border-right: 16px solid transparent;
  border-top: 16px solid rgba(24,34,64,0.88);
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.13));
}
.info-img-bubble {
  width: 95%;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);
  margin-bottom: 14px;
  border: none;
  background: #fff;
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
.info-title-bubble {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}
.info-desc-bubble {
  font-size: 12px;
  color: #b8cfff;
  line-height: 1.7;
  font-weight: 400;
  letter-spacing: 0.2px;
}
/* 弹窗切换动画 */
.bubble-switch-enter-active, .bubble-switch-leave-active {
  transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.bubble-switch-enter-from, .bubble-switch-leave-to {
  opacity: 0;
  transform: scale(0.92);
}
.bubble-switch-enter-to, .bubble-switch-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>