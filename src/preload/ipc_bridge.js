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
  },

  // 状态持久化相关API
  // 获取当前选中的教程
  getCurrentTutorial: async () => {
    return ipcRenderer.invoke('get-state', 'currentTutorial')
  },

  // 设置当前选中的教程
  setCurrentTutorial: async (tutorialKey) => {
    return ipcRenderer.invoke('set-current-tutorial', tutorialKey)
  },

  // 获取教程状态
  getTutorialState: async (tutorialKey) => {
    return ipcRenderer.invoke('get-state', 'tutorialState', tutorialKey)
  },

  // 设置教程状态
  setTutorialState: async (tutorialKey, state) => {
    return ipcRenderer.invoke('set-tutorial-state', { tutorialKey, state })
  },

  // 获取已完成的练习
  getCompletedExercises: async () => {
    return ipcRenderer.invoke('get-state', 'completedExercises')
  },

  // 添加已完成的练习
  addCompletedExercise: async (exerciseId) => {
    return ipcRenderer.invoke('add-completed-exercise', exerciseId)
  },

  // 获取主题设置
  getTheme: async () => {
    return ipcRenderer.invoke('get-state', 'theme')
  },

  // 设置主题
  setTheme: async (theme) => {
    return ipcRenderer.invoke('set-theme', theme)
  },

  // 获取代码编辑内容
  getCodeEditorContent: async (tutorialKey, sectionIndex, blockIndex) => {
    return ipcRenderer.invoke('get-code-editor-content', { tutorialKey, sectionIndex, blockIndex })
  },

  // 设置代码编辑内容
  setCodeEditorContent: async (tutorialKey, sectionIndex, blockIndex, content) => {
    return ipcRenderer.invoke('set-code-editor-content', {
      tutorialKey,
      sectionIndex,
      blockIndex,
      content
    })
  },

  // 保存代码到本地文件
  saveCodeToFile: async (code) => {
    return ipcRenderer.invoke('save-code-to-file', code)
  },

  // 从本地文件导入代码
  importCodeFromFile: async () => {
    return ipcRenderer.invoke('import-code-from-file')
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
