import { Layout, Typography } from 'antd'
import './AppHeader.scss'
import icon from '../../../../resources/python-logo.svg?asset'
const { Header } = Layout
const { Title } = Typography
const AppHeader = () => {
  return (
    <Header className="app-header">
      <div className="logo-container">
        <img src={icon} alt="Python Logo" className="logo" />
        <Title level={3} className="app-title">
          Python代码跟练系统
        </Title>
      </div>
    </Header>
  )
}

export default AppHeader
