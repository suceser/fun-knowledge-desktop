import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Typography, Space, Tooltip, Divider, message, Spin } from 'antd';
import {
  SendOutlined,
  CommentOutlined,
  FileAddOutlined,
  PaperClipOutlined,
  GlobalOutlined,
  SaveOutlined,
  CodeOutlined,
  UserOutlined,
  ThunderboltOutlined,
  MoreOutlined,
  ExpandOutlined,
  EyeOutlined,
  LeftOutlined,
  TranslationOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useChatState } from '../../../../hooks/useChatState';
import ChatMessage from './ChatMessage';
import { toolbarHandler } from './ToolbarActions';
import './ChatArea.css';

const { TextArea } = Input;
const { Title, Text } = Typography;

function ChatArea() {
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCharCount, setShowCharCount] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    currentTopic,
    currentAssistant,
    createTopic,
    sendMessage,
    resendMessage,
    deleteMessage,
    editMessage,
    isLoading,
    error,
    chatState,
  } = useChatState();

  // 获取当前话题的消息列表
  const messages = currentTopic?.messages || [];
  const isStreaming = chatState.streamingMessageId !== undefined;

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSend = async () => {
    if (inputValue.trim() && !isLoading) {
      try {
        let topicToUse = currentTopic;

        // 如果没有当前话题，创建一个新话题
        if (!topicToUse) {
          topicToUse = await createTopic();
        }

        await sendMessage(inputValue.trim());
        setInputValue('');
        localStorage.removeItem('chatDraft'); // 清除草稿

        message.success('消息发送成功');
      } catch (error) {
        console.error('发送失败:', error);
        message.error('发送消息失败: ' + (error instanceof Error ? error.message : '未知错误'));
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // 自动显示字符统计当内容较长时
    setShowCharCount(value.length > 50);

    // TODO: 实现自动保存草稿
    if (value.length > 10) {
      // 延迟保存草稿
      setTimeout(() => {
        localStorage.setItem('chatDraft', value);
      }, 1000);
    }
  };

  // 组件挂载时恢复草稿并设置工具栏回调
  React.useEffect(() => {
    const draft = localStorage.getItem('chatDraft');
    if (draft) {
      setInputValue(draft);
    }

    // 设置工具栏回调函数
    toolbarHandler.setCallback('insertCodeBlock', (codeTemplate: string) => {
      const textarea = document.querySelector('.chat-input textarea') as HTMLTextAreaElement;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = inputValue;
        const before = text.substring(0, start);
        const after = text.substring(end);
        const newValue = before + codeTemplate + after;
        setInputValue(newValue);

        // 设置光标位置到代码块内部
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + 4, start + 4 + 12); // 选中注释文本
        }, 0);
      }
    });

    toolbarHandler.setCallback('saveDraft', () => {
      localStorage.setItem('chatDraft', inputValue);
    });

    toolbarHandler.setCallback('toggleExpand', () => {
      setIsExpanded(!isExpanded);
    });

    toolbarHandler.setCallback('fileSelected', (files: any[]) => {
      console.log('选择的文件:', files);
      // TODO: 处理文件选择
    });

    toolbarHandler.setCallback('uploadFile', async (file: File) => {
      // 模拟文件上传
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.2) {
            resolve(`已上传: ${file.name}`);
          } else {
            reject(new Error('上传失败'));
          }
        }, 2000);
      });
    });

    return () => {
      // 清理回调
    };
  }, [inputValue, isExpanded]);

  const toolbarButtons = [
    { icon: <FileAddOutlined />, tooltip: '添加文件', key: 'addFile' },
    { icon: <PaperClipOutlined />, tooltip: '附件', key: 'attachment' },
    { icon: <GlobalOutlined />, tooltip: '网络搜索', key: 'webSearch' },
    { icon: <SaveOutlined />, tooltip: '保存草稿', key: 'save' },
    { icon: <CodeOutlined />, tooltip: '代码块', key: 'code' },
    { icon: <UserOutlined />, tooltip: '提及助手', key: 'mention' },
    { icon: <ThunderboltOutlined />, tooltip: '快速操作', key: 'quickAction' },
    { icon: <MoreOutlined />, tooltip: '更多选项', key: 'more' },
    { icon: <ExpandOutlined />, tooltip: '全屏编辑', key: 'expand' },
    { icon: <EyeOutlined />, tooltip: '预览', key: 'preview' },
    { icon: <LeftOutlined />, tooltip: '历史记录', key: 'history' }
  ];

  const handleToolbarAction = (key: string) => {
    if (key === 'expand') {
      setIsExpanded(!isExpanded);
    }
    toolbarHandler.execute(key);
  };

  return (
    <Card className="chat-area glass-card">
      <div className="chat-container">
        <div className="chat-header">
          <Title level={4} className="chat-title">
            <CommentOutlined className="chat-icon" />
            对话区域
          </Title>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <CommentOutlined className="empty-icon" />
              <Text className="empty-text">开始您的智能问答之旅</Text>
              <Text type="secondary" className="empty-description">
                {currentAssistant ?
                  `与${currentAssistant.name}开始对话，获取专业解答` :
                  '在下方输入框中提问，获取AI助手的专业解答'
                }
              </Text>
              {error && (
                <div className="error-message">
                  <Text type="danger">{error}</Text>
                </div>
              )}
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isStreaming={isStreaming && chatState.streamingMessageId === msg.id}
                  onCopy={() => message.success('已复制到剪贴板')}
                  onEdit={() => {
                    // TODO: 实现消息编辑功能
                    message.info('编辑功能开发中');
                  }}
                  onDelete={() => {
                    deleteMessage(msg.id).then(success => {
                      if (success) {
                        message.success('消息已删除');
                      } else {
                        message.error('删除消息失败');
                      }
                    });
                  }}
                  onResend={() => {
                    resendMessage(msg.id).catch(error => {
                      message.error('重发消息失败');
                    });
                  }}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="chat-input-area">
          <div className={`input-wrapper ${isExpanded ? 'expanded' : ''}`}>
            <div className="input-container">
              <TextArea
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder={isExpanded ? "全屏编辑模式 - 在这里输入您的消息..." : "在这里输入消息，按 Enter 发送..."}
                className={`chat-input ${isExpanded ? 'expanded' : ''}`}
                autoSize={{ minRows: isExpanded ? 10 : 1, maxRows: isExpanded ? 20 : 4 }}
                disabled={isLoading}
              />

              {/* 字符统计 */}
              {showCharCount && (
                <div className="char-count">
                  <Text type="secondary" className="count-text">
                    {inputValue.length} 字符
                  </Text>
                </div>
              )}

              {/* 发送状态指示器 */}
              {isLoading && (
                <div className="sending-indicator">
                  <Spin size="small" />
                  <Text type="secondary" className="sending-text">
                    {isStreaming ? 'AI正在思考...' : '发送中...'}
                  </Text>
                </div>
              )}
            </div>

            {/* 工具栏 */}
            <div className="input-toolbar">
              <div className="toolbar-left">
                {toolbarButtons.map((button, index) => (
                  <Tooltip key={button.key} title={button.tooltip} placement="top">
                    <Button
                      type="text"
                      icon={button.icon}
                      size="small"
                      className="toolbar-button"
                      onClick={() => handleToolbarAction(button.key)}
                    />
                  </Tooltip>
                ))}
              </div>

              <div className="toolbar-right">
                <Tooltip title="翻译" placement="top">
                  <Button
                    type="text"
                    icon={<TranslationOutlined />}
                    size="small"
                    className="toolbar-button"
                    onClick={() => handleToolbarAction('translate')}
                  />
                </Tooltip>

                <Tooltip title="上传" placement="top">
                  <Button
                    type="text"
                    icon={<UploadOutlined />}
                    size="small"
                    className="toolbar-button upload-button"
                    onClick={() => handleToolbarAction('upload')}
                  />
                </Tooltip>

                <Divider type="vertical" className="toolbar-divider" />

                <Button
                  type="primary"
                  icon={isLoading ? null : <SendOutlined />}
                  className="send-button"
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  loading={isLoading}
                >
                  {isLoading ? (isStreaming ? 'AI回复中...' : '发送中...') : '发送'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ChatArea;
