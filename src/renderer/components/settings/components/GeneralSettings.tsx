import React from 'react';
import { Card, Switch, Select, Typography, Space, message } from 'antd';
import {
  GlobalOutlined,
  BellOutlined,
  RocketOutlined,
  AppstoreOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { usePartialUpdate } from '../../../hooks/useSettingsStorage';
import { DEFAULT_APP_CONFIG } from '../../../../main/types/storage';
import './GeneralSettings.css';

const { Text } = Typography;
const { Option } = Select;

function GeneralSettings(): React.ReactElement {
  // 使用持久化存储
  const [settings, updateSettings, loading] = usePartialUpdate(
    'general',
    DEFAULT_APP_CONFIG.general
  );

  const handleLanguageChange = async (value: string) => {
    await updateSettings({ language: value });
    message.success('语言设置已更新');
  };

  const handleProxyModeChange = async (value: 'system' | 'direct' | 'custom') => {
    await updateSettings({ proxyMode: value });
    message.success('代理模式已更新');
  };

  if (loading) {
    return <div className="general-settings">加载中...</div>;
  }

  return (
    <div className="general-settings">
      {/* <div className="settings-header">
        <Title level={3} style={{ color: '#ffffff', margin: 0 }}>
          <SettingOutlined style={{ marginRight: '8px', color: '#38b2ac' }} />
          常规设置
        </Title>
      </div> */}

      <div className="settings-sections">
        {/* 常规设置 */}
        <Card
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <GlobalOutlined
                style={{ marginRight: '8px', color: '#38b2ac' }}
              />
              常规设置
            </span>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="setting-item">
              <div className="setting-label">
                <Text style={{ color: '#ffffff', fontSize: '14px' }}>语言</Text>
              </div>
              <Select
                value={settings.language}
                onChange={handleLanguageChange}
                style={{ width: 120 }}
                size="small"
              >
                <Option value="zh-CN">🇨🇳 中文</Option>
                <Option value="en-US">🇺🇸 English</Option>
                <Option value="ja-JP">🇯🇵 日本語</Option>
              </Select>
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                  代理模式
                </Text>
              </div>
              <Select
                value={settings.proxyMode}
                onChange={handleProxyModeChange}
                style={{ width: 120 }}
                size="small"
              >
                <Option value="system">系统代理</Option>
                <Option value="direct">直连</Option>
                <Option value="custom">自定义</Option>
              </Select>
            </div>

            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                    拼写检查
                  </Text>
                </div>
                <Switch
                  checked={settings.spellCheck}
                  onChange={(checked) => updateSettings({ spellCheck: checked })}
                  size="small"
                />
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                    禁用硬件加速
                  </Text>
                </div>
                <Switch
                  checked={!settings.hardwareAcceleration}
                  onChange={(checked) => updateSettings({ hardwareAcceleration: !checked })}
                  size="small"
                />
              </div>
            </div>
          </Space>
        </Card>

        {/* 通知设置 */}
        <Card
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <BellOutlined style={{ marginRight: '8px', color: '#38b2ac' }} />
              通知设置
            </span>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                    助手消息
                  </Text>
                  <InfoCircleOutlined
                    style={{
                      marginLeft: '4px',
                      color: '#38b2ac',
                      fontSize: '12px',
                    }}
                  />
                </div>
                <Switch
                  checked={settings.assistantMessages}
                  onChange={(checked) => updateSettings({ assistantMessages: checked })}
                  size="small"
                />
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                    备份
                  </Text>
                </div>
                <Switch
                  checked={settings.backup}
                  onChange={(checked) => updateSettings({ backup: checked })}
                  size="small"
                />
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                    知识库
                  </Text>
                </div>
                <Switch
                  checked={settings.knowledgeBase}
                  onChange={(checked) => updateSettings({ knowledgeBase: checked })}
                  size="small"
                />
              </div>
            </div>
          </Space>
        </Card>

        {/* 启动 */}
        <Card
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <RocketOutlined
                style={{ marginRight: '8px', color: '#38b2ac' }}
              />
              启动
            </span>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                    开机自动启动
                  </Text>
                </div>
                <Switch
                  checked={settings.autoStart}
                  onChange={(checked) => updateSettings({ autoStart: checked })}
                  size="small"
                />
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                    启动时最小化到托盘
                  </Text>
                </div>
                <Switch
                  checked={settings.minimizeToTray}
                  onChange={(checked) => updateSettings({ minimizeToTray: checked })}
                  size="small"
                />
              </div>
            </div>
          </Space>
        </Card>

        {/* 托盘 */}
        <Card
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <AppstoreOutlined
                style={{ marginRight: '8px', color: '#38b2ac' }}
              />
              托盘
            </span>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                    显示托盘图标
                  </Text>
                </div>
                <Switch
                  checked={settings.showTrayIcon}
                  onChange={(checked) => updateSettings({ showTrayIcon: checked })}
                  size="small"
                />
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                    关闭时最小化到托盘
                  </Text>
                </div>
                <Switch
                  checked={settings.closeToTray}
                  onChange={(checked) => updateSettings({ closeToTray: checked })}
                  size="small"
                />
              </div>
            </div>
          </Space>
        </Card>

        {/* 隐私设置 */}
        <Card
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <InfoCircleOutlined
                style={{ marginRight: '8px', color: '#38b2ac' }}
              />
              隐私设置
            </span>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                    匿名发送错误报告和数据统计
                  </Text>
                </div>
                <Switch
                  checked={settings.anonymousReporting}
                  onChange={(checked) => updateSettings({ anonymousReporting: checked })}
                  size="small"
                />
              </div>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
}

export default GeneralSettings;
