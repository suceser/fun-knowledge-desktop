import React from 'react';
import { List, Typography, Badge } from 'antd';
import { MessageOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './TopicTab.css';

const { Text } = Typography;

// 模拟话题数据
const mockTopics = [
  {
    id: '1',
    title: '市场营销',
    messageCount: 1,
    lastMessage: '你现在是一名专业的市场营销专家...',
    time: '10/04 17:39',
  },
];

const TopicTab: React.FC = () => {
  return (
    <div className="topic-tab">
      <List
        className="topic-list"
        dataSource={mockTopics}
        locale={{ emptyText: '暂无话题' }}
        renderItem={(item) => (
          <List.Item className="topic-item">
            <div className="topic-content">
              <div className="topic-header">
                <MessageOutlined className="topic-icon" />
                <Text className="topic-title" ellipsis>{item.title}</Text>
                <Badge
                  count={item.messageCount}
                  className="topic-badge"
                />
              </div>
              <Text className="topic-message" ellipsis>
                {item.lastMessage}
              </Text>
              <div className="topic-footer">
                <ClockCircleOutlined className="time-icon" />
                <Text className="topic-time">{item.time}</Text>
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default TopicTab;

