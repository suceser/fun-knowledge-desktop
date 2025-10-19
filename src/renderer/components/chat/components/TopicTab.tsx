import React from 'react';
import { Typography, Button, message, App, Empty } from 'antd';
import { ClockCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useChatContext } from '../contexts/ChatContext';
import './TopicTab.css';

const { Text } = Typography;

const TopicTab: React.FC = () => {
  const { modal } = App.useApp();
  const { topics, currentTopic, currentAssistant, addTopic, deleteTopic, setCurrentTopic } = useChatContext();

  // 新建话题
  const handleAddTopic = () => {
    if (!currentAssistant) {
      message.error('请先选择一个助手');
      return;
    }

    addTopic('新话题', currentAssistant.id);
    message.success('话题创建成功');
  };

  // 删除话题
  const handleDeleteTopic = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    modal.confirm({
      title: '确认删除',
      content: '确定要删除这个话题吗？删除后不可恢复。',
      okText: '确定',
      cancelText: '取消',
      okButtonProps: {
        danger: true,
      },
      onOk: () => {
        deleteTopic(topicId);
        message.success('话题已删除');
      },
    });
  };

  // 切换话题
  const handleSelectTopic = (topic: any) => {
    setCurrentTopic(topic);
  };

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes === 0 ? '刚刚' : `${minutes}分钟前`;
      }
      return `${hours}小时前`;
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${month}/${day}`;
    }
  };

  // 获取最后一条消息
  const getLastMessage = (topic: any) => {
    if (topic.messages.length === 0) return '暂无消息';
    const lastMsg = topic.messages[topic.messages.length - 1];
    return lastMsg.content;
  };

  // 过滤当前助手的话题
  const currentAssistantTopics = React.useMemo(() => {
    if (!currentAssistant) return [];
    return topics.filter(t => t.assistantId === currentAssistant.id);
  }, [topics, currentAssistant]);

  return (
    <div className="topic-tab">
      <div className="topic-header">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="add-topic-btn"
          onClick={handleAddTopic}
          block
          disabled={!currentAssistant}
        >
          新建话题
        </Button>
      </div>

      <div className="topic-list-container">
        {!currentAssistant ? (
          <Empty
            description="请先在助手Tab选择一个助手"
            className="empty-state"
          />
        ) : currentAssistantTopics.length === 0 ? (
          <Empty
            description="暂无话题，点击上方按钮创建新话题"
            className="empty-state"
          />
        ) : (
          <div className="topic-list">
            {currentAssistantTopics.map(item => (
              <div
                key={item.id}
                className={`topic-content ${currentTopic?.id === item.id ? 'active' : ''}`}
                onClick={() => handleSelectTopic(item)}
              >
                <div className="topic-main">
                  <Text className="topic-title" ellipsis>{item.title}</Text>
                  <div className="topic-meta">
                    <Text className="topic-time">{formatTime(item.updatedAt)}</Text>
                  </div>
                </div>
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  className="topic-delete-btn"
                  onClick={(e) => handleDeleteTopic(item.id, e)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicTab;

