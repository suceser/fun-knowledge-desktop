import React from 'react';
import { Tabs } from 'antd';
import { RobotOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import AssistantTab from './AssistantTab';
import TopicTab from './TopicTab';
import ChatSettingsTab from './ChatSettingsTab';
import './LeftPanel.css';

const LeftPanel: React.FC = () => {
  const items = [
    {
      key: 'assistant',
      label: (
        <span className="tab-label">
          <RobotOutlined />
          助手
        </span>
      ),
      children: <AssistantTab />,
    },
    {
      key: 'topic',
      label: (
        <span className="tab-label">
          <MessageOutlined />
          话题
        </span>
      ),
      children: <TopicTab />,
    },
    {
      key: 'settings',
      label: (
        <span className="tab-label">
          <SettingOutlined />
          设置
        </span>
      ),
      children: <ChatSettingsTab />,
    },
  ];

  return (
    <div className="left-panel">
      <Tabs
        defaultActiveKey="assistant"
        items={items}
        className="left-panel-tabs"
        tabPosition="top"
      />
    </div>
  );
};

export default LeftPanel;

