import React, { useState, useEffect } from 'react'
import { Layout, ConfigProvider, theme, Button } from 'antd'
import { Routes, Route, Navigate } from 'react-router-dom'
import { BulbOutlined, BulbFilled } from '@ant-design/icons'
import AppHeader from './components/AppHeader'
import Sidebar from './components/Sidebar'
import TutorialView from './pages/TutorialView'
import './App.css'

const { Content } = Layout

const App = () => {
  // 主题设置
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme
      ? savedTheme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // 切换主题
  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light')
  }

  // 初始化主题
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  }, [])

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 4,
          fontFamily:
            '"Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }
      }}
    >
      <Layout className="app-layout">
        <AppHeader />
        <Layout>
          <Sidebar />
          <Content className="app-content">
            <div className="theme-toggle">
              <Button
                type="text"
                icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
                onClick={toggleTheme}
                title={isDarkMode ? '切换到亮色模式' : '切换到暗色模式'}
              />
            </div>
            <div className="content-container">
              <Routes>
                <Route path="/" element={<Navigate to="/tutorial/基础知识" replace />} />
                <Route path="/tutorial/:tutorialKey" element={<TutorialView />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default App
