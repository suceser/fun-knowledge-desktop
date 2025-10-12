import React from 'react';
import { Card, Switch, Typography, Space, Button } from 'antd';
import {
  BgColorsOutlined,
  EyeOutlined,
  MenuOutlined,
  ZoomInOutlined,
  MessageOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { usePartialUpdate } from '../../../hooks/UseSettingsStorage';
import { DEFAULT_APP_CONFIG } from '../../../../main/types/Storage';
import './DisplaySettings.css';

const { Text } = Typography;

function DisplaySettings(): React.ReactElement {
  // 使用持久化存储
  const [settings, updateSettings, loading] = usePartialUpdate(
    'display',
    DEFAULT_APP_CONFIG.display
  );

  // 主题颜色选项
  const themeColors = [
    '#00B96B',
    '#FF4D4F',
    '#00B2A9',
    '#722ED1',
    '#9254DE',
    '#EB2F96',
    '#1677FF',
    '#FA8C16',
    '#9254DE',
    '#13C2C2',
    '#1890FF',
    '#00B96B',
  ];

  const handleThemeChange = async (value: '浅色' | '深色' | '系统') => {
    await updateSettings({ theme: value });
  };

  const handleThemeColorChange = async (color: string) => {
    await updateSettings({ themeColor: color });
  };

  const handleNavbarPositionChange = async (value: '左侧' | '顶部') => {
    await updateSettings({ navbarPosition: value });
  };

  const handleTopicPositionChange = async (value: '左侧' | '右侧') => {
    await updateSettings({ topicPosition: value });
  };

  const handleZoomChange = async (value: number) => {
    await updateSettings({ zoomLevel: value });
  };

  const handleModelIconTypeChange = async (value: '模型图标' | 'Emoji 表情' | '不显示') => {
    await updateSettings({ modelIconType: value });
  };

  const resetZoom = async () => {
    await updateSettings({ zoomLevel: 100 });
  };

  if (loading) {
    return <div className="display-settings">加载中...</div>;
  }

  const handleColorClick = (color: string) => {
    handleThemeColorChange(color);
  };

  const handleColorKeyDown = (event: React.KeyboardEvent, color: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleThemeColorChange(color);
    }
  };

  return (
    <div className="display-settings">
      <div className="settings-sections">
        {/* 显示设置 */}
        <Card
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <EyeOutlined style={{ marginRight: '8px', color: '#38b2ac' }} />
              显示设置
            </span>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="setting-item">
              <div className="setting-label">
                <Text style={{ color: '#ffffff', fontSize: '14px' }}>主题</Text>
              </div>
              <div className="theme-selector">
                <Button
                  className={`theme-btn ${settings.theme === '浅色' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('浅色')}
                  icon={<BgColorsOutlined />}
                >
                  浅色
                </Button>
                <Button
                  className={`theme-btn ${settings.theme === '深色' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('深色')}
                >
                  深色
                </Button>
                <Button
                  className={`theme-btn ${settings.theme === '系统' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('系统')}
                >
                  系统
                </Button>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                  主题颜色
                </Text>
              </div>
              <div className="color-palette">
                {themeColors.map((color) => (
                  <div
                    key={color}
                    className={`color-item ${
                      settings.themeColor === color ? 'selected' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorClick(color)}
                    onKeyDown={(event) => handleColorKeyDown(event, color)}
                    role="button"
                    tabIndex={0}
                    aria-label={`选择颜色 ${color}`}
                  />
                ))}
                <div className="color-hex">{settings.themeColor}</div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                    透明窗口
                  </Text>
                </div>
                <Switch
                  checked={settings.transparentWindow}
                  onChange={(checked) => updateSettings({ transparentWindow: checked })}
                  size="small"
                />
              </div>
            </div>
          </Space>
        </Card>

        {/* 导航栏设置 */}
        <Card
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <MenuOutlined style={{ marginRight: '8px', color: '#38b2ac' }} />
              导航栏设置
              <span className="new-badge">New</span>
            </span>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="setting-item">
              <div className="setting-label">
                <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                  导航栏位置
                </Text>
              </div>
              <div className="position-selector">
                <Button
                  className={`position-btn ${
                    settings.navbarPosition === '左侧' ? 'active' : ''
                  }`}
                  onClick={() => handleNavbarPositionChange('左侧')}
                >
                  左侧
                </Button>
                <Button
                  className={`position-btn ${
                    settings.navbarPosition === '顶部' ? 'active' : ''
                  }`}
                  onClick={() => handleNavbarPositionChange('顶部')}
                >
                  顶部
                </Button>
              </div>
            </div>
          </Space>
        </Card>

        {/* 缩放设置 */}
        <Card
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <ZoomInOutlined
                style={{ marginRight: '8px', color: '#38b2ac' }}
              />
              缩放设置
            </span>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="setting-item">
              <div className="zoom-control">
                <div className="zoom-label">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                    缩放
                  </Text>
                </div>
                <div className="zoom-slider">
                  <Button
                    className="zoom-btn"
                    onClick={() =>
                      handleZoomChange(Math.max(50, settings.zoomLevel - 10))
                    }
                  >
                    -
                  </Button>
                  <div className="zoom-display">
                    <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                      {settings.zoomLevel}%
                    </Text>
                  </div>
                  <Button
                    className="zoom-btn"
                    onClick={() =>
                      handleZoomChange(Math.min(200, settings.zoomLevel + 10))
                    }
                  >
                    +
                  </Button>
                  <Button className="reset-btn" onClick={resetZoom}>
                    重置
                  </Button>
                </div>
              </div>
            </div>
          </Space>
        </Card>

        {/* 话题设置 */}
        <Card
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <MessageOutlined
                style={{ marginRight: '8px', color: '#38b2ac' }}
              />
              话题设置
            </span>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="setting-item">
              <div className="setting-label">
                <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                  话题位置
                </Text>
              </div>
              <div className="position-selector">
                <Button
                  className={`position-btn ${
                    settings.topicPosition === '左侧' ? 'active' : ''
                  }`}
                  onClick={() => handleTopicPositionChange('左侧')}
                >
                  左侧
                </Button>
                <Button
                  className={`position-btn ${
                    settings.topicPosition === '右侧' ? 'active' : ''
                  }`}
                  onClick={() => handleTopicPositionChange('右侧')}
                >
                  右侧
                </Button>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                    自动切换到话题
                  </Text>
                </div>
                <Switch
                  checked={settings.autoSwitchTopic}
                  onChange={(checked) => updateSettings({ autoSwitchTopic: checked })}
                  size="small"
                />
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                    显示话题时间
                  </Text>
                </div>
                <Switch
                  checked={settings.showTopicTime}
                  onChange={(checked) => updateSettings({ showTopicTime: checked })}
                  size="small"
                />
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                    固定话题置顶
                  </Text>
                </div>
                <Switch
                  checked={settings.pinTopicTop}
                  onChange={(checked) => updateSettings({ pinTopicTop: checked })}
                  size="small"
                />
              </div>
            </div>
          </Space>
        </Card>

        {/* 助手设置 */}
        <Card
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <RobotOutlined style={{ marginRight: '8px', color: '#38b2ac' }} />
              助手设置
            </span>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="setting-item">
              <div className="setting-label">
                <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                  模型图标类型
                </Text>
              </div>
              <div className="icon-type-selector">
                <Button
                  className={`icon-type-btn ${
                    settings.modelIconType === '模型图标' ? 'active' : ''
                  }`}
                  onClick={() => handleModelIconTypeChange('模型图标')}
                >
                  模型图标
                </Button>
                <Button
                  className={`icon-type-btn ${
                    settings.modelIconType === 'Emoji 表情' ? 'active' : ''
                  }`}
                  onClick={() => handleModelIconTypeChange('Emoji 表情')}
                >
                  Emoji 表情
                </Button>
                <Button
                  className={`icon-type-btn ${
                    settings.modelIconType === '不显示' ? 'active' : ''
                  }`}
                  onClick={() => handleModelIconTypeChange('不显示')}
                >
                  不显示
                </Button>
              </div>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
}

export default DisplaySettings;
