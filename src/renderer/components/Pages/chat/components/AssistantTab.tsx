import React from 'react';
import { List, Avatar, Typography, Tag, Button, Space } from 'antd';
import {
  RobotOutlined,
  StarOutlined,
  UserOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { useChatState } from '../../../../hooks/useChatState';
import './AssistantTab.css';

const { Text, Title } = Typography;

interface AssistantTabProps {
  onAssistantSelect?: (assistantId: string) => void;
}

function AssistantTab({ onAssistantSelect }: AssistantTabProps) {
  const {
    assistants,
    currentAssistant,
    switchAssistant,
    topics,
  } = useChatState();

  // 计算助手的消息统计
  const getAssistantMessageCount = (assistantId: string) => {
    return topics.filter(topic => topic.assistantId === assistantId).length;
  };

  // 选择助手
  const handleAssistantSelect = (assistantId: string) => {
    switchAssistant(assistantId);
    onAssistantSelect?.(assistantId);
  };

  // 获取助手图标
  const getAssistantIcon = (assistant: any) => {
    if (assistant.id === 'default') return <RobotOutlined />;
    if (assistant.id === 'product-manager') return <UserOutlined />;
    if (assistant.id === 'business-operator') return <UserOutlined />;
    return <UserOutlined />;
  };

  return (
    <div className="assistant-tab">
      <div className="tab-header">
        <Title level={5} className="tab-title">助手列表</Title>
        <Button type="link" size="small" className="add-assistant-btn">
          + 添加助手
        </Button>
      </div>

      <List
        className="assistant-list"
        dataSource={assistants}
        renderItem={(assistant) => {
          const messageCount = getAssistantMessageCount(assistant.id);
          const isSelected = currentAssistant?.id === assistant.id;

          return (
            <List.Item
              key={assistant.id}
              className={`assistant-item ${assistant.isDefault ? 'default-assistant' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleAssistantSelect(assistant.id)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={getAssistantIcon(assistant)}
                    className={`assistant-avatar ${isSelected ? 'selected' : ''}`}
                  />
                }
                title={
                  <Space>
                    <Text className="assistant-name">{assistant.name}</Text>
                    {assistant.isDefault && <Tag color="green">默认</Tag>}
                    {isSelected && <Tag color="orange">当前</Tag>}
                    {messageCount > 0 && (
                      <Tag color="blue">{messageCount}个话题</Tag>
                    )}
                  </Space>
                }
                description={
                  <Text type="secondary" className="assistant-description">
                    {assistant.description}
                  </Text>
                }
              />
              <Button
                type="text"
                size="small"
                icon={<MoreOutlined />}
                className="assistant-more"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: 显示助手详情/设置菜单
                }}
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default AssistantTab;
