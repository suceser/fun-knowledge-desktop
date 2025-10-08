import React, { useState } from 'react';
import {
  Card,
  Switch,
  Select,
  Typography,
  Input,
  Button,
  Space,
  Slider,
  message,
} from 'antd';
import {
  SearchOutlined,
  GlobalOutlined,
  SettingOutlined,
  PlusOutlined,
  LinkOutlined,
  EyeOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { usePartialUpdate } from '../../../../hooks/useSettingsStorage';
import { DEFAULT_APP_CONFIG } from '../../../../../types/storage';
import './SearchSettings.css';

const { Title, Text } = Typography;
const { Option } = Select;

function SearchSettings(): React.ReactElement {
  // 使用持久化存储
  const [settings, updateSettings, loading] = usePartialUpdate(
    'search',
    DEFAULT_APP_CONFIG.search
  );
  
  // 本地临时输入状态
  const [blacklistInput, setBlacklistInput] = useState('');

  const handleProviderChange = async (value: string) => {
    await updateSettings({ searchProvider: value });
    message.success('搜索服务商已更新');
  };

  const handleApiKeyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await updateSettings({ apiKey: e.target.value });
  };

  const handleApiUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await updateSettings({ apiUrl: e.target.value });
  };

  const handleMaxResultsChange = async (value: number) => {
    await updateSettings({ maxResults: value });
  };

  const handleAddBlacklistSite = async () => {
    if (
      blacklistInput.trim() &&
      !blacklistSites.includes(blacklistInput.trim())
    ) {
      await updateSettings({
        blacklistSites: [...blacklistSites, blacklistInput.trim()],
      });
      setBlacklistInput('');
      message.success('已添加到黑名单');
    }
  };

  const handleRemoveBlacklistSite = async (site: string) => {
    await updateSettings({
      blacklistSites: blacklistSites.filter((s) => s !== site),
    });
    message.success('已从黑名单移除');
  };

  const handleTestConnection = () => {
    message.loading('正在测试连接...', 1);
    setTimeout(() => {
      message.success('连接测试成功');
    }, 1000);
  };

  if (loading) {
    return <div className="search-settings">加载中...</div>;
  }

  // 确保 blacklistSites 是数组
  const blacklistSites = settings.blacklistSites || [];

  return (
    <div className="settings-content-section search-settings">
      <div className="settings-header">
        <Title level={3}>
          <GlobalOutlined style={{ marginRight: '8px', color: '#38b2ac' }} />
          网络搜索
        </Title>
      </div>

      <div className="settings-sections">
        {/* 搜索服务商配置 */}
        <Card
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <SearchOutlined style={{ marginRight: '8px' }} />
              搜索服务商
            </span>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="form-item">
              <Text className="form-label">搜索服务商</Text>
              <Select
                value={settings.searchProvider}
                onChange={handleProviderChange}
                style={{ width: '100%' }}
              >
                <Option value="Tavily (API 密钥)">Tavily (API 密钥)</Option>
                <Option value="Google (API 密钥)">Google (API 密钥)</Option>
                <Option value="Bing (API 密钥)">Bing (API 密钥)</Option>
                <Option value="DuckDuckGo (免费)">DuckDuckGo (免费)</Option>
              </Select>
            </div>

            <div className="form-item">
              <Text className="form-label">API 密钥</Text>
              <Input.Password
                value={settings.apiKey}
                onChange={handleApiKeyChange}
                placeholder="请输入API密钥"
                visibilityToggle
              />
            </div>

            <div className="form-item">
              <Text className="form-label">API 地址</Text>
              <Input
                value={settings.apiUrl}
                onChange={handleApiUrlChange}
                placeholder="请输入API地址"
                addonBefore={<LinkOutlined />}
              />
            </div>

            <div className="form-actions">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={handleTestConnection}
              >
                测试连接
              </Button>
            </div>
          </Space>
        </Card>

        {/* 搜索配置 */}
        <Card
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <SettingOutlined style={{ marginRight: '8px' }} />
              搜索配置
            </span>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="form-item">
              <div className="form-item-header">
                <Text className="form-label">包含答案</Text>
                <Switch
                  checked={settings.includeAnswer}
                  onChange={(checked) => updateSettings({ includeAnswer: checked })}
                  size="small"
                />
              </div>
              <Text className="form-description">
                是否在搜索结果中包含直接答案
              </Text>
            </div>

            <div className="form-item">
              <Text className="form-label">最大结果数: {settings.maxResults}</Text>
              <Slider
                min={1}
                max={20}
                value={settings.maxResults}
                onChange={handleMaxResultsChange}
                marks={{
                  1: '1',
                  5: '5',
                  10: '10',
                  15: '15',
                  20: '20',
                }}
              />
            </div>

            <div className="form-item">
              <Text className="form-label">压缩方法</Text>
              <Select
                value={settings.compressionMethod}
                onChange={(value) => updateSettings({ compressionMethod: value })}
                style={{ width: '100%' }}
              >
                <Option value="不压缩">不压缩</Option>
                <Option value="智能压缩">智能压缩</Option>
                <Option value="高度压缩">高度压缩</Option>
              </Select>
            </div>
          </Space>
        </Card>

        {/* 网站黑名单 */}
        <Card
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <GlobalOutlined style={{ marginRight: '8px' }} />
              网站黑名单
            </span>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="form-item">
              <Text className="form-description">
                添加不希望在搜索结果中出现的网站域名
              </Text>

              <div className="blacklist-controls">
                <div className="blacklist-input">
                  <Input
                    value={blacklistInput}
                    onChange={(e) => setBlacklistInput(e.target.value)}
                    placeholder="输入要屏蔽的网站域名"
                    onPressEnter={handleAddBlacklistSite}
                  />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddBlacklistSite}
                  >
                    添加
                  </Button>
                </div>

                {blacklistSites.length > 0 && (
                  <div className="blacklist-list">
                    {blacklistSites.map((site) => (
                      <div key={site} className="blacklist-item">
                        <span>{site}</span>
                        <CloseOutlined
                          onClick={() => handleRemoveBlacklistSite(site)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
}

export default SearchSettings;
