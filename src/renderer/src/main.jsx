import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter as Router } from 'react-router-dom'
import App from './App'
import './index.scss'
// 导入Monaco编辑器配置
import './monaco-config'
// 导入Monaco编辑器图标字体
import './monaco-icons.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
)
