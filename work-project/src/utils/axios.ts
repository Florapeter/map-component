import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElNotification } from 'element-plus'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: "https://www.demo.com", // 从环境变量获取基础URL
  timeout: 5000, // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    ElNotification({
      title: 'Error',
      message: 'Request Error: ' + error.message,
      type: 'error',
    });
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data

    // 这里可以根据后端的响应格式进行调整
    if (res.code === 200) {
      return res
    } else {
      ElNotification({
        title: 'Error',
        message: res.message || 'Error',
        type: 'error',
      });
      return Promise.reject(new Error(res.message || 'Error'))
    }
  },
  (error: AxiosError) => {
    // 对响应错误做点什么
    ElNotification({
      title: 'Error',
      message: 'Response Error: ' + error.message,
      type: 'error',
    });
    return Promise.reject(error)
  }
);



// 导出 axios 实例
export default service 