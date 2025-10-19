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
import { usePartialUpdate } from '../../../hooks/UseSettingsStorage';
import './ShortcutSettings.css';
import {DEFAULT_APP_CONFIG} from "../models/DefaultAppConfig";

const { Text } = Typography;

function ShortcutSettings(): React.ReactElement {
  // 使用持久化存储
  const [settings, updateSettings, loading] = usePartialUpdate(
    'shortcuts',
    DEFAULT_APP_CONFIG.shortcuts
  );
  
  // 本地编辑状态
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

  const handleSaveShortcut = async () => {
    if (editingId && editingKey.trim()) {
      const shortcuts = settings.shortcuts || [];
      await updateSettings({
        shortcuts: shortcuts.map((shortcut) =>
          shortcut.id === editingId
            ? { ...shortcut, currentKey: editingKey.trim() }
            : shortcut,
        ),
      });
      setEditingId(null);
      setEditingKey('');
      message.success('快捷键已更新');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingKey('');
  };

  const handleResetShortcut = async (id: string) => {
    const shortcuts = settings.shortcuts || [];
    await updateSettings({
      shortcuts: shortcuts.map((shortcut) =>
        shortcut.id === id
          ? { ...shortcut, currentKey: shortcut.defaultKey }
          : shortcut,
      ),
    });
    message.success('快捷键已重置');
  };

  const handleToggleShortcut = async (id: string, enabled: boolean) => {
    const shortcuts = settings.shortcuts || [];
    await updateSettings({
      shortcuts: shortcuts.map((shortcut) =>
        shortcut.id === id ? { ...shortcut, enabled } : shortcut,
      ),
    });
    message.success(enabled ? '快捷键已启用' : '快捷键已禁用');
  };

  const handleResetAll = async () => {
    await updateSettings({
      shortcuts: DEFAULT_APP_CONFIG.shortcuts.shortcuts,
    });
    message.success('所有快捷键已重置');
  };

  if (loading) {
    return <div className="shortcut-settings">加载中...</div>;
  }

  // 确保 shortcuts 存在且是数组
  const shortcuts = settings.shortcuts || [];

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
