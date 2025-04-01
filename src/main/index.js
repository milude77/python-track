import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { spawn } from 'child_process'
import fs from 'fs'
// 存储Python进程引用
let pythonProcess = null
// 存储待处理的IPC请求
let pendingRequests = new Map()

// 启动Python IPC服务器
function startPythonIpcServer() {
  // 确定Python脚本路径
  let scriptPath
  let pythonCommand

  if (is.dev) {
    // 开发环境使用源代码
    scriptPath = path.join(__dirname, '../../python-server/ipc_server.py')
    pythonCommand = 'python'
  } else {
    // 生产环境使用打包后的可执行文件
    // 首先尝试在resources目录下查找
    scriptPath = path.join(process.resourcesPath, 'python_ipc_server.exe')

    // 如果不存在，则尝试在python-server目录下查找
    if (!fs.existsSync(scriptPath)) {
      scriptPath = path.join(process.resourcesPath, 'python-server', 'dist', 'python_ipc_server.exe')
    }

    pythonCommand = scriptPath
  }

  // 检查文件是否存在
  if (!fs.existsSync(scriptPath)) {
    console.error(`Python IPC服务器文件不存在: ${scriptPath}`)
    return null
  }

  // 启动Python进程
  const options = is.dev ? [scriptPath] : []
  pythonProcess = spawn(pythonCommand, options, {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
  })

  // 设置编码
  pythonProcess.stdin.setDefaultEncoding('utf8')
  pythonProcess.stdout.setEncoding('utf8')
  pythonProcess.stderr.setEncoding('utf8')

  // 处理Python进程的标准输出
  pythonProcess.stdout.on('data', (data) => {
    try {
      // 可能一次收到多行数据，按行分割处理
      const lines = data.toString().trim().split('\n')

      for (const line of lines) {
        if (!line) continue

        const response = JSON.parse(line)
        console.log('Python响应:', response)

        // 如果是请求响应，处理待处理的请求
        if (response.status && pendingRequests.has(response.requestId)) {
          const { resolve, reject } = pendingRequests.get(response.requestId)
          pendingRequests.delete(response.requestId)

          if (response.status === 'error') {
            reject(new Error(response.message))
          } else {
            resolve(response)
          }
        }
      }
    } catch (error) {
      console.error('处理Python响应时出错:', error)
    }
  })

  // 处理Python进程的标准错误
  pythonProcess.stderr.on('data', (data) => {
    console.error('Python错误:', data.toString())
  })

  // 处理Python进程关闭
  pythonProcess.on('close', (code) => {
    console.log(`Python进程已关闭，退出码: ${code}`)
    pythonProcess = null

    // 拒绝所有待处理的请求
    for (const [id, { reject }] of pendingRequests.entries()) {
      reject(new Error('Python进程已关闭'))
      pendingRequests.delete(id)
    }
  })

  return pythonProcess
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  // 启动Python IPC服务器
  pythonProcess = startPythonIpcServer()
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  app.commandLine.appendSwitch('disable-site-isolation-trials')
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 处理IPC请求
  ipcMain.handle('python-ipc', async (event, request) => {
    if (!pythonProcess || pythonProcess.killed) {
      pythonProcess = startPythonIpcServer()
      if (!pythonProcess) {
        throw new Error('无法启动Python IPC服务器')
      }
    }

    return new Promise((resolve, reject) => {
      try {
        // 生成唯一请求ID
        const requestId = Date.now().toString() + Math.random().toString().substring(2, 8)

        // 添加请求ID到请求中
        const requestWithId = { ...request, requestId }

        // 存储请求的resolve和reject函数
        pendingRequests.set(requestId, { resolve, reject })

        // 发送请求到Python进程
        const requestString = JSON.stringify(requestWithId) + '\n'
        pythonProcess.stdin.write(requestString)

        // 设置超时
        setTimeout(() => {
          if (pendingRequests.has(requestId)) {
            pendingRequests.delete(requestId)
            reject(new Error('请求超时'))
          }
        }, 60000) // 增加到60秒超时，给AI响应更多时间
      } catch (error) {
        reject(error)
      }
    })
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // 关闭Python进程
    if (pythonProcess && !pythonProcess.killed) {
      pythonProcess.kill()
      pythonProcess = null
    }
    app.quit()
  }
})

// 应用退出时关闭Python进程
app.on('quit', () => {
  if (pythonProcess && !pythonProcess.killed) {
    pythonProcess.kill()
    pythonProcess = null
  }
})
