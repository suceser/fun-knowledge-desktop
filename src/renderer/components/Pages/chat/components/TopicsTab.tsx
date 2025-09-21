import React from 'react';
import { List, Typography, Tag, Button, Space, Empty } from 'antd';
import {
  MessageOutlined,
  ClockCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import './TopicsTab.css';

const { Text, Title } = Typography;

const mockTopics = [
  {
    id: '1',
    title: '产品设计讨论',
    lastMessage: '如何提升用户体验？',
    messageCount: 15,
    lastActive: '2分钟前',
    tags: ['产品', 'UX']
  },
  {
    id: '2',
    title: '技术架构分析',
    lastMessage: '微服务架构的优劣势分析',
    messageCount: 8,
    lastActive: '1小时前',
    tags: ['技术', '架构']
  },
  // 可以添加更多话题
];

function TopicsTab() {
  return (
    <div className="topics-tab">
      <div className="tab-header">
        <Title level={5} className="tab-title">对话历史</Title>
        <Button type="link" size="small" className="clear-history-btn">
          清空历史
        </Button>
      </div>

      {mockTopics.length > 0 ? (
        <List
          className="topics-list"
          dataSource={mockTopics}
          renderItem={(topic) => (
            <List.Item
              key={topic.id}
              className="topic-item"
              onClick={() => {/* 选择话题逻辑 */}}
            >
              <List.Item.Meta
                avatar={<MessageOutlined className="topic-icon" />}
                title={
                  <div className="topic-header">
                    <Text className="topic-title" ellipsis>{topic.title}</Text>
                    <Text type="secondary" className="message-count">
                      {topic.messageCount}条
                    </Text>
                  </div>
                }
                description={
                  <div className="topic-details">
                    <Text
                      type="secondary"
                      className="last-message"
                      ellipsis
                    >
                      {topic.lastMessage}
                    </Text>
                    <div className="topic-meta">
                      <Space size="small">
                        <ClockCircleOutlined className="time-icon" />
                        <Text type="secondary" className="last-active">
                          {topic.lastActive}
                        </Text>
                      </Space>
                      <Space size="small">
                        {topic.tags.map(tag => (
                          <Tag key={tag} size="small" color="blue">
                            {tag}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  </div>
                }
              />
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                className="delete-topic"
                danger
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无对话历史"
          className="empty-topics"
        />
      )}
    </div>
  );
}

export default TopicsTab;
