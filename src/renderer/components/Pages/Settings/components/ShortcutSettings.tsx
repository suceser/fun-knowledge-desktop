import React, { useState } from 'react';
import { Card, Button, Typography, Tag, Input, message, Switch } from 'antd';
import {
  ThunderboltOutlined,
  EditOutlined,
  ReloadOutlined,
  MessageOutlined,
  EyeInvisibleOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import './ShortcutSettings.css';

interface ShortcutItem {
  id: string;
  name: string;
  description: string;
  defaultKey: string;
  currentKey: string;
  category: string;
  enabled: boolean;
}

const defaultShortcuts: ShortcutItem[] = [
  {
    id: 'display-hidden-app',
    name: '显示/隐藏应用',
    description: '快速显示或隐藏应用窗口',
    defaultKey: '按下快捷键',
    currentKey: '按下快捷键',
    category: 'app',
    enabled: true,
  },
  {
    id: 'quick-assistant',
    name: '快捷助手',
    description: '快速打开AI助手对话',
    defaultKey: '⌘ + E',
    currentKey: '⌘ + E',
    category: 'assistant',
    enabled: true,
  },
  {
    id: 'open-assistant',
    name: '开关助手手',
    description: '开启或关闭助手功能',
    defaultKey: '按下快捷键',
    currentKey: '按下快捷键',
    category: 'assistant',
    enabled: true,
  },
  {
    id: 'assistant-word',
    name: '划词助手：取词',
    description: '选中文字后快速取词翻译',
    defaultKey: '按下快捷键',
    currentKey: '按下快捷键',
    category: 'assistant',
    enabled: true,
  },
  {
    id: 'exit-fullscreen',
    name: '退出全屏',
    description: '退出全屏模式',
    defaultKey: 'Escape',
    currentKey: 'Escape',
    category: 'display',
    enabled: true,
  },
  {
    id: 'new-conversation',
    name: '新建话题',
    description: '创建新的对话话题',
    defaultKey: '⌘ + N',
    currentKey: '⌘ + N',
    category: 'conversation',
    enabled: true,
  },
  {
    id: 'toggle-assistant-tips',
    name: '切换助手显示',
    description: '显示或隐藏助手提示信息',
    defaultKey: '⌘ + [',
    currentKey: '⌘ + [',
    category: 'assistant',
    enabled: true,
  },
  {
    id: 'toggle-conversation-tips',
    name: '切换话题显示',
    description: '显示或隐藏话题列表',
    defaultKey: '⌘ + ]',
    currentKey: '⌘ + ]',
    category: 'conversation',
    enabled: true,
  },
  {
    id: 'copy-last-message',
    name: '复制上一条消息',
    description: '快速复制最后一条对话消息',
    defaultKey: '⌘ + ⇧ + C',
    currentKey: '⌘ + ⇧ + C',
    category: 'conversation',
    enabled: true,
  },
  {
    id: 'search-messages',
    name: '搜索消息',
    description: '在对话历史中搜索消息',
    defaultKey: '⌘ + ⇧ + F',
    currentKey: '⌘ + ⇧ + F',
    category: 'conversation',
    enabled: true,
  },
  {
    id: 'clear-messages',
    name: '清空消息',
    description: '清空当前对话的所有消息',
    defaultKey: '⌘ + L',
    currentKey: '⌘ + L',
    category: 'conversation',
    enabled: true,
  },
  {
    id: 'clear-context',
    name: '清除上下文',
    description: '清除对话的上下文记忆',
    defaultKey: '⌘ + K',
    currentKey: '⌘ + K',
    category: 'conversation',
    enabled: true,
  },
  {
    id: 'search-previous',
    name: '在当前对话中搜索消息',
    description: '在当前对话历史中搜索特定消息',
    defaultKey: '⌘ + F',
    currentKey: '⌘ + F',
    category: 'conversation',
    enabled: true,
  },
];

function ShortcutSettings(): React.ReactElement {
  const [shortcuts, setShortcuts] = useState<ShortcutItem[]>(defaultShortcuts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { key: 'all', name: '全部', icon: <GlobalOutlined /> },
    { key: 'app', name: '应用', icon: <ThunderboltOutlined /> },
    { key: 'assistant', name: '助手', icon: <MessageOutlined /> },
    { key: 'conversation', name: '对话', icon: <MessageOutlined /> },
    { key: 'display', name: '显示', icon: <EyeInvisibleOutlined /> },
  ];

  const handleEditShortcut = (id: string, currentKey: string) => {
    setEditingId(id);
    setEditingKey(currentKey);
  };

  const handleSaveShortcut = () => {
    if (editingId && editingKey.trim()) {
      setShortcuts(
        shortcuts.map((shortcut) =>
          shortcut.id === editingId
            ? { ...shortcut, currentKey: editingKey.trim() }
            : shortcut,
        ),
      );
      setEditingId(null);
      setEditingKey('');
      message.success('快捷键已更新');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingKey('');
  };

  const handleResetShortcut = (id: string) => {
    setShortcuts(
      shortcuts.map((shortcut) =>
        shortcut.id === id
          ? { ...shortcut, currentKey: shortcut.defaultKey }
          : shortcut,
      ),
    );
    message.success('快捷键已重置');
  };

  const handleToggleShortcut = (id: string, enabled: boolean) => {
    setShortcuts(
      shortcuts.map((shortcut) =>
        shortcut.id === id ? { ...shortcut, enabled } : shortcut,
      ),
    );
    message.success(enabled ? '快捷键已启用' : '快捷键已禁用');
  };

  const handleResetAll = () => {
    setShortcuts(
      shortcuts.map((shortcut) => ({
        ...shortcut,
        currentKey: shortcut.defaultKey,
        enabled: true,
      })),
    );
    message.success('所有快捷键已重置');
  };

  const filteredShortcuts = shortcuts.filter((shortcut) => {
    const matchesCategory =
      filterCategory === 'all' || shortcut.category === filterCategory;
    const matchesSearch =
      shortcut.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shortcut.currentKey.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      app: '#38b2ac',
      assistant: '#4299e1',
      conversation: '#48bb78',
      display: '#ed8936',
    };
    return colors[category] || '#718096';
  };

  return (
    <div className="settings-content-section shortcut-settings">
      <div className="settings-header">
        <Typography.Title level={3}>
          <ThunderboltOutlined
            style={{ marginRight: '8px', color: '#38b2ac' }}
          />
          快捷键设置
        </Typography.Title>
      </div>

      <div className="settings-sections">
        {/* 快捷键管理 */}
        <Card
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <ThunderboltOutlined style={{ marginRight: '8px' }} />
              快捷键管理
            </span>
          }
          extra={
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleResetAll}
              size="small"
            >
              重置全部
            </Button>
          }
        >
          {/* 筛选和搜索 */}
          <div className="shortcut-filters">
            <div className="category-filters">
              {categories.map((category) => (
                <Button
                  key={category.key}
                  type={filterCategory === category.key ? 'primary' : 'default'}
                  icon={category.icon}
                  onClick={() => setFilterCategory(category.key)}
                  size="small"
                >
                  {category.name}
                </Button>
              ))}
            </div>
            <Input
              placeholder="搜索快捷键..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '200px' }}
              allowClear
            />
          </div>

          {/* 快捷键列表 */}
          <div className="shortcut-list">
            {filteredShortcuts.map((shortcut) => (
              <div key={shortcut.id} className="shortcut-item">
                <div className="shortcut-info">
                  <div className="shortcut-header">
                    <span className="shortcut-name">{shortcut.name}</span>
                    <Tag
                      color={getCategoryColor(shortcut.category)}
                      style={{ marginLeft: '8px' }}
                    >
                      {categories.find((c) => c.key === shortcut.category)
                        ?.name || shortcut.category}
                    </Tag>
                  </div>
                  <div className="shortcut-description">
                    {shortcut.description}
                  </div>
                </div>

                <div className="shortcut-controls">
                  <div className="shortcut-key">
                    {editingId === shortcut.id ? (
                      <div className="shortcut-edit">
                        <Input
                          value={editingKey}
                          onChange={(e) => setEditingKey(e.target.value)}
                          onPressEnter={handleSaveShortcut}
                          placeholder="输入快捷键"
                          size="small"
                          style={{ width: '120px' }}
                        />
                        <Button
                          type="primary"
                          size="small"
                          onClick={handleSaveShortcut}
                        >
                          保存
                        </Button>
                        <Button size="small" onClick={handleCancelEdit}>
                          取消
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Tag className="key-tag">{shortcut.currentKey}</Tag>
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          size="small"
                          onClick={() =>
                            handleEditShortcut(shortcut.id, shortcut.currentKey)
                          }
                        />
                        <Button
                          type="text"
                          icon={<ReloadOutlined />}
                          size="small"
                          onClick={() => handleResetShortcut(shortcut.id)}
                          disabled={shortcut.currentKey === shortcut.defaultKey}
                        />
                      </>
                    )}
                  </div>

                  <Switch
                    checked={shortcut.enabled}
                    onChange={(enabled) =>
                      handleToggleShortcut(shortcut.id, enabled)
                    }
                    size="small"
                  />
                </div>
              </div>
            ))}
          </div>

          {filteredShortcuts.length === 0 && (
            <div className="empty-state">
              <Typography.Text type="secondary">
                没有找到匹配的快捷键
              </Typography.Text>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default ShortcutSettings;
