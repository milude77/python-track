import { Layout, Typography, Button } from 'antd'
import {
  MinusOutlined,
  BorderOutlined,
  CloseOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons'
import './AppHeader.scss'
import icon from '../../../../resources/python-logo.svg?asset'
import { useState } from 'react'
const { Header } = Layout
const { Title } = Typography
const AppHeader = () => {
  const [isMaximized, setIsMaximized] = useState(false)

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
        <Button
          type="text"
          icon={<MinusOutlined />}
          onClick={handleMinimize}
          className="window-control-btn"
        />
        <Button
          type="text"
          icon={isMaximized ? <FullscreenExitOutlined /> : <BorderOutlined />}
          onClick={handleMaximize}
          className="window-control-btn"
        />
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={handleClose}
          className="window-control-btn close-btn"
        />
      </div>
    </Header>
  )
}

export default AppHeader
