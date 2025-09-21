import React from 'react';
import { List, Avatar, Typography, Tag, Button, Space } from 'antd';
import {
  RobotOutlined,
  StarOutlined,
  UserOutlined,
  MoreOutlined
} from '@ant-design/icons';
import './AssistantTab.css';

const { Text, Title } = Typography;

const mockAssistants = [
  {
    id: '1',
    name: '默认助手',
    description: '通用AI助手，可以回答各类问题',
    avatar: <RobotOutlined />,
    isDefault: true,
    messageCount: 9
  },
  {
    id: '2',
    name: '策略产品经理',
    description: '专业的产品策略分析师',
    avatar: <UserOutlined />,
    isDefault: false,
    messageCount: 0
  },
  {
    id: '3',
    name: '商家运营',
    description: '电商运营专家助手',
    avatar: <UserOutlined />,
    isDefault: false,
    messageCount: 0
  },
  // 更多助手...
];

function AssistantTab() {
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
        dataSource={mockAssistants}
        renderItem={(assistant) => (
          <List.Item
            key={assistant.id}
            className={`assistant-item ${assistant.isDefault ? 'default-assistant' : ''}`}
            onClick={() => {/* 选择助手逻辑 */}}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={assistant.avatar}
                  className="assistant-avatar"
                />
              }
              title={
                <Space>
                  <Text className="assistant-name">{assistant.name}</Text>
                  {assistant.isDefault && <Tag color="green" size="small">默认</Tag>}
                  {assistant.messageCount > 0 && (
                    <Tag color="blue" size="small">{assistant.messageCount}</Tag>
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
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default AssistantTab;
