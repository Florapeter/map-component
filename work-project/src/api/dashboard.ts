import { get } from "../utils/http";

const Api = {
    chartData: '/chartData',
    chartData2: '/chartData2',
    chartData3: '/chartData3'
} as const

function chartDataApi():Promise<any> {
    return get(Api.chartData);
}

function chartDataApi2():Promise<any> {
    return get(Api.chartData2);
}

function chartDataApi3():Promise<any> {
    return get(Api.chartData3);
}

export { chartDataApi, chartDataApi2, chartDataApi3 }

