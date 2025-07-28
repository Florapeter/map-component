<template>
  <el-row :gutter="10">
    <el-col :span="18">
      <el-card>
        <div class="title">
          <h3>今日设备运行状态</h3>
          <p>更新时间：2025-07-15 10:00:00</p>
        </div>
        <div class="equipment">
          <div class="item">
            <h4>充电桩使用率</h4>
            <img :src="flash" alt="">
            <h1>72 / 95</h1>
            <div class="statistic-card">
              <el-statistic :value="98">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    异常设备
                    <el-tooltip effect="dark" content="Number of users who logged into the product in one day"
                      placement="top">
                      <el-icon style="margin-left: 4px; color: #f56c6c" :size="12">
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>相较昨日</span>
                  <span class="green">
                    24%
                    <el-icon>
                      <CaretTop />
                    </el-icon>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="item">
            <h4>充电柜使用率</h4>
            <img :src="flash2" alt="">
            <h1>655 / 1233</h1>
            <div class="statistic-card">
              <el-statistic :value="22">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    异常设备
                    <el-tooltip effect="dark" content="Number of users who logged into the product in one day"
                      placement="top">
                      <el-icon style="margin-left: 4px;color: #f56c6c" :size="12">
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>相较昨日</span>
                  <span class="green">
                    24%
                    <el-icon color="red">
                      <CaretTop />
                    </el-icon>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="item">
            <h4>充电站使用率</h4>
            <img :src="flash3" alt="">
            <h1>2263 / 3398</h1>
            <div class="statistic-card">
              <el-statistic :value="47">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    异常设备
                    <el-tooltip effect="dark" content="Number of users who logged into the product in one day"
                      placement="top">
                      <el-icon style="margin-left: 4px;color: #f56c6c" :size="12">
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>相较昨日</span>
                  <span class="green">
                    24%
                    <el-icon color="green">
                      <CaretTop />
                    </el-icon>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="mt">
        <template #header>
          <div class="card-header">
            <h1 style="font-size: 18px;font-weight: bold;">常用功能</h1>
          </div>
        </template>
        <div class="quick">
          <div :span="4">
            <img :src="repair">
            <p>设备维修</p>
          </div>
          <div :span="4">
            <img :src="daily">
            <p>每日日报</p>
          </div>
          <div :span="4">
            <img :src="progress">
            <p>任务进度</p>
          </div>
          <div :span="4">
            <img :src="total">
            <p>营收占比</p>
          </div>
          <div :span="4">
            <img :src="money">
            <p>营收统计</p>
          </div>
          <div :span="4">
            <img :src="remain">
            <p>待办事项</p>
          </div>
        </div>
      </el-card>
      <el-card class="mt">
        <template #header>
          <div class="card-header">
            <h1 style="font-size: 18px;font-weight: bold;">能源统计</h1>
          </div>
        </template>
        <el-row>
          <el-col :span="6">
            <div ref="chartRef" style="width: 100%; height: 235px;"></div>
          </el-col>
          <el-col :span="18">
            <div ref="chartRef2" style="width: 100%; height: 235px;"></div>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <template #header>
          <div class="card-header">
            <h1 style="font-size: 18px;font-weight: bold;">设备总览</h1>
          </div>
        </template>
        <div ref="chartRef3" style="width: 100%; height: 160px"></div>
      </el-card>
      <el-card class="mt">
        <template #header>
          <div class="card-header">
            <h1 style="font-size: 18px;font-weight: bold;">营收统计表</h1>
          </div>
        </template>
        <ul class="rank-list">
          <li class="rank-item">
            <span class="rank" style="background-color:rgb(103, 194, 58);color: #fff;">
              1
            </span>
            <span class="store-name">广州</span>
            <span class="sales">52,457</span>
            <span style="margin-left: 50px;">
              24%
              <el-icon color="green">
                <CaretTop />
              </el-icon>
            </span>
          </li>
          <li class="rank-item">
            <span class="rank" style="background-color:rgb(64, 158, 255) ;color: #fff ;">2</span>
            <span class="store-name">上海</span>
            <span class="sales">323,234</span>
            <span style="margin-left: 50px;">
              24%
              <el-icon color="red">
                <CaretBottom />
              </el-icon>
            </span>
          </li>
          <li class="rank-item">
            <span class="rank" style="background-color:rgb(230, 162, 60) ;color: #fff ;">3</span>
            <span class="store-name">佛山</span>
            <span class="sales">192,255</span>
            <span style="margin-left: 50px;">
              24%
              <el-icon color="red">
                <CaretBottom />
              </el-icon>
            </span>
          </li>
          <li class="rank-item">
            <span class="rank">4</span>
            <span class="store-name">珠海</span>
            <span class="sales">17,540</span>
            <span style="margin-left: 50px;">
              24%
              <el-icon color="green">
                <CaretTop />
              </el-icon>
            </span>
          </li>
          <li class="rank-item">
            <span class="rank">5</span>
            <span class="store-name">深圳</span>
            <span class="sales">662,337</span>
            <span style="margin-left: 50px;">
              24%
              <el-icon color="red">
                <CaretBottom />
              </el-icon>
            </span>
          </li>
          <li class="rank-item">
            <span class="rank">6</span>
            <span class="store-name">厦门</span>
            <span class="sales">22,941</span>
            <span style="margin-left: 50px;">
              24%
              <el-icon color="green">
                <CaretTop />
              </el-icon>
            </span>
          </li>
          <li class="rank-item">
            <span class="rank">7</span>
            <span class="store-name">长沙</span>
            <span class="sales">565,221</span>
            <span style="margin-left: 50px;">
              24%
              <el-icon color="green">
                <CaretTop />
              </el-icon>
            </span>
          </li>
        </ul>
      </el-card>
      <el-card class="mt">
        <template #header>
                    <div class="card-header">
                        <h1 style="font-size: 18px;font-weight: bold;">故障报警</h1>
                    </div>
                </template>
                <el-timeline style="max-width: 600px">
                    <el-timeline-item timestamp="2018/4/12" placement="top" :hollow="true" type="danger">
                        <el-card>
                            <h4>矿业北路通讯中断</h4>
                        </el-card>
                    </el-timeline-item>
                    <el-timeline-item timestamp="2018/4/3" placement="top" :hollow="true" type="warning">
                        <el-card>
                            <h4>黄河南路超出服务区域</h4>               
                        </el-card>
                    </el-timeline-item>
                    <el-timeline-item timestamp="2018/4/2" placement="top" :hollow="true" type="danger">
                        <el-card>
                            <h4>6号机组异常断电</h4>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
      </el-card>
    </el-col>
  </el-row>


</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import flash from "@/assets/flash.png"
import flash2 from "@/assets/flash2.png"
import flash3 from "@/assets/flash3.png"
import repair from "@/assets/repair.png"
import daily from "@/assets/daily.png"
import progress from "@/assets/progress.png"
import total from "@/assets/total.png"
import money from "@/assets/money.png"
import remain from "@/assets/remain.png"
import { chartDataApi, chartDataApi2, chartDataApi3 } from '@/api/dashboard';
import { useChart } from '@/hooks/useChart';

const chartRef = ref(null)
const chartRef2 = ref(null)
const chartRef3 = ref(null)

const setChartData = async () => {
  const chartOptions = reactive({
    legend: {
      top: 'bottom',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} %'
    },
    series: [
      {
        name: '营收占比',
        type: 'pie',
        radius: ['50%', '70%'], // 内外半径形成环形
        center: ['50%', '50%'],
        roseType: 'area',
        color: ['#4B6EBD', '#3DBB92', '#53C1D6'], // 颜色
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        data: []
      }
    ],
    graphic: {
      type: 'text',
      left: 'center',
      top: 'center',
      style: {
        text: '营收占比',
        textAlign: 'center',
        textVerticalAlign: 'middle',
        fontSize: 20,
        fill: '#333'
      }
    }
  })
  const res = await chartDataApi2()
  chartOptions.series[0].data = res.data.list
  return chartOptions
}
const setChartData2 = async () => {
  const chartOptions: any = reactive({
    title: {
      text: '电量统计',
    },
    grid: {
      bottom: '18px',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [],
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}kw',
      },
    },
    series: [
      {
        name: '',
        type: 'line',
        data: [],
        lineStyle: {
          width: 4,
        },
        itemStyle: {
          color: 'purple',
          shadowBlur: 5,
          shadowColor: 'rgba(0,255,0,0.5)',
        },
        smooth: true,
      },
      {
        name: '',
        type: 'line',
        data: [],
        lineStyle: {
          width: 4,
        },
        itemStyle: {
          color: 'lightgreen',
          shadowBlur: 5,
          shadowColor: 'rgba(0,255,0,0.5)',
        },
        smooth: true,
      },
      {
        name: '',
        type: 'line',
        data: [],
        lineStyle: {
          width: 4,
        },
        itemStyle: {
          color: 'skyblue',
          shadowBlur: 5,
          shadowColor: 'rgba(0,255,0,0.5)',
        },
        smooth: true,
      },
    ],
  });
  const res = await chartDataApi();
  //对图表内的数据进行渲染
  chartOptions.legend.data = res.data.list.map((item: { name: any; }) => item.name)
  for (let i = 0; i < res.data.list.length; i++) {
    chartOptions.series[i].name = res.data.list[i].name
    chartOptions.series[i].data = res.data.list[i].data
  }
  //使用map函数对res.data.list进行循环，得出一个包含item.name的数组
  return chartOptions
}
const setChartData3 = async () => {
  const chartOptions = reactive({
    radar: {
      // shape: 'circle',
      indicator: [
        { name: '闲置数', max: 65 },
        { name: '使用数', max: 160 },
        { name: '故障数', max: 300 },
        { name: '维修数', max: 380 },
        { name: '更换数', max: 520 },
        { name: '报废数', max: 250 },
      ],
      radius: '65%',
      center: ['50%', '50%'],
    },
    series: [
      {
        name: '设备总览',
        type: 'radar',
        data: [
          {
            value: [],
            name: '设备总览',
          },
        ],
      },
    ],
  })
  const res = await chartDataApi3()
  chartOptions.series[0].data[0].value = res.data.list
  return chartOptions
}
useChart(chartRef, setChartData)
useChart(chartRef2, setChartData2)
useChart(chartRef3, setChartData3)
</script>

<style scoped lang='less'>
.title {
  display: flex;
  align-items: flex-end;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;

  p {
    color: #86909c;
    margin-left: 20px;
  }
}

.equipment {
  display: flex;
  justify-content: space-between;
  padding: 0 50px;

  .item {
    h4 {
      margin-bottom: 12px;
      font-size: 14px;
    }

    h1 {
      margin-top: 8px;
      margin-bottom: 8px;
      font-size: 22px;
    }

    img {
      width: 50px;
      height: 50px;
    }
  }
}

.el-statistic {
  --el-statistic-content-font-size: 15px;
}

.statistic-card {
  height: 100%;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 10px;
  color: var(--el-text-color-regular);
  margin-top: 10px;
}

.green {
  color: var(--el-color-success);
}

.red {
  color: var(--el-color-error);
}

.footer-item {
  span {
    font-size: 12px;
  }
}

.quick {
  padding: 0 10px;
  display: flex;
  justify-content: space-between;

  img {
    width: 50px;
    height: 50px;
  }

  p {
    font-size: 13px;
  }
}

.statistic-card {
  :deep(.el-statistic__content) {
    margin: 10px !important;
  }
}

.rank-list {
  padding: 0;
  list-style-type: none;

  .rank-item {
    display: flex;
    justify-content: space-between;
    padding: 5px;
    border-radius: 5px;
    font-size: 15px;
  }

  .rank-item:nth-child(even) {
    background-color: rgb(253, 246, 236);
    /* 交替背景色 */
  }

  .rank {
    font-weight: bold;
    font-size: 12px;
    color: #666;
    display: inline-block;
    width: 20px;
    height: 20px;

    border-radius: 50%;
    text-align: center;
    line-height: 20px;
  }

  .store-name {
    /* 让.store-name元素在flex布局中占据剩余空间，实现两侧内容分散对齐 */
    flex-grow: 1;
    padding: 0 10px;
  }

  .sales {
    color: #666;
    /* 销售额颜色 */
  }
}
</style>