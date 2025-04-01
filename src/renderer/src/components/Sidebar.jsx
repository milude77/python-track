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
  const navigate = useNavigate()
  const { tutorialKey } = useParams()

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await api.get('/api/tutorials')
        setTutorials(response.data)
        setLoading(false)
      } catch (error) {
        console.error('获取教程列表失败:', error)
        setLoading(false)
      }
    }

    fetchTutorials()
  }, [])

  const handleMenuClick = (key) => {
    navigate(`/tutorial/${key}`)
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
          selectedKeys={[tutorialKey]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      )}
    </Sider>
  )
}

export default Sidebar
