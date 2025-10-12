import React, { useState } from 'react';
import { Drawer, Menu } from 'antd';
import {
  FileTextOutlined,
  ApiOutlined,
  DatabaseOutlined,
  CloudServerOutlined,
  MessageOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { Assistant } from '../../../../types/Assistant';
import PromptSettings from './PromptSettings';
import ModelSettingsTab from './ModelSettingsTab';
import KnowledgeSettings from './KnowledgeSettings';
import MCPSettings from './MCPSettings';
import PhraseSettings from './PhraseSettings';
import MemorySettings from './MemorySettings';
import './AssistantSettingsDrawer.css';
import './DrawerGlobalStyles.css';

interface AssistantSettingsDrawerProps {
  open: boolean;
  assistant: Assistant | null;
  onClose: () => void;
  onUpdate: (updates: Partial<Assistant>) => void;
}

const AssistantSettingsDrawer: React.FC<AssistantSettingsDrawerProps> = ({
  open,
  assistant,
  onClose,
  onUpdate,
}) => {
  const [activeKey, setActiveKey] = useState('prompt');

  if (!assistant) return null;

  const menuItems = [
    {
      key: 'prompt',
      icon: <FileTextOutlined />,
      label: '提示词设置',
    },
    {
      key: 'model',
      icon: <ApiOutlined />,
      label: '模型设置',
    },
    {
      key: 'knowledge',
      icon: <DatabaseOutlined />,
      label: '知识库设置',
    },
    {
      key: 'mcp',
      icon: <CloudServerOutlined />,
      label: 'MCP 服务器',
    },
    {
      key: 'phrase',
      icon: <MessageOutlined />,
      label: '常用短语',
    },
    {
      key: 'memory',
      icon: <BookOutlined />,
      label: '全局记忆',
    },
  ];

  const renderContent = () => {
    switch (activeKey) {
      case 'prompt':
        return <PromptSettings assistant={assistant} onUpdate={onUpdate} />;
      case 'model':
        return <ModelSettingsTab assistant={assistant} onUpdate={onUpdate} />;
      case 'knowledge':
        return <KnowledgeSettings assistant={assistant} onUpdate={onUpdate} />;
      case 'mcp':
        return <MCPSettings assistant={assistant} onUpdate={onUpdate} />;
      case 'phrase':
        return <PhraseSettings assistant={assistant} onUpdate={onUpdate} />;
      case 'memory':
        return <MemorySettings assistant={assistant} onUpdate={onUpdate} />;
      default:
        return null;
    }
  };

  return (
    <Drawer
      title={
        <div className="drawer-title">
          <span className="drawer-icon">{assistant.icon}</span>
          <span>{assistant.name}</span>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width="80%"
      className="assistant-settings-drawer"
      styles={{
        body: { padding: 0 },
      }}
    >
      <div className="settings-container">
        <div className="settings-sidebar">
          <Menu
            mode="inline"
            selectedKeys={[activeKey]}
            items={menuItems}
            onClick={({ key }) => setActiveKey(key)}
            className="settings-menu"
          />
        </div>
        <div className="settings-content">
          {renderContent()}
        </div>
      </div>
    </Drawer>
  );
};

export default AssistantSettingsDrawer;

