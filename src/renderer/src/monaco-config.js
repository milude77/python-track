// Monaco编辑器配置文件
import * as monaco from 'monaco-editor'
import { loader } from '@monaco-editor/react'

// 配置Monaco编辑器加载器
loader.config({
  // 使用CDN加载Monaco编辑器资源，避免本地路径问题
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs'
  },
  // 设置语言
  'vs/nls': { availableLanguages: { '*': 'zh-cn' } }
})

// 导出Monaco实例，以便在需要时使用
export { monaco }
