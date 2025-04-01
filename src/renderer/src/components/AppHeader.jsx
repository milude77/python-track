import { Layout, Typography, Button } from 'antd'
import { MinusOutlined, BorderOutlined, CloseOutlined, FullscreenExitOutlined } from '@ant-design/icons'
import './AppHeader.scss'
import icon from '../../../../resources/python-logo.svg?asset'
import { useState, useEffect } from 'react'
const { Header } = Layout
const { Title } = Typography
const AppHeader = () => {
  const [isMaximized, setIsMaximized] = useState(false)

  // 监听窗口状态变化
  useEffect(() => {
    const handleResize = () => {
      // 这里简单通过窗口尺寸判断是否最大化
      // 实际应用中可能需要更复杂的逻辑
      const width = window.innerWidth
      const height = window.innerHeight
      const screenWidth = window.screen.availWidth
      const screenHeight = window.screen.availHeight
      setIsMaximized(width >= screenWidth * 0.9 && height >= screenHeight * 0.9)
    }

    window.addEventListener('resize', handleResize)
    handleResize() // 初始检查

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 窗口控制函数
  const handleMinimize = () => {
    window.ipcApi.minimizeWindow()
  }

  const handleMaximize = () => {
    window.ipcApi.maximizeWindow()
    setIsMaximized(!isMaximized) // 切换状态
  }

  const handleClose = () => {
    window.ipcApi.closeWindow()
  }

  return (
    <Header className="app-header">
      <div className="logo-container">
        <img src={icon} alt="Python Logo" className="logo" />
        <Title level={3} className="app-title">
          Python代码跟练系统
        </Title>
      </div>
      <div className="window-controls">
        <Button type="text" icon={<MinusOutlined />} onClick={handleMinimize} className="window-control-btn" />
        <Button
          type="text"
          icon={isMaximized ? <FullscreenExitOutlined /> : <BorderOutlined />}
          onClick={handleMaximize}
          className="window-control-btn"
        />
        <Button type="text" icon={<CloseOutlined />} onClick={handleClose} className="window-control-btn close-btn" />
      </div>
    </Header>
  )

}

export default AppHeader
