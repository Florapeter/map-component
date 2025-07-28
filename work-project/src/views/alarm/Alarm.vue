<template>
  <div ref="chartRef" style="width: 100%; height: 600px;"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import chinaJson from 'echarts/map/json/china.json'

const chartRef = ref(null)
let myChart: echarts.ECharts | null = null

var mapName = 'china';
var data = [
{name:"北京",value:199},
    {name:"天津",value:42},
    {name:"河北",value:102},
    {name:"山西",value:81},
    {name:"内蒙古",value:47},
    {name:"辽宁",value:67},
    {name:"吉林",value:82},
    {name:"黑龙江",value:123},
    {name:"上海",value:24},
    {name:"江苏",value:92},
    {name:"浙江",value:114},
    {name:"安徽",value:109},
    {name:"福建",value:116},
    {name:"江西",value:91},
    {name:"山东",value:119},
    {name:"河南",value:137},
    {name:"湖北",value:116},
    {name:"湖南",value:114},
    {name:"重庆",value:91},
    {name:"四川",value:125},
    {name:"贵州",value:62},
    {name:"云南",value:83},
    {name:"西藏",value:9},
    {name:"陕西",value:80},
    {name:"甘肃",value:56},
    {name:"青海",value:10},
    {name:"宁夏",value:18},
    {name:"新疆",value:180},
    {name:"广东",value:123},
    {name:"广西",value:59},
    {name:"海南",value:14},
];

var geoCoordMap = {};
var toolTipData = [
    {name:"北京",value:[{name:"科技人才总数",value:95},{name:"理科",value:82}]},
    // ...（保持原有的toolTipData数组不变）
];

onMounted(() => {
  if (chartRef.value) {
    myChart = echarts.init(chartRef.value)
    myChart.showLoading();
    echarts.registerMap(mapName, chinaJson as any)
    // 兼容新版 ECharts，geoJson 可能为 geoJSON
    const mapObj = echarts.getMap(mapName);
    const mapFeatures = (mapObj.geoJson || mapObj.geoJSON).features;
    myChart.hideLoading();

    mapFeatures.forEach((v: any) => {
        const name: string = v.properties.name;
        (geoCoordMap as Record<string, any>)[name] = v.properties.cp;
    });

    const values = data.map((item: { value: number }) => {
        return item.value;
    });
    var max = Math.max.apply(null, values);
    var min = Math.min.apply(null, values);

    var convertData = function(data: string | any[]) {
        var res: any[] = [];
        for (var i = 0; i < data.length; i++) {
            var geoCoord = (geoCoordMap as Record<string, any>)[data[i].name];
            if (geoCoord) {
                res.push({
                    name: data[i].name,
                    value: geoCoord.concat(data[i].value),
                });
            }
        }
        return res;
    };

    var option = {
        tooltip: {
            trigger: 'item',
            padding: 5,
            enterable: true,
            transitionDuration: 1,
            textStyle: {
                color: '#000',
                decoration: 'none',
            },
            formatter: function(params: { name: string; }) {
                var currentData = toolTipData.find(function(item) {
                    return item.name === params.name;
                });
                
                if (!currentData) return '';
                
                var techTotal = currentData.value.find(function(v) { return v.name === "科技人才总数"; });
                var science = currentData.value.find(function(v) { return v.name === "理科"; });
                var arts = currentData.value.find(function(v) { return v.name === "文科"; });
                
                return `
                    <div style="width:280px;height:180px;background:rgba(22,80,158,0.8);border:1px solid rgba(7,166,255,0.7)">
                        <div style="width:100%;height:40px;line-height:40px;border-bottom:2px solid rgba(7,166,255,0.7);padding:0 20px">
                            <i style="display:inline-block;width:8px;height:8px;background:#16d6ff;border-radius:40px;"></i>
                            <span style="margin-left:10px;color:#fff;font-size:16px;">${params.name}</span>
                        </div>
                        <div style="padding:20px">
                            <p style="color:#fff;font-size:12px;">
                                <i style="display:inline-block;width:10px;height:10px;background:#16d6ff;border-radius:40px;margin:0 8px"></i>
                                科技人才总数：<span style="color:#11ee7d;margin:0 6px;">${techTotal ? techTotal.value : 0}</span>人
                            </p>
                            ${arts ? `<p style="color:#fff;font-size:12px;">
                                <i style="display:inline-block;width:10px;height:10px;background:#16d6ff;border-radius:40px;margin:0 8px"></i>
                                文科人数：<span style="color:#f48225;margin:0 6px;">${arts.value}</span>人
                            </p>` : ''}
                            ${science ? `<p style="color:#fff;font-size:12px;">
                                <i style="display:inline-block;width:10px;height:10px;background:#16d6ff;border-radius:40px;margin:0 8px"></i>
                                理科人数：<span style="color:#f4e925;margin:0 6px;">${science.value}</span>人
                            </p>` : ''}
                        </div>
                    </div>
                `;
            }
        },
        visualMap: {
            show: true,
            min: min,
            max: max,
            left: '10%',
            top: 'bottom',
            calculable: true,
            seriesIndex: [1],
            inRange: {
                color: ['#04387b', '#467bc0']
            }
        },
        geo: {
            show: true,
            map: mapName,
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: false,
                }
            },
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: '#023677',
                    borderColor: '#1180c7',
                },
                emphasis: {
                    areaColor: '#4499d0',
                }
            }
        },
        series: [
            {
                name: '散点',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: convertData(data),
                symbolSize: function() {
                    return 5;
                },
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: true
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#fff'
                    }
                }
            },
            {
                type: 'map',
                map: mapName,
                geoIndex: 0,
                aspectScale: 0.75,
                showLegendSymbol: false,
                label: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#031525',
                        borderColor: '#3B5077',
                    },
                    emphasis: {
                        areaColor: '#2B91B7'
                    }
                },
                animation: false,
                data: data
            },
            {
                name: 'Top 10',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: convertData(data.sort(function(a, b) {
                    return b.value - a.value;
                }).slice(0, 10)),
                symbolSize: function(val: number[]) {
                    return 10;
                },
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke'
                },
                hoverAnimation: true,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'left',
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'yellow',
                        shadowBlur: 10,
                        shadowColor: 'yellow'
                    }
                },
                zlevel: 1
            }
        ]
    };

    myChart.setOption(option);

    // 自动轮播逻辑
    var index = 0;
    var showTip: number | undefined;

    function startAutoTip() {
        if (showTip) clearInterval(showTip);
        showTip = setInterval(function() {
            myChart!.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: index
            });
            index = (index + 1) % option.series[0].data.length;
        }, 2000);
    }

    // 初始化时启动自动轮播
    startAutoTip();

    // 鼠标交互
    myChart.on('mouseover', function(params) {
        clearInterval(showTip);
        myChart!.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: params.dataIndex,
        });
    });

    myChart.on('mouseout', function() {
        startAutoTip();
    });
  }
})

onBeforeUnmount(() => {
  if (myChart) {
    myChart.dispose()
  }
})
</script>
