// 聊天消息组件
import React from 'react';
import { Typography, Avatar, Space, Button, Tooltip, Card } from 'antd';
import {
  UserOutlined,
  RobotOutlined,
  CopyOutlined,
  EditOutlined,
  DeleteOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { Message } from '../../../types/ai';
import './ChatMessage.css';

const { Text, Paragraph } = Typography;

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  onCopy?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onResend?: () => void;
}

function ChatMessage({
  message,
  isStreaming = false,
  onCopy,
  onEdit,
  onDelete,
  onResend,
}: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  // 格式化时间
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 复制消息内容
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    onCopy?.();
  };

  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="message-container">
        {/* 头像 */}
        <div className="message-avatar">
          <Avatar
            icon={isUser ? <UserOutlined /> : <RobotOutlined />}
            className={isUser ? 'user-avatar' : 'assistant-avatar'}
          />
        </div>

        {/* 消息内容 */}
        <div className="message-content">
          {/* 消息头部信息 */}
          <div className="message-header">
            <Space size="small">
              <Text strong className="message-role">
                {isUser ? '您' : (message.model || '助手')}
              </Text>
              <Text type="secondary" className="message-time">
                {formatTime(message.timestamp)}
              </Text>
              {message.tokenCount && (
                <Text type="secondary" className="message-tokens">
                  {message.tokenCount} tokens
                </Text>
              )}
            </Space>
          </div>

          {/* 消息正文 */}
          <Card className="message-body" bodyStyle={{ padding: '12px 16px' }}>
            <Paragraph
              className={`message-text ${isStreaming ? 'streaming' : ''}`}
              copyable={false}
            >
              {message.content || (isStreaming ? '正在输入...' : '消息为空')}
            </Paragraph>

            {/* 流式输入指示器 */}
            {isStreaming && (
              <div className="streaming-indicator">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            {/* 附件显示 */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="message-attachments">
                {message.attachments.map((attachment, index) => (
                  <div key={attachment.id || index} className="attachment-item">
                    <Text type="secondary">{attachment.name}</Text>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* 消息操作按钮 */}
          {!isStreaming && (
            <div className="message-actions">
              <Space size="small">
                <Tooltip title="复制">
                  <Button
                    type="text"
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={handleCopy}
                    className="action-btn"
                  />
                </Tooltip>

                {isUser && onEdit && (
                  <Tooltip title="编辑">
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={onEdit}
                      className="action-btn"
                    />
                  </Tooltip>
                )}

                {isUser && onResend && (
                  <Tooltip title="重新发送">
                    <Button
                      type="text"
                      size="small"
                      icon={<RedoOutlined />}
                      onClick={onResend}
                      className="action-btn"
                    />
                  </Tooltip>
                )}

                {onDelete && (
                  <Tooltip title="删除">
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={onDelete}
                      className="action-btn"
                      danger
                    />
                  </Tooltip>
                )}
              </Space>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
