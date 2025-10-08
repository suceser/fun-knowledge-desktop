import React, { useState } from 'react';
import { Card, Button, Typography } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useChatContext } from '../../../contexts/ChatContext';
import AssistantSettingsDrawer from './AssistantSettings/AssistantSettingsDrawer';
import './SystemPrompt.css';

const { Text } = Typography;

const SystemPrompt: React.FC = () => {
  const { currentAssistant, updateAssistant } = useChatContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 打开设置抽屉
  const handleOpenSettings = () => {
    setIsDrawerOpen(true);
  };

  // 关闭设置抽屉
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  // 更新助手信息
  const handleUpdateAssistant = (updates: Partial<any>) => {
    if (currentAssistant) {
      updateAssistant(currentAssistant.id, updates);
    }
  };

  if (!currentAssistant) {
    return null;
  }

  return (
    <>
      <Card className="system-prompt-card" onClick={handleOpenSettings}>
        <div className="system-prompt-header">
          <div className="assistant-info">
            <span className="assistant-icon">{currentAssistant.icon}</span>
            <Text className="assistant-name-text">{currentAssistant.name}</Text>
          </div>
          <Button
            type="text"
            icon={<SettingOutlined />}
            className="edit-btn"
            size="small"
          />
        </div>
        <Text className="system-prompt-text" ellipsis={{ rows: 2 }}>
          {currentAssistant.systemPrompt}
        </Text>
      </Card>

      {/* 助手设置抽屉 */}
      <AssistantSettingsDrawer
        open={isDrawerOpen}
        assistant={currentAssistant}
        onClose={handleCloseDrawer}
        onUpdate={handleUpdateAssistant}
      />
    </>
  );
};

export default SystemPrompt;

