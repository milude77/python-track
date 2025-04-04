import { useState, useEffect } from 'react'
import { Layout, Menu, Spin } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { BookOutlined, LoadingOutlined } from '@ant-design/icons'
import api from '../api/index'
import './Sidebar.scss'

const { Sider } = Layout

const Sidebar = () => {
  const [tutorials, setTutorials] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedKey, setSelectedKey] = useState(null)
  const navigate = useNavigate()
  const { tutorialKey } = useParams()

  useEffect(() => {
    ;(async () => {
      try {
        const response = await api.get('/api/tutorials')
        setTutorials(response.data)
        setLoading(false)

        // 加载完教程列表后，检查是否有保存的当前教程
        if (window.ipcApi && window.ipcApi.getCurrentTutorial) {
          try {
            const savedTutorial = await window.ipcApi.getCurrentTutorial()
            if (savedTutorial) {
              // 设置选中的教程键
              setSelectedKey(savedTutorial)

              // 如果当前URL中没有教程键，则导航到保存的教程
              if (!tutorialKey) {
                navigate(`/tutorial/${savedTutorial}`)
              }
            }
          } catch (error) {
            console.error('获取保存的当前教程失败:', error)
          }
        }
      } catch (error) {
        console.error('获取教程列表失败:', error)
        setLoading(false)
      }
    })()
  }, [navigate, tutorialKey])

  // 当URL中的tutorialKey变化时，更新selectedKey并保存到electron-store
  useEffect(() => {
    if (tutorialKey) {
      setSelectedKey(tutorialKey)

      // 保存当前选中的教程到electron-store
      if (window.ipcApi && window.ipcApi.setCurrentTutorial) {
        window.ipcApi.setCurrentTutorial(tutorialKey).catch((error) => {
          console.error('保存当前教程失败:', error)
        })
      }
    }
  }, [tutorialKey])

  const handleMenuClick = (key) => {
    // 更新选中的教程键
    setSelectedKey(key)

    // 导航到选中的教程
    navigate(`/tutorial/${key}`)

    // 保存当前选中的教程到electron-store
    if (window.ipcApi && window.ipcApi.setCurrentTutorial) {
      window.ipcApi.setCurrentTutorial(key).catch((error) => {
        console.error('保存当前教程失败:', error)
      })
    }

    // 重置章节索引为0
    if (window.ipcApi && window.ipcApi.setTutorialState) {
      window.ipcApi
        .setTutorialState(key, {
          currentSectionIndex: 0,
          currentSubSectionIndex: 0,
          currentCodeBlockIndex: 0,
          sectionCodeBlockIndex: 0,
          subSectionCodeBlockIndex: 0
        })
        .catch((error) => {
          console.error('重置章节索引失败:', error)
        })
    }
  }

  const menuItems = tutorials.map((tutorial) => ({
    key: tutorial.key,
    icon: <BookOutlined />,
    label: tutorial.title
  }))

  return (
    <Sider width={250} className="app-sidebar" breakpoint="lg" collapsedWidth="0">
      {loading ? (
        <div className="sidebar-loading">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      ) : (
        <Menu
          mode="inline"
          className="sidebar-menu"
          selectedKeys={[selectedKey || tutorialKey]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      )}
    </Sider>
  )
}

export default Sidebar
