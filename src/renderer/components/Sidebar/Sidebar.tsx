import React from 'react';
import { Button, Avatar, Tooltip } from 'antd';
import {
  HomeOutlined,
  QuestionCircleOutlined,
  ShareAltOutlined,
  BookOutlined,
  BarChartOutlined,
  EditOutlined,
  LoginOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './Sidebar.css';

export interface SidebarProps {
  collapsed: boolean;
  selectedTab: string;
  onTabChange: (tabKey: string) => void;
  onToggle: () => void;
}

interface NavigationItem {
  key: string;
  icon: React.ReactNode;
  label: string;
}

const navigationItems: NavigationItem[] = [
  {
    key: 'home',
    icon: <HomeOutlined />,
    label: '我的首页',
  },
  {
    key: 'qna',
    icon: <QuestionCircleOutlined />,
    label: '知识问答',
  },
  {
    key: 'knowledge-graph',
    icon: <ShareAltOutlined />,
    label: '知识图谱',
  },
  {
    key: 'library',
    icon: <BookOutlined />,
    label: '知识库',
  },
  {
    key: 'notes',
    icon: <EditOutlined />,
    label: '我的笔记',
  },
  {
    key: 'analytics',
    icon: <BarChartOutlined />,
    label: '学习数据',
  },
];

function Sidebar({
  collapsed,
  selectedTab,
  onTabChange,
  onToggle,
}: SidebarProps) {
  const renderNavigationItem = (item: NavigationItem) => {
    const isSelected = selectedTab === item.key;

    const navButton = (
      <Button
        key={item.key}
        className={`nav-item ${isSelected ? 'selected' : ''}`}
        onClick={() => onTabChange(item.key)}
        type="text"
        size="large"
        block
      >
        <span className="nav-icon">{item.icon}</span>
        {!collapsed && <span className="nav-label">{item.label}</span>}
      </Button>
    );

    return collapsed ? (
      <Tooltip key={item.key} title={item.label} placement="right">
        {navButton}
      </Tooltip>
    ) : (
      navButton
    );
  };

  const renderBottomButton = (
    key: string,
    icon: React.ReactNode,
    label: string,
    onClick?: () => void,
  ) => {
    const button = (
      <Button
        key={key}
        className="bottom-button"
        onClick={onClick}
        type="text"
        size="large"
        block
      >
        <span className="button-icon">{icon}</span>
        {!collapsed && <span className="button-label">{label}</span>}
      </Button>
    );

    return collapsed ? (
      <Tooltip key={key} title={label} placement="right">
        {button}
      </Tooltip>
    ) : (
      button
    );
  };

  return (
    <div className="sidebar">
      {/* 折叠/展开按钮 */}
      <div className="sidebar-toggle">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className="toggle-button"
        />
      </div>

      {/* 头像区域 */}
      <div className="avatar-section">
        <div className="avatar-container">
          <Avatar
            size={collapsed ? 40 : 64}
            icon={<UserOutlined />}
            className="user-avatar"
          />
          {!collapsed && (
            <div className="user-info">
              <div className="user-name">趣知用户</div>
              <div className="user-status">在线</div>
            </div>
          )}
        </div>
      </div>

      {/* 导航区域 */}
      <div className="navigation-section">
        <div className="navigation-list">
          {navigationItems.map(renderNavigationItem)}
        </div>
      </div>

      {/* 底部按钮区域 */}
      <div className="bottom-section">
        <div className="bottom-buttons">
          {renderBottomButton('login', <LoginOutlined />, '登录')}
          {renderBottomButton('settings', <SettingOutlined />, '设置', () =>
            onTabChange('settings'),
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
