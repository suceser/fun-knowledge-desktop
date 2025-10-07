import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
import ContentArea from './ContentArea';
import './MainLayout.css';

const { Sider, Content } = Layout;

export interface MainLayoutProps {
  className?: string;
}

// 窗口宽度阈值，小于此值时自动折叠侧边栏
const COLLAPSE_THRESHOLD = 1000;

function MainLayout({ className }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState('home');
  const [autoCollapsed, setAutoCollapsed] = useState(false);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      
      // 如果窗口宽度小于阈值，自动折叠侧边栏
      if (windowWidth < COLLAPSE_THRESHOLD && !collapsed) {
        setAutoCollapsed(true);
        setCollapsed(true);
      } 
      // 如果窗口宽度恢复且是自动折叠的，则恢复展开
      else if (windowWidth >= COLLAPSE_THRESHOLD && autoCollapsed) {
        setAutoCollapsed(false);
        setCollapsed(false);
      }
    };

    // 初始检查
    handleResize();

    // 添加窗口大小变化监听器
    window.addEventListener('resize', handleResize);

    // 清理监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [collapsed, autoCollapsed]);

  const handleTabChange = (tabKey: string) => {
    setSelectedTab(tabKey);
  };

  const toggleSidebar = () => {
    // 用户手动切换时，重置自动折叠状态
    setAutoCollapsed(false);
    setCollapsed(!collapsed);
  };

  return (
    <Layout className={`main-layout ${className || ''}`}>
      <Sider
        className="main-sidebar"
        collapsed={collapsed}
        collapsible
        trigger={null}
        width={180}
        collapsedWidth={80}
        theme="dark"
      >
        <Sidebar
          collapsed={collapsed}
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
          onToggle={toggleSidebar}
        />
      </Sider>

      <Layout className="main-content-layout">
        <Content className="main-content">
          <ContentArea selectedTab={selectedTab} />
        </Content>
      </Layout>
    </Layout>
  );
}

MainLayout.defaultProps = {
  className: '',
};

export default MainLayout;
