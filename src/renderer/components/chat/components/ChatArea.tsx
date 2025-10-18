import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Avatar, Typography, Empty, message } from 'antd';
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
import { useModelConfig } from '../../../hooks/UseModelConfig';
import './ChatArea.css';
import {ChatMessage} from "../../../services/ai/model/ChatMessage";
import {chatCompletion} from "../../../services/ai/ChatCompletion";

const { TextArea } = Input;
const { Text } = Typography;

const ChatArea: React.FC = () => {
  const { currentAssistant, currentTopic, currentMessages, addMessage } = useChatContext();
  const { modelConfig, loading: modelLoading, error: modelError } = useModelConfig();
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
  const handleSend = async () => {
    if (!inputValue.trim() || !currentAssistant || isSending) return;

    // 检查模型配置
    if (!modelConfig) {
      message.error(modelError || '未配置模型，请在设置中配置并启用模型');
      return;
    }

    setIsSending(true);
    const userMessage = inputValue.trim();

    // 添加用户消息
    addMessage({
      role: 'user',
      content: userMessage,
    });

    setInputValue('');

    try {
      // 构建消息历史
      const messages: ChatMessage[] = [];

      // 添加系统提示词
      if (currentAssistant.systemPrompt) {
        messages.push({
          role: 'system',
          content: currentAssistant.systemPrompt,
        });
      }

      // 添加历史消息（只取最近的10条，避免token超限）
      const recentMessages = currentMessages.slice(-10);
      for (const msg of recentMessages) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: msg.content,
          });
        }
      }

      // 添加当前用户消息
      messages.push({
        role: 'user',
        content: userMessage,
      });

      // 调用大模型 API
      const result = await chatCompletion({
        apiUrl: modelConfig.apiUrl,
        apiKey: modelConfig.apiKey,
        model: modelConfig.modelName,
        messages,
        temperature: 0.7,
        maxTokens: 2000,
      });

      if (result.success && result.content) {
        // 添加AI回复
        addMessage({
          role: 'assistant',
          content: result.content,
          model: `${modelConfig.modelDisplayName} | ${modelConfig.providerName}`,
          tokens: result.usage
            ? `${result.usage.promptTokens || 0} + ${result.usage.completionTokens || 0} = ${result.usage.totalTokens || 0}`
            : undefined,
        });
      } else {
        // 显示错误消息
        message.error(result.error || '生成回复失败');
        addMessage({
          role: 'assistant',
          content: `抱歉，生成回复时出错了：${result.error || '未知错误'}`,
          model: `${modelConfig.modelDisplayName} | ${modelConfig.providerName}`,
        });
      }
    } catch (error) {
      console.error('Error calling AI API:', error);
      message.error('调用 AI 服务失败');
      addMessage({
        role: 'assistant',
        content: '抱歉，调用 AI 服务时出现了错误。请检查网络连接和模型配置。',
        model: modelConfig ? `${modelConfig.modelDisplayName} | ${modelConfig.providerName}` : undefined,
      });
    } finally {
      setIsSending(false);
    }
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

