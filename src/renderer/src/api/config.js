// API配置文件
import axios from 'axios'

// 获取API基础URL
const getBaseUrl = () => {
  // 如果在Electron环境中，使用preload.js中设置的apiBaseUrl
  if (window.apiBaseUrl) {
    return window.apiBaseUrl.getBaseUrl()
  }
  // 默认使用相对路径，依赖Vite的代理配置
  return ''
}

// 创建axios实例
const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证信息等
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API请求错误:', error)
    return Promise.reject(error)
  }
)

export default api
