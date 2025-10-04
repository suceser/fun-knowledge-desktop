import React from 'react';
import { List, Typography, Tag, Button, Space, Empty, Modal, message } from 'antd';
import {
  MessageOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useChatState } from '../../../../hooks/useChatState';
import './TopicsTab.css';

const { Text, Title } = Typography;

interface TopicsTabProps {
  onTopicSelect?: (topicId: string) => void;
}

function TopicsTab({ onTopicSelect }: TopicsTabProps) {
  const {
    topics,
    currentTopic,
    createTopic,
    switchTopic,
    deleteTopic,
    clearTopicMessages,
  } = useChatState();

  // 格式化时间显示
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;

    return new Date(timestamp).toLocaleDateString();
  };

  // 创建新话题
  const handleCreateTopic = async () => {
    try {
      const newTopic = await createTopic();
      switchTopic(newTopic.id);
      onTopicSelect?.(newTopic.id);
      message.success('创建新对话成功');
    } catch (error) {
      message.error('创建新对话失败');
    }
  };

  // 选择话题
  const handleTopicSelect = (topicId: string) => {
    switchTopic(topicId);
    onTopicSelect?.(topicId);
  };

  // 删除话题
  const handleDeleteTopic = (topicId: string, topicTitle: string) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除话题"${topicTitle}"吗？这将永久删除所有相关消息。`,
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          const success = await deleteTopic(topicId);
          if (success) {
            message.success('删除成功');
          } else {
            message.error('删除失败');
          }
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  // 清空所有历史
  const handleClearHistory = () => {
    if (topics.length === 0) return;

    Modal.confirm({
      title: '确认清空',
      content: '确定要清空所有对话历史吗？这个操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await Promise.all(topics.map(topic => deleteTopic(topic.id)));
          message.success('清空历史成功');
        } catch (error) {
          message.error('清空历史失败');
        }
      },
    });
  };

  return (
    <div className="topics-tab">
      <div className="tab-header">
        <Title level={5} className="tab-title">对话历史</Title>
        <Space>
          <Button
            type="link"
            size="small"
            icon={<PlusOutlined />}
            className="new-topic-btn"
            onClick={handleCreateTopic}
          >
            新建
          </Button>
          <Button
            type="link"
            size="small"
            className="clear-history-btn"
            onClick={handleClearHistory}
            disabled={topics.length === 0}
          >
            清空历史
          </Button>
        </Space>
      </div>

      {topics.length > 0 ? (
        <List
          className="topics-list"
          dataSource={topics}
          renderItem={(topic) => (
            <List.Item
              key={topic.id}
              className={`topic-item ${currentTopic?.id === topic.id ? 'active' : ''}`}
              onClick={() => handleTopicSelect(topic.id)}
            >
              <List.Item.Meta
                avatar={<MessageOutlined className="topic-icon" />}
                title={
                  <div className="topic-header">
                    <Text className="topic-title" ellipsis title={topic.title}>
                      {topic.title}
                    </Text>
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
                      title={topic.lastMessage?.content}
                    >
                      {topic.lastMessage?.content || '暂无消息'}
                    </Text>
                    <div className="topic-meta">
                      <Space size="small">
                        <ClockCircleOutlined className="time-icon" />
                        <Text type="secondary" className="last-active">
                          {formatTime(topic.lastActive)}
                        </Text>
                      </Space>
                      {topic.tags.length > 0 && (
                        <Space size="small">
                          {topic.tags.map(tag => (
                            <Tag key={tag} color="blue">
                              {tag}
                            </Tag>
                          ))}
                        </Space>
                      )}
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTopic(topic.id, topic.title);
                }}
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <div>暂无对话历史</div>
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={handleCreateTopic}
                style={{ marginTop: 8 }}
              >
                开始新对话
              </Button>
            </div>
          }
          className="empty-topics"
        />
      )}
    </div>
  );
}

export default TopicsTab;
