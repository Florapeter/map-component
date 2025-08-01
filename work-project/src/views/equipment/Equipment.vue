<template>
  <div ref="chartRef" style="width: 100%; height: 100%; position: relative;"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as echarts from 'echarts'
import chinaJson from 'echarts/map/json/china.json'
import guangzhouImg from '@/assets/guangzhou.jpg'
import kunshanImg from '@/assets/kunshan.png'
import tianjinImg from '@/assets/tianjing.jpg'
import chengduImg from '@/assets/chengdu.jpg'
import jinanImg from '@/assets/jinan.jpg'

const chartRef = ref<HTMLElement | null>(null)

echarts.registerMap('china', chinaJson as any)

let geoCoordMap = {
  '华南基地(广日工业园)': [113.4814, 22.9856],
  '华东基地(昆山工业园)': [121.0379, 31.1885],
  '华北基地(天津工业园)': [117.4427, 39.4522],
  '西部基地(成都工业园)': [104.0456, 30.6289],
  '济南华东数字化产业区': [117.1423, 37.2841],
};

var chinaDatas = [
  {
    name: '华南基地(广日工业园)',
    value: 86,
    color: 'red',
    img: guangzhouImg,
    desc: '华南基地(广日工业园)位于广东省广州市番禺区，它是一座集研发、生产、物流、培训、商务等功能为一体的世界级现代综合产业园，也是国内最大的电梯、电梯零部件及关联产业的生产基地。华南基地(广日工业园)集研发、生产、物流、培训、商务等功能为一体，是国内最大的电梯、电梯零部件及关联产业的生产基地。'
  },

  {
    name: '西部基地(成都工业园)',
    value: 65,
    color: '#27ae60',
    img: chengduImg,
    desc: '广日股份西部基地（成都工业园）是广日股份在西部地区的重要生产和服务据点，成都作为西部地区的重要中心城市，具有强大的辐射力，能够有效覆盖西部地区广阔的市场。西部基地（成都工业园）依托广日股份的技术实力和管理经验，成都工业园在生产技术、质量管理、企业运营等方面都具有较高的水平，能够确保产品质量和企业的高效运作。'
  }
  ,
  {
    name: '华北基地(天津工业园)',
    value: 65,
    color: '#f1c40f',
    img: tianjinImg,
    desc: '华北基地(天津工业园)地处华北地区重要位置，能够有效辐射京津冀等北方主要市场，缩短产品运输半径，降低物流成本，提高市场响应速度，进一步完善了广日股份在华北地区电梯整机制造、电梯零部件生产及物流服务一体化经营的产业布局。充分共享总公司的技术资源和人才优势，不断进行技术创新和产品升级，培养和吸引了一批高素质的技术工人和专业管理人员，为园区的发展提供了强大的智力支持。'
  },
  {
    name: '济南华东数字化产业区',
    value: 65,
    color: '#8e44ad',
    img: jinanImg,
    desc: '济南华东数字化产业区位于山东商河经济开发区北区,集广日电梯华东数字化产业园、广日电气（山东）智能制造基地、广日物流（山东）智慧产业园三大子项目于一体。济南华东数字化产业区建成后将成为长江以北最大的电梯整机生产基地，具备年产 2 万台套垂直电梯整机及自动扶梯的生产能力，并涵盖电梯核心零部件、电梯物流配套、智慧照明、电线电缆等一系列高科技产品线。'
  },
  {
    name: '华东基地(昆山工业园)',
    value: 65,
    color: '#f39c12',
    img: kunshanImg,
    desc: '华东基地(昆山工业园)位于江苏省昆山市淀山湖镇北苑路南侧，毗邻上海虹桥枢纽，地处长三角核心区域，地理位置优越，能够便捷地辐射华东地区。华东基地(昆山工业园)为广日电梯在华东地区的生产和服务基地，在电梯零部件生产等业务基础上，逐步注入环保节能和低碳产业，致力于打造成为超 10 亿元的先进装备制造业基地。'
  },
];
const convertData = function (data: string | any[]) {
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
        desc: data[i].desc,
        infoList: data[i].infoList || [{ title: name, desc: data[i].value }]
      });
    }
  }
  return res;
};
const option = {
  backgroundColor: '#010347',
  geo: {
    show: true,
    map: 'china',
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
        areaColor: '#01215c',
        borderWidth: 1,//设置外层边框
        borderColor: '#9ffcff',
        shadowColor: 'rgba(0,54,255, 1)',
        shadowBlur: 30
      }
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: function (params: any) {
      // 只对散点图显示自定义提示框
      if (params.seriesType === 'effectScatter' && params.data) {
        const data = params.data;
        const img = data.img;
        const desc = data.desc || data.infoList?.[0]?.desc || '';
        return `
          <div style="max-width: 400px;">
            <div style="background: rgba(0,0,0,0.9); border-radius: 8px; padding: 15px; border: 2px solid #3db7fc; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
              <div style="margin-bottom: 10px;">
                <img src="${img}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px;" />
              </div>
              <div style="font-weight: bold; color: #fff; margin-bottom: 8px; font-size: 14px;">${data.name}</div>
              <div style="color: #ccc; line-height: 1.5; font-size: 12px; white-space: pre-wrap; word-wrap: break-word;">${desc}</div>
            </div>
          </div>
        `;
      }
      return params.name;
    },
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    textStyle: {
      color: '#fff'
    },
    position: function (point: any, params: any, dom: any, rect: any, size: any) {
      // 固定弹窗在标记点正上方
      return [point[0] - size.contentSize[0] / 2, point[1] - size.contentSize[1] - 30];
    },
    confine: true,
    enterable: true,
    hideDelay: 0,
    showDelay: 0,
    alwaysShowContent: false,
    // 添加渐入渐出动画
    transitionDuration: 0.5,
    extraCssText: `
      transition: opacity 0.5s ease-in-out;
    `,
    // 自定义显示和隐藏逻辑
    show: function (params: any) {
      setTimeout(() => {
        const tooltip = document.querySelector('.echarts-tooltip') as HTMLElement;
        if (tooltip) {
          tooltip.style.opacity = '1';
        }
      }, 10);
    },
    hide: function () {
      const tooltip = document.querySelector('.echarts-tooltip') as HTMLElement;
      if (tooltip) {
        tooltip.style.opacity = '0';
      }
    }
  },
  series: [
    {
      type: 'map',
      map: 'china',
      geoIndex: 1,
      aspectScale: 0.75, //长宽比
      showLegendSymbol: false, // 存在legend时显示
      tooltip: {
        show: false
      },
      label: {
        normal: {
          show: false
        },
        emphasis: {
          show: false
        }
      },
      roam: false,

      itemStyle: {
        normal: {
          areaColor: '#01215c',
          borderColor: '#3074d0',
          borderWidth: 1
        },
        emphasis: {
          areaColor: '#01215c'
        }
      },
      data: chinaDatas
    }, {
      type: 'effectScatter',
      coordinateSystem: 'geo',
      geoIndex: 0, // 新增
      z: 10,
      data: convertData(chinaDatas),
      symbolSize: function () {
        return 8;
      },
      showEffectOn: 'render',
      rippleEffect: {
        brushType: 'stroke'
      },
      label: {
        normal: {
          show: false // 不显示标签，只显示散点
        }
      },
      itemStyle: {
        normal: {
          color: function (params: any) {
            return params.data.color || '#3db7fc';
          },
          shadowBlur: 8
        }
      }
    }, {
      // 单独的标签系列，不触发tooltip
      type: 'scatter',
      coordinateSystem: 'geo',
      geoIndex: 0,
      z: 5,
      data: convertData(chinaDatas),
      symbolSize: 0, // 不可见的散点
      label: {
        normal: {
          show: true,
          formatter: function (params: { data: { name: string; }; }) {
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
      tooltip: {
        show: false // 禁用标签的tooltip
      }
    }
  ]
};

onMounted(() => {
  const chart = echarts.init(chartRef.value as HTMLElement)
  chart.setOption(option)
  
  // 实现弹窗轮播
  let currentIndex = 0
  const dataLength = chinaDatas.length
  let tooltipInterval: number | null = null
  let isUserHovering = false
  
  // 监听tooltip的创建和销毁
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          if (element.classList.contains('echarts-tooltip')) {
            // 新创建的tooltip，应用显示动画
            setTimeout(() => {
              element.style.opacity = '1';
            }, 10);
          }
        }
      });
    });
  });
  
  // 开始观察DOM变化
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  const showTooltip = () => {
    // 如果用户正在hover，不执行轮播
    if (isUserHovering) return
    
    // 隐藏所有tooltip
    chart.dispatchAction({
      type: 'hideTip'
    })
    
    // 延迟显示下一个tooltip，给隐藏动画留出时间
    setTimeout(() => {
      if (!isUserHovering) {
        chart.dispatchAction({
          type: 'showTip',
          seriesIndex: 1, // effectScatter系列的索引
          dataIndex: currentIndex
        })
        
        // 更新索引
        currentIndex = (currentIndex + 1) % dataLength
      }
    }, 500) // 等待隐藏动画完成
  }
  
  const startCarousel = () => {
    if (tooltipInterval) return // 如果已经在运行，不重复启动
    
    // 立即显示第一个tooltip
    setTimeout(() => {
      if (!isUserHovering) {
        showTooltip()
      }
    }, 1000)
    
    // 设置轮播定时器，每3秒切换一次
    tooltipInterval = setInterval(showTooltip, 3000)
  }
  
  const stopCarousel = () => {
    if (tooltipInterval) {
      clearInterval(tooltipInterval)
      tooltipInterval = null
    }
  }
  
  // 监听鼠标事件
  chart.on('mouseover', (params) => {
    // 只有当鼠标hover到effectScatter系列的散点时才停止轮播
    if (params.seriesType === 'effectScatter' && params.componentType === 'series') {
      isUserHovering = true
      stopCarousel()
      
      // 延迟显示tooltip，给动画留出时间
      setTimeout(() => {
        if (isUserHovering) {
          chart.dispatchAction({
            type: 'showTip',
            seriesIndex: 1,
            dataIndex: params.dataIndex
          })
        }
      }, 50)
    }
  })
  
  chart.on('mouseout', (params) => {
    // 只有当鼠标离开effectScatter系列的散点时才重启轮播
    if (params.seriesType === 'effectScatter' && params.componentType === 'series') {
      isUserHovering = false
      
      // 隐藏当前tooltip
      chart.dispatchAction({
        type: 'hideTip'
      })
      
      // 延迟重启轮播，等待隐藏动画完成
      setTimeout(() => {
        if (!isUserHovering) {
          startCarousel()
        }
      }, 550) // 500ms动画时间 + 50ms缓冲
    }
  })
  
  // 启动轮播
  startCarousel()
  
  // 组件卸载时清除定时器和observer
  onUnmounted(() => {
    stopCarousel()
    observer.disconnect()
  })
})
</script>

<style scoped lang="less">
// 确保tooltip动画样式生效
:deep(.echarts-tooltip) {
  opacity: 0;
  transition: opacity 0.5s ease-in-out !important;
}
</style>