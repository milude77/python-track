// Monaco编辑器配置文件
import oneLightTheme from './monaco-one-light-theme'
import oneDarkTheme from './monaco-one-dark-theme'

const monaco = {
  init: () => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/loader.js'
    script.onload = () => {
      window.require.config({
        paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs' },
        'vs/nls': { availableLanguages: { '*': 'zh-cn' } }
      })

      // 加载Monaco编辑器
      window.require(['vs/editor/editor.main'], () => {
        // 注册自定义主题
        window.monaco.editor.defineTheme('one-light', oneLightTheme)
        window.monaco.editor.defineTheme('one-dark', oneDarkTheme)
      })
    }
    document.body.appendChild(script)
  },

  // 获取当前主题名称
  getThemeName: (isDark) => {
    return isDark ? 'one-dark' : 'one-light'
  }
}

// 初始化Monaco编辑器
monaco.init()

// 导出加载器
export { monaco }
