import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Tag, Input, message, Switch } from 'antd';
import { 
  ThunderboltOutlined, 
  EditOutlined, 
  ReloadOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  MessageOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
  ClearOutlined,
  UpOutlined,
  DownOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import './ShortcutSettings.css';

const { Title, Text } = Typography;

interface ShortcutItem {
  id: string;
  name: string;
  description: string;
  defaultKey: string;
  currentKey: string;
  category: string;
  enabled: boolean;
}

interface ShortcutSettingsProps {
  // 可以添加props用于状态管理
}

const defaultShortcuts: ShortcutItem[] = [
  {
    id: 'display-hidden-app',
    name: '显示/隐藏应用',
    description: '快速显示或隐藏应用窗口',
    defaultKey: '按下快捷键',
    currentKey: '按下快捷键',
    category: 'app',
    enabled: true
  },
  {
    id: 'quick-assistant',
    name: '快捷助手',
    description: '快速打开AI助手对话',
    defaultKey: '⌘ + E',
    currentKey: '⌘ + E',
    category: 'assistant',
    enabled: true
  },
  {
    id: 'open-assistant',
    name: '开关助手手',
    description: '开启或关闭助手功能',
    defaultKey: '按下快捷键',
    currentKey: '按下快捷键',
    category: 'assistant',
    enabled: true
  },
  {
    id: 'assistant-word',
    name: '划词助手：取词',
    description: '选中文字后快速取词翻译',
    defaultKey: '按下快捷键',
    currentKey: '按下快捷键',
    category: 'assistant',
    enabled: true
  },
  {
    id: 'exit-fullscreen',
    name: '退出全屏',
    description: '退出全屏模式',
    defaultKey: 'Escape',
    currentKey: 'Escape',
    category: 'display',
    enabled: true
  },
  {
    id: 'new-conversation',
    name: '新建话题',
    description: '创建新的对话话题',
    defaultKey: '⌘ + N',
    currentKey: '⌘ + N',
    category: 'conversation',
    enabled: true
  },
  {
    id: 'toggle-assistant-tips',
    name: '切换助手显示',
    description: '显示或隐藏助手提示信息',
    defaultKey: '⌘ + [',
    currentKey: '⌘ + [',
    category: 'assistant',
    enabled: true
  },
  {
    id: 'toggle-conversation-tips',
    name: '切换话题显示',
    description: '显示或隐藏话题列表',
    defaultKey: '⌘ + ]',
    currentKey: '⌘ + ]',
    category: 'conversation',
    enabled: true
  },
  {
    id: 'copy-last-message',
    name: '复制上一条消息',
    description: '快速复制最后一条对话消息',
    defaultKey: '⌘ + ⇧ + C',
    currentKey: '⌘ + ⇧ + C',
    category: 'conversation',
    enabled: false
  },
  {
    id: 'search-messages',
    name: '搜索消息',
    description: '在对话历史中搜索消息',
    defaultKey: '⌘ + ⇧ + F',
    currentKey: '⌘ + ⇧ + F',
    category: 'conversation',
    enabled: true
  },
  {
    id: 'clear-messages',
    name: '清空消息',
    description: '清空当前对话的所有消息',
    defaultKey: '⌘ + L',
    currentKey: '⌘ + L',
    category: 'conversation',
    enabled: true
  },
  {
    id: 'clear-context',
    name: '清除上下文',
    description: '清除对话的上下文记忆',
    defaultKey: '⌘ + K',
    currentKey: '⌘ + K',
    category: 'conversation',
    enabled: true
  },
  {
    id: 'search-previous',
    name: '在当前对话中搜索消息',
    description: '在当前对话历史中搜索特定消息',
    defaultKey: '⌘ + F',
    currentKey: '⌘ + F',
    category: 'conversation',
    enabled: true
  }
];

const ShortcutSettings: React.FC<ShortcutSettingsProps> = () => {
  const [shortcuts, setShortcuts] = useState<ShortcutItem[]>(defaultShortcuts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // 处理快捷键编辑
  const handleEdit = (id: string, currentKey: string) => {
    setEditingId(id);
    setEditingKey(currentKey);
  };

  // 处理保存
  const handleSave = (id: string) => {
    if (!editingKey.trim()) {
      message.error('快捷键不能为空');
      return;
    }

    // 检查快捷键冲突
    const existingShortcut = shortcuts.find(
      (s) => s.id !== id && s.currentKey === editingKey && s.enabled
    );
    
    if (existingShortcut) {
      message.error(`快捷键 "${editingKey}" 已被 "${existingShortcut.name}" 使用`);
      return;
    }

    setShortcuts(prev => 
      prev.map(shortcut => 
        shortcut.id === id 
          ? { ...shortcut, currentKey: editingKey }
          : shortcut
      )
    );
    
    setEditingId(null);
    setEditingKey('');
    message.success('快捷键已更新');
  };

  // 处理取消
  const handleCancel = () => {
    setEditingId(null);
    setEditingKey('');
    setIsRecording(false);
  };

  // 处理重置单个快捷键
  const handleReset = (id: string) => {
    const shortcut = shortcuts.find(s => s.id === id);
    if (shortcut) {
      setShortcuts(prev => 
        prev.map(s => 
          s.id === id 
            ? { ...s, currentKey: s.defaultKey }
            : s
        )
      );
      message.success('快捷键已重置为默认值');
    }
  };

  // 处理重置所有快捷键
  const handleResetAll = () => {
    setShortcuts(prev => 
      prev.map(shortcut => ({
        ...shortcut,
        currentKey: shortcut.defaultKey
      }))
    );
    message.success('所有快捷键已重置为默认值');
  };

  // 处理开关切换
  const handleToggleEnabled = (id: string, enabled: boolean) => {
    setShortcuts(prev => 
      prev.map(shortcut => 
        shortcut.id === id 
          ? { ...shortcut, enabled }
          : shortcut
      )
    );
  };

  // 处理快捷键录制
  const handleKeyRecord = () => {
    setIsRecording(true);
    setEditingKey('');
    
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      
      const keys = [];
      if (e.metaKey) keys.push('⌘');
      if (e.ctrlKey) keys.push('Ctrl');
      if (e.altKey) keys.push('Alt');
      if (e.shiftKey) keys.push('⇧');
      
      if (e.key && !['Meta', 'Control', 'Alt', 'Shift'].includes(e.key)) {
        keys.push(e.key.toUpperCase());
      }
      
      if (keys.length > 0) {
        const keyString = keys.join(' + ');
        setEditingKey(keyString);
        setIsRecording(false);
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // 5秒后自动停止录制
    setTimeout(() => {
      setIsRecording(false);
      document.removeEventListener('keydown', handleKeyDown);
    }, 5000);
  };

  // 获取分类图标
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'app': return <GlobalOutlined />;
      case 'assistant': return <ThunderboltOutlined />;
      case 'display': return <EyeInvisibleOutlined />;
      case 'conversation': return <MessageOutlined />;
      default: return <ThunderboltOutlined />;
    }
  };

  const renderShortcutItem = (shortcut: ShortcutItem) => {
    const isEditing = editingId === shortcut.id;
    
    return (
      <div key={shortcut.id} className={`shortcut-item ${!shortcut.enabled ? 'disabled' : ''}`}>
        <div className="shortcut-info">
          <div className="shortcut-header">
            <span className="shortcut-icon">
              {getCategoryIcon(shortcut.category)}
            </span>
            <span className="shortcut-name">{shortcut.name}</span>
          </div>
          <div className="shortcut-description">{shortcut.description}</div>
        </div>
        
        <div className="shortcut-controls">
          {isEditing ? (
            <div className="shortcut-edit">
              <div className="key-input-container">
                <Input 
                  value={editingKey}
                  onChange={(e) => setEditingKey(e.target.value)}
                  placeholder="输入快捷键"
                  className="key-input"
                  readOnly={isRecording}
                />
                <Button 
                  size="small"
                  onClick={handleKeyRecord}
                  className={`record-btn ${isRecording ? 'recording' : ''}`}
                  disabled={isRecording}
                >
                  {isRecording ? '录制中...' : '录制'}
                </Button>
              </div>
              <div className="edit-actions">
                <Button 
                  size="small" 
                  type="primary" 
                  onClick={() => handleSave(shortcut.id)}
                  className="save-btn"
                >
                  保存
                </Button>
                <Button 
                  size="small" 
                  onClick={handleCancel}
                  className="cancel-btn"
                >
                  取消
                </Button>
              </div>
            </div>
          ) : (
            <div className="shortcut-display">
              <Tag className="shortcut-key">{shortcut.currentKey}</Tag>
              <div className="shortcut-actions">
                <Button 
                  size="small" 
                  icon={<EditOutlined />} 
                  onClick={() => handleEdit(shortcut.id, shortcut.currentKey)}
                  className="edit-btn"
                  disabled={!shortcut.enabled}
                >
                  编辑
                </Button>
                <Button 
                  size="small" 
                  icon={<ReloadOutlined />} 
                  onClick={() => handleReset(shortcut.id)}
                  className="reset-btn"
                  disabled={!shortcut.enabled || shortcut.currentKey === shortcut.defaultKey}
                >
                  重置
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <Switch 
          size="small"
          checked={shortcut.enabled}
          onChange={(checked) => handleToggleEnabled(shortcut.id, checked)}
          className="shortcut-toggle"
        />
      </div>
    );
  };

  return (
    <div className="shortcut-settings">
      <div className="settings-sections">
        {/* 快捷键设置卡片 */}
        <Card 
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <ThunderboltOutlined style={{ marginRight: '8px', color: '#38b2ac' }} />
              快捷键设置
            </span>
          }
          extra={
            <Button 
              icon={<ReloadOutlined />}
              onClick={handleResetAll}
              className="reset-all-btn"
            >
              恢复默认
            </Button>
          }
        >
          <div className="shortcuts-container">
            <div className="shortcuts-list">
              {shortcuts.map(renderShortcutItem)}
            </div>
            
            {/* 重要快捷键说明 */}
            {/* <div className="shortcut-tips">
              <div className="tips-header">
                <QuestionCircleOutlined style={{ marginRight: '8px', color: '#38b2ac' }} />
                <span style={{ color: '#ffffff', fontWeight: 500 }}>重要快捷键说明</span>
              </div>
              <div className="tips-content">
                <div className="tip-item">
                  <Tag className="tip-key">⌘ + E</Tag>
                  <span className="tip-description">快速打开AI助手，随时开始对话</span>
                </div>
                <div className="tip-item">
                  <Tag className="tip-key">⌘ + N</Tag>
                  <span className="tip-description">创建新话题，开始全新的对话</span>
                </div>
                <div className="tip-item">
                  <Tag className="tip-key">⌘ + F</Tag>
                  <span className="tip-description">在当前对话中搜索历史消息</span>
                </div>
                <div className="tip-item">
                  <Tag className="tip-key">Escape</Tag>
                  <span className="tip-description">退出全屏模式，返回窗口模式</span>
                </div>
              </div>
            </div> */}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ShortcutSettings;