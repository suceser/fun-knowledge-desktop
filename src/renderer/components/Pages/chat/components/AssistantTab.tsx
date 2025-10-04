import React from 'react';
import { List, Avatar, Button, Typography } from 'antd';
import { PlusOutlined, StarOutlined, RobotOutlined } from '@ant-design/icons';
import './AssistantTab.css';

const { Text } = Typography;

// 模拟助手数据
const mockAssistants = [
  {
    id: '1',
    name: '默认助手',
    description: '通用的AI助手',
    icon: '🤖',
    isDefault: true,
  },
  {
    id: '2',
    name: '策略产品经理',
    description: '专业的产品策略顾问',
    icon: '💼',
    isDefault: false,
  },
  {
    id: '3',
    name: '商家运营',
    description: '电商运营专家',
    icon: '🛒',
    isDefault: false,
  },
  {
    id: '4',
    name: '社群运营',
    description: '社群管理与运营',
    icon: '👥',
    isDefault: false,
  },
  {
    id: '5',
    name: '市场营销',
    description: '市场策略与营销',
    icon: '📊',
    isDefault: false,
  },
  {
    id: '6',
    name: '策略产品经理',
    description: '产品规划与设计',
    icon: '📱',
    isDefault: false,
  },
  {
    id: '7',
    name: '要点精炼',
    description: '内容提炼与总结',
    icon: '✨',
    isDefault: false,
  },
];

const AssistantTab: React.FC = () => {
  return (
    <div className="assistant-tab">
      <div className="assistant-header">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="add-assistant-btn"
          block
        >
          添加助手
        </Button>
      </div>

      <List
        className="assistant-list"
        dataSource={mockAssistants}
        renderItem={(item) => (
          <List.Item
            className={`assistant-item ${item.isDefault ? 'default-assistant' : ''}`}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  className="assistant-avatar"
                  size={40}
                >
                  {item.icon}
                </Avatar>
              }
              title={
                <div className="assistant-title">
                  <Text className="assistant-name">{item.name}</Text>
                  {item.isDefault && (
                    <StarOutlined className="default-icon" />
                  )}
                </div>
              }
              description={
                <Text className="assistant-description">{item.description}</Text>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default AssistantTab;

