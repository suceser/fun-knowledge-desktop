import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
import ContentArea from './ContentArea';
import './MainLayout.css';

const { Sider, Content } = Layout;

export interface MainLayoutProps {
  className?: string;
}

function MainLayout({ className }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState('home');

  const handleTabChange = (tabKey: string) => {
    setSelectedTab(tabKey);
  };

  const toggleSidebar = () => {
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
