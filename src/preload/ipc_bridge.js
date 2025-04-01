import { contextBridge, ipcRenderer } from 'electron'
// 创建API接口，用于替代原有的HTTP API
const ipcApi = {
  // 获取所有教程
  getTutorials: async () => {
    return ipcRenderer.invoke('python-ipc', {
      command: 'get_tutorials',
      payload: {}
    })
  },
  // 获取特定教程内容
  getTutorial: async (tutorialKey) => {
    return ipcRenderer.invoke('python-ipc', {
      command: 'get_tutorial',
      payload: { tutorialKey }
    })
  },
  // 运行代码
  runCode: async (data) => {
    return ipcRenderer.invoke('python-ipc', {
      command: 'run_code',
      payload: data
    })
  },
  // 获取提示
  getHint: async (data) => {
    return ipcRenderer.invoke('python-ipc', {
      command: 'get_hint',
      payload: data
    })
  },
  // 获取解决方案
  getSolution: async (data) => {
    return ipcRenderer.invoke('python-ipc', {
      command: 'get_solution',
      payload: data
    })
  },
  // 窗口控制 - 最小化
  minimizeWindow: () => {
    ipcRenderer.send('window-control', 'minimize')
  },
  // 窗口控制 - 最大化/还原
  maximizeWindow: () => {
    ipcRenderer.send('window-control', 'maximize')
  },
  // 窗口控制 - 关闭
  closeWindow: () => {
    ipcRenderer.send('window-control', 'close')
  }
}

// 暴露IPC API到渲染进程
export function setupIpcApi() {
  if (process.contextIsolated) {
    try {
      contextBridge.exposeInMainWorld('ipcApi', ipcApi)
    } catch (error) {
      console.error('IPC API暴露失败:', error)
    }
  } else {
    window.ipcApi = ipcApi
  }
}
