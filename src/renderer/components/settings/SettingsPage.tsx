import React, { useState } from 'react';
import { Typography, Divider } from 'antd';
import {
  SettingOutlined,
  EyeOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  RobotOutlined,
  BulbOutlined,
  FileTextOutlined,
  GlobalOutlined,
  ApiOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import GeneralSettings from './components/GeneralSettings';
import DisplaySettings from './components/DisplaySettings';
import DataSettings from './components/DataSettings';
import ShortcutSettings from './components/ShortcutSettings';
import ModelSettings from './components/ModelSettings';
import MemorySettings from './components/MemorySettings';
import DocumentSettings from './components/DocumentSettings';
import SearchSettings from './components/SearchSettings';
import MCPSettings from './components/MCPSettings';
import AboutSettings from './components/AboutSettings';
import './SettingsPage.css';

const { Title } = Typography;

interface SettingItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

interface SettingGroup {
  title?: string;
  items: SettingItem[];
}

const settingGroups: SettingGroup[] = [
  {
    items: [
      { key: 'general', label: '常规设置', icon: <SettingOutlined /> },
      { key: 'display', label: '显示设置', icon: <EyeOutlined /> },
      { key: 'data', label: '数据设置', icon: <DatabaseOutlined /> },
      { key: 'shortcuts', label: '快捷键', icon: <ThunderboltOutlined /> },
    ],
  },
  {
    items: [
      { key: 'model', label: '模型设置', icon: <RobotOutlined /> },
      { key: 'memory', label: '记忆设置', icon: <BulbOutlined /> },
      { key: 'document', label: '文档处理', icon: <FileTextOutlined /> },
      { key: 'search', label: '网络搜索', icon: <GlobalOutlined /> },
      { key: 'mcp', label: 'MCP', icon: <ApiOutlined /> },
    ],
  },
  {
    items: [{ key: 'about', label: '关于我们', icon: <InfoCircleOutlined /> }],
  },
];

function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState('general');

  const handleTabClick = (key: string) => {
    setSelectedTab(key);
  };

  const renderTabItem = (item: SettingItem) => {
    const isSelected = selectedTab === item.key;
    return (
      <div
        key={item.key}
        className={`tab-item ${isSelected ? 'selected' : ''}`}
        onClick={() => handleTabClick(item.key)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleTabClick(item.key);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <span className="tab-icon">{item.icon}</span>
        <span className="tab-label">{item.label}</span>
      </div>
    );
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'general':
        return <GeneralSettings />;
      case 'display':
        return <DisplaySettings />;
      case 'data':
        return <DataSettings />;
      case 'shortcuts':
        return <ShortcutSettings />;
      case 'model':
        return <ModelSettings />;
      case 'memory':
        return <MemorySettings />;
      case 'document':
        return <DocumentSettings />;
      case 'search':
        return <SearchSettings />;
      case 'mcp':
        return <MCPSettings />;
      case 'about':
        return <AboutSettings />;
      default:
        return (
          <div className="content-placeholder">
            <Title level={3}>请选择设置项</Title>
            <p>请从左侧选择要配置的设置项...</p>
          </div>
        );
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <Title level={2} className="settings-title">
          <SettingOutlined className="title-icon" />
          应用设置
        </Title>
      </div>

      <div className="settings-layout">
        {/* 左侧导航 */}
        <div className="settings-sidebar">
          {settingGroups.map((group, groupIndex) => (
            <div
              key={`group-${group.items[0]?.key || 'default'}`}
              className="tab-group"
            >
              {group.items.map(renderTabItem)}
              {groupIndex < settingGroups.length - 1 && (
                <Divider className="group-divider" />
              )}
            </div>
          ))}
        </div>

        {/* 右侧内容 */}
        <div className="settings-content">
          <div className="content-container">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
