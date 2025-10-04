import React from 'react';
import { Input, Button, Avatar, Typography } from 'antd';
import {
  SendOutlined,
  PaperClipOutlined,
  SmileOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './ChatArea.css';

const { TextArea } = Input;
const { Text } = Typography;

// 模拟聊天消息数据
const mockMessages = [
  {
    id: '1',
    type: 'user',
    content: '你现在是一名专业的市场营销专家，你对营销策略和品牌推广有着深厚的理解...',
    time: '10/04 17:39',
  },
  {
    id: '2',
    type: 'assistant',
    content: '你是谁',
    avatar: '苏粟',
    time: '10/04 17:39',
  },
  {
    id: '3',
    type: 'ai',
    model: 'Qwen/Qwen2.5-72B-Instruct | ModelScope 魔搭',
    content:
      '我是您的专业市场营销顾问。在营销策略和品牌推广领域，我对如何通过心理影响购买行为有着独到的见解。我对如何通过不提及工具来理解您的目标，以及怎样运用心理学原理影响购买者行为有着深入的了解。今天，我将在这些方面给您提供独特的见解。',
    tokens: '132 + 63 + 693',
    time: '10/04 17:39',
  },
];

const ChatArea: React.FC = () => {
  return (
    <div className="chat-area">
      {/* 消息列表区域 */}
      <div className="message-list">
        {mockMessages.map((message) => (
          <div key={message.id} className={`message-item ${message.type}`}>
            {message.type === 'user' && (
              <div className="message-content user-message">
                <div className="message-header">
                  <Avatar size={32} icon={<UserOutlined />} className="message-avatar" />
                  <Text className="message-time">{message.time}</Text>
                </div>
                <div className="message-text">{message.content}</div>
              </div>
            )}

            {message.type === 'assistant' && (
              <div className="message-content assistant-message">
                <div className="message-header">
                  <Avatar size={32} className="message-avatar assistant-avatar">
                    {message.avatar}
                  </Avatar>
                  <Text className="message-time">{message.time}</Text>
                </div>
                <div className="message-text">{message.content}</div>
              </div>
            )}

            {message.type === 'ai' && (
              <div className="message-content ai-message">
                <div className="message-header">
                  <Avatar
                    size={32}
                    className="message-avatar ai-avatar"
                    icon={<ThunderboltOutlined />}
                  />
                  <div className="ai-model-info">
                    <Text className="ai-model-name">{message.model}</Text>
                  </div>
                  <Text className="message-time">{message.time}</Text>
                </div>
                <div className="message-text">{message.content}</div>
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
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 输入区域 */}
      <div className="input-area">
        <div className="input-wrapper">
          <TextArea
            placeholder="在这里输入消息，按 Enter 发送"
            autoSize={{ minRows: 1, maxRows: 6 }}
            className="chat-input"
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

