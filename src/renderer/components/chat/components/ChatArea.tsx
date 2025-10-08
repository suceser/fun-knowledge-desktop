import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Avatar, Typography, Empty } from 'antd';
import {
  SendOutlined,
  PaperClipOutlined,
  SmileOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  UserOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { useChatContext } from '../../../contexts/ChatContext';
import SystemPrompt from './SystemPrompt';
import './ChatArea.css';

const { TextArea } = Input;
const { Text } = Typography;

const ChatArea: React.FC = () => {
  const { currentAssistant, currentTopic, currentMessages, addMessage } = useChatContext();
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [currentMessages]);

  // 发送消息
  const handleSend = () => {
    if (!inputValue.trim() || !currentAssistant || isSending) return;

    setIsSending(true);

    // 添加用户消息
    addMessage({
      role: 'user',
      content: inputValue.trim(),
    });

    // 模拟AI回复（实际应该调用AI API）
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: '这是一条模拟的AI回复。在实际应用中，这里会调用真实的AI API来生成回复。',
        model: 'Qwen/Qwen2.5-72B-Instruct | ModelScope 魔搭',
        tokens: '50 + 20 + 100',
      });
      setIsSending(false);
    }, 1000);

    setInputValue('');
  };

  // 处理Enter键发送
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${month}/${day} ${hour}:${minute}`;
  };

  if (!currentAssistant) {
    return (
      <div className="chat-area">
        <div className="empty-state">
          <Empty description="请选择一个助手开始对话" />
        </div>
      </div>
    );
  }

  return (
    <div className="chat-area">
      {/* 系统提示词显示 */}
      <div className="system-prompt-container">
        <SystemPrompt />

        {/* 话题标题显示 */}
        {currentTopic && (
          <div className="current-topic-badge">
            <MessageOutlined style={{ fontSize: '14px' }} />
            <Text className="topic-badge-text">{currentTopic.title}</Text>
          </div>
        )}
      </div>

      {/* 消息列表区域 */}
      <div className="message-list" ref={messageListRef}>
        {currentMessages.length === 0 ? (
          <div className="empty-messages">
            <Empty description="开始新的对话吧" />
          </div>
        ) : (
          currentMessages.map((message) => (
            <div key={message.id} className={`message-item ${message.role}`}>
              {message.role === 'user' && (
                <div className="message-content user-message">
                  <div className="message-header">
                    <Avatar size={32} icon={<UserOutlined />} className="message-avatar" />
                    <Text className="message-time">{formatTime(message.timestamp)}</Text>
                  </div>
                  <div className="message-text">{message.content}</div>
                </div>
              )}

              {message.role === 'assistant' && (
                <div className="message-content assistant-message">
                  <div className="message-header">
                    <Avatar
                      size={32}
                      className="message-avatar ai-avatar"
                      icon={<ThunderboltOutlined />}
                    />
                    {message.model && (
                      <div className="ai-model-info">
                        <Text className="ai-model-name">{message.model}</Text>
                      </div>
                    )}
                    <Text className="message-time">{formatTime(message.timestamp)}</Text>
                  </div>
                  <div className="message-text">{message.content}</div>
                  {message.tokens && (
                    <div className="message-footer">
                      <div className="message-actions">
                        <Button type="text" size="small" className="action-btn">
                          复制
                        </Button>
                        <Button type="text" size="small" className="action-btn">
                          重新生成
                        </Button>
                        <Button type="text" size="small" className="action-btn">
                          翻译
                        </Button>
                        <Button type="text" size="small" className="action-btn">
                          继续
                        </Button>
                        <Button type="text" size="small" className="action-btn">
                          编辑
                        </Button>
                        <Button type="text" size="small" className="action-btn">
                          删除
                        </Button>
                        <Button type="text" size="small" className="action-btn">
                          更多
                        </Button>
                      </div>
                      <Text className="token-info">Tokens: {message.tokens}</Text>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 输入区域 */}
      <div className="input-area">
        <div className="input-wrapper">
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="在这里输入消息，按 Enter 发送"
            autoSize={{ minRows: 1, maxRows: 6 }}
            className="chat-input"
            disabled={isSending}
          />
          <div className="input-actions">
            <div className="input-tools">
              <Button
                type="text"
                icon={<PaperClipOutlined />}
                className="tool-btn"
              />
              <Button
                type="text"
                icon={<GlobalOutlined />}
                className="tool-btn"
              />
              <Button
                type="text"
                icon={<ThunderboltOutlined />}
                className="tool-btn"
              />
              <Button
                type="text"
                icon={<UserOutlined />}
                className="tool-btn"
              />
              <Button
                type="text"
                icon={<SmileOutlined />}
                className="tool-btn"
              />
            </div>
            <Button
              type="primary"
              icon={<SendOutlined />}
              className="send-btn"
              onClick={handleSend}
              loading={isSending}
              disabled={!inputValue.trim()}
            >
              发送
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;

