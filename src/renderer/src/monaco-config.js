// Monaco编辑器配置文件
const monaco = {
  init: () => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/loader.js'
    script.onload = () => {
      window.require.config({
        paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs' },
        'vs/nls': { availableLanguages: { '*': 'zh-cn' } }
      })
    }
    document.body.appendChild(script)
  }
}

// 导出加载器
export { monaco }
