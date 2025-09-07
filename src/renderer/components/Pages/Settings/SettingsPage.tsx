import React, { useState } from 'react';
import { Card, Switch, Select, Slider, Button, Typography, Divider, Space, Row, Col } from 'antd';
import {
  BellOutlined,
  EyeOutlined,
  GlobalOutlined,
  LockOutlined,
  DesktopOutlined,
  SoundOutlined,
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import './SettingsPage.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface SettingsState {
  notifications: boolean;
  darkMode: boolean;
  language: string;
  fontSize: number;
  autoSave: boolean;
  soundEnabled: boolean;
  privacy: string;
  updateFrequency: string;
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: true,
    darkMode: true,
    language: 'zh-CN',
    fontSize: 14,
    autoSave: true,
    soundEnabled: true,
    privacy: 'medium',
    updateFrequency: 'daily'
  });

  const handleSettingChange = (key: keyof SettingsState, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    console.log('保存设置:', settings);
    // 这里可以添加保存到本地存储或发送到服务器的逻辑
  };

  const handleReset = () => {
    setSettings({
      notifications: true,
      darkMode: true,
      language: 'zh-CN',
      fontSize: 14,
      autoSave: true,
      soundEnabled: true,
      privacy: 'medium',
      updateFrequency: 'daily'
    });
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <Title level={2} className="settings-title">
          <DesktopOutlined className="title-icon" />
          应用设置
        </Title>
        <Text className="settings-description">
          个性化您的应用体验，调整各项功能设置
        </Text>
      </div>

      <div className="settings-content">
        <Row gutter={[24, 24]}>
          {/* 通知设置 */}
          <Col xs={24} lg={12}>
            <Card className="settings-card" title={
              <Space>
                <BellOutlined className="card-icon" />
                <span>通知设置</span>
              </Space>
            }>
              <div className="setting-item">
                <div className="setting-label">
                  <Text strong>桌面通知</Text>
                  <Text type="secondary">接收重要消息的桌面通知</Text>
                </div>
                <Switch
                  checked={settings.notifications}
                  onChange={(checked) => handleSettingChange('notifications', checked)}
                />
              </div>
              
              <Divider />
              
              <div className="setting-item">
                <div className="setting-label">
                  <Text strong>声音提醒</Text>
                  <Text type="secondary">播放通知声音</Text>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onChange={(checked) => handleSettingChange('soundEnabled', checked)}
                />
              </div>
            </Card>
          </Col>

          {/* 外观设置 */}
          <Col xs={24} lg={12}>
            <Card className="settings-card" title={
              <Space>
                <EyeOutlined className="card-icon" />
                <span>外观设置</span>
              </Space>
            }>
              <div className="setting-item">
                <div className="setting-label">
                  <Text strong>深色模式</Text>
                  <Text type="secondary">使用深色主题界面</Text>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onChange={(checked) => handleSettingChange('darkMode', checked)}
                />
              </div>
              
              <Divider />
              
              <div className="setting-item">
                <div className="setting-label">
                  <Text strong>字体大小</Text>
                  <Text type="secondary">调整界面字体大小</Text>
                </div>
                <div className="slider-container">
                  <Slider
                    min={12}
                    max={20}
                    value={settings.fontSize}
                    onChange={(value) => handleSettingChange('fontSize', value)}
                    marks={{
                      12: '小',
                      16: '中',
                      20: '大'
                    }}
                  />
                </div>
              </div>
            </Card>
          </Col>

          {/* 语言设置 */}
          <Col xs={24} lg={12}>
            <Card className="settings-card" title={
              <Space>
                <GlobalOutlined className="card-icon" />
                <span>语言设置</span>
              </Space>
            }>
              <div className="setting-item">
                <div className="setting-label">
                  <Text strong>界面语言</Text>
                  <Text type="secondary">选择应用界面语言</Text>
                </div>
                <Select
                  value={settings.language}
                  onChange={(value) => handleSettingChange('language', value)}
                  style={{ width: 120 }}
                >
                  <Option value="zh-CN">简体中文</Option>
                  <Option value="zh-TW">繁體中文</Option>
                  <Option value="en-US">English</Option>
                  <Option value="ja-JP">日本語</Option>
                </Select>
              </div>
            </Card>
          </Col>

          {/* 隐私设置 */}
          <Col xs={24} lg={12}>
            <Card className="settings-card" title={
              <Space>
                <LockOutlined className="card-icon" />
                <span>隐私设置</span>
              </Space>
            }>
              <div className="setting-item">
                <div className="setting-label">
                  <Text strong>自动保存</Text>
                  <Text type="secondary">自动保存您的工作内容</Text>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onChange={(checked) => handleSettingChange('autoSave', checked)}
                />
              </div>
              
              <Divider />
              
              <div className="setting-item">
                <div className="setting-label">
                  <Text strong>隐私级别</Text>
                  <Text type="secondary">设置数据收集级别</Text>
                </div>
                <Select
                  value={settings.privacy}
                  onChange={(value) => handleSettingChange('privacy', value)}
                  style={{ width: 120 }}
                >
                  <Option value="high">高</Option>
                  <Option value="medium">中</Option>
                  <Option value="low">低</Option>
                </Select>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 操作按钮 */}
        <div className="settings-actions">
          <Space size="large">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              size="large"
              onClick={handleSave}
              className="save-button"
            >
              保存设置
            </Button>
            <Button
              icon={<ReloadOutlined />}
              size="large"
              onClick={handleReset}
              className="reset-button"
            >
              重置默认
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;