// IPC API配置文件
// 替代原有的基于axios的HTTP请求，改为使用Electron的IPC通信

// 辅助函数：将数据转换为Unicode编码
import stringToUnicode from '../utils/unicode'

// 创建API接口对象，模拟axios的API结构
const api = {
  // GET请求
  get: async (url) => {
    try {
      let response
      if (url === '/api/tutorials') {
        response = await window.ipcApi.getTutorials()
        return { data: response.data.tutorials }
      } else if (url.startsWith('/api/tutorial/')) {
        const tutorialKey = stringToUnicode(url.split('/').pop())
        response = await window.ipcApi.getTutorial(tutorialKey)
        return { data: response.data }
      }
      throw new Error(`未实现的IPC API路径: ${url}`)
    } catch (error) {
      console.error('IPC API请求错误:', error)
      throw error
    }
  },

  // POST请求
  post: async (url, data) => {
    try {
      let response

      if (url === '/api/run-code') {
        response = await window.ipcApi.runCode(data)
      } else if (url === '/api/hint') {
        response = await window.ipcApi.getHint(data)
      } else if (url === '/api/solution') {
        response = await window.ipcApi.getSolution(data)
      } else {
        throw new Error(`未实现的IPC API路径: ${url}`)
      }

      return { data: response.data }
    } catch (error) {
      console.error('IPC API请求错误:', error)
      throw error
    }
  }
}

export default api
