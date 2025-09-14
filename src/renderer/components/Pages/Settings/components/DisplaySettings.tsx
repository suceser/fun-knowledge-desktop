import React, { useState } from 'react';
import { Card, Switch, Typography, Space, Button } from 'antd';
import {
  BgColorsOutlined,
  EyeOutlined,
  MenuOutlined,
  ZoomInOutlined,
  MessageOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import './DisplaySettings.css';

const { Text } = Typography;

function DisplaySettings(): React.ReactElement {
  // 状态管理
  const [theme, setTheme] = useState('深色');
  const [themeColor, setThemeColor] = useState('#00B96B');
  const [transparentWindow, setTransparentWindow] = useState(true);
  const [navbarPosition, setNavbarPosition] = useState('左侧');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [topicPosition, setTopicPosition] = useState('左侧');
  const [autoSwitchTopic, setAutoSwitchTopic] = useState(false);
  const [showTopicTime, setShowTopicTime] = useState(true);
  const [pinTopicTop, setPinTopicTop] = useState(false);
  const [modelIconType, setModelIconType] = useState('模型图标');

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

  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  const handleThemeColorChange = (color: string) => {
    setThemeColor(color);
  };

  const handleNavbarPositionChange = (value: string) => {
    setNavbarPosition(value);
  };

  const handleTopicPositionChange = (value: string) => {
    setTopicPosition(value);
  };

  const handleZoomChange = (value: number) => {
    setZoomLevel(value);
  };

  const handleModelIconTypeChange = (value: string) => {
    setModelIconType(value);
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

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
                  className={`theme-btn ${theme === '浅色' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('浅色')}
                  icon={<BgColorsOutlined />}
                >
                  浅色
                </Button>
                <Button
                  className={`theme-btn ${theme === '深色' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('深色')}
                >
                  深色
                </Button>
                <Button
                  className={`theme-btn ${theme === '系统' ? 'active' : ''}`}
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
                      themeColor === color ? 'selected' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorClick(color)}
                    onKeyDown={(event) => handleColorKeyDown(event, color)}
                    role="button"
                    tabIndex={0}
                    aria-label={`选择颜色 ${color}`}
                  />
                ))}
                <div className="color-hex">{themeColor}</div>
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
                  checked={transparentWindow}
                  onChange={setTransparentWindow}
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
                    navbarPosition === '左侧' ? 'active' : ''
                  }`}
                  onClick={() => handleNavbarPositionChange('左侧')}
                >
                  左侧
                </Button>
                <Button
                  className={`position-btn ${
                    navbarPosition === '顶部' ? 'active' : ''
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
                      handleZoomChange(Math.max(50, zoomLevel - 10))
                    }
                  >
                    -
                  </Button>
                  <div className="zoom-display">
                    <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                      {zoomLevel}%
                    </Text>
                  </div>
                  <Button
                    className="zoom-btn"
                    onClick={() =>
                      handleZoomChange(Math.min(200, zoomLevel + 10))
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
                    topicPosition === '左侧' ? 'active' : ''
                  }`}
                  onClick={() => handleTopicPositionChange('左侧')}
                >
                  左侧
                </Button>
                <Button
                  className={`position-btn ${
                    topicPosition === '右侧' ? 'active' : ''
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
                  checked={autoSwitchTopic}
                  onChange={setAutoSwitchTopic}
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
                  checked={showTopicTime}
                  onChange={setShowTopicTime}
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
                  checked={pinTopicTop}
                  onChange={setPinTopicTop}
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
                    modelIconType === '模型图标' ? 'active' : ''
                  }`}
                  onClick={() => handleModelIconTypeChange('模型图标')}
                >
                  模型图标
                </Button>
                <Button
                  className={`icon-type-btn ${
                    modelIconType === 'Emoji 表情' ? 'active' : ''
                  }`}
                  onClick={() => handleModelIconTypeChange('Emoji 表情')}
                >
                  Emoji 表情
                </Button>
                <Button
                  className={`icon-type-btn ${
                    modelIconType === '不显示' ? 'active' : ''
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
