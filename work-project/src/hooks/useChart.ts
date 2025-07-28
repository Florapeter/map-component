import { onMounted, ref, markRaw, type Ref, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';

export function useChart(chartRef: Ref<HTMLElement | null>, setChartData:any) {
    const chartInstance = ref<echarts.ECharts | null>(null)
    const initChart = async () => {
        if (chartRef.value) {
            // markRaw 的作用是告诉 Vue 不要把这个对象做响应式处理，防止 ECharts 实例被 Vue 代理，避免不必要的性能开销和潜在的响应式副作用
            chartInstance.value = markRaw(echarts.init(chartRef.value));
            //此处用于创建容器
            const options = await setChartData();
            //option为函数输出的值，即setoption中需要的图表配置
            chartInstance.value.setOption(options);
            //setoption里面传的是图表的配置，及函数返回的经过后端数据渲染的图表
        }
    }
    const resizeChart = () => {
        chartInstance.value?.resize();
    }
    onMounted(() => {
        initChart();
        window.addEventListener('resize', resizeChart);
    })
    onBeforeUnmount(() => {
        window.removeEventListener('resize', resizeChart);
        if(chartInstance.value){
            chartInstance.value.dispose();
        }
        ////退出挂载时，移除resizeChart函数，同时消除容器
    })
}