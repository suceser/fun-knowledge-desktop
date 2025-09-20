import React, { useState } from 'react';
import { Card, Input, Button, Typography, Space, Tooltip, Divider } from 'antd';
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
import { toolbarHandler } from './ToolbarActions';
import './ChatArea.css';

const { TextArea } = Input;
const { Title, Text } = Typography;

function ChatArea() {
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showCharCount, setShowCharCount] = useState(false);

  const handleSend = async () => {
    if (inputValue.trim() && !isSending) {
      setIsSending(true);
      try {
        // TODO: 实现发送消息逻辑
        console.log('发送消息:', inputValue);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟发送
        setInputValue('');
      } catch (error) {
        console.error('发送失败:', error);
      } finally {
        setIsSending(false);
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
          <div className="empty-chat">
            <CommentOutlined className="empty-icon" />
            <Text className="empty-text">开始您的智能问答之旅</Text>
            <Text type="secondary" className="empty-description">
              在下方输入框中提问，获取AI助手的专业解答
            </Text>
          </div>
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
                disabled={isSending}
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
              {isSending && (
                <div className="sending-indicator">
                  <div className="sending-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
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
                  icon={isSending ? null : <SendOutlined />}
                  className="send-button"
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isSending}
                  loading={isSending}
                >
                  {isSending ? '发送中...' : '发送'}
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
