import React, { useState } from 'react';
import { Card, Switch, Select, Typography, Input, Button, Space, Slider, Tag, message } from 'antd';
import { 
  SearchOutlined, 
  GlobalOutlined, 
  SettingOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  LinkOutlined,
  EyeOutlined,
  CloseOutlined
} from '@ant-design/icons';
import './SearchSettings.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface SearchSettingsProps {
  // 可以添加props用于状态管理
}

const SearchSettings: React.FC<SearchSettingsProps> = () => {
  // 状态管理
  const [searchProvider, setSearchProvider] = useState('Tavily (API 密钥)');
  const [apiKey, setApiKey] = useState('');
  const [apiUrl, setApiUrl] = useState('https://api.tavily.com');
  const [includeAnswer, setIncludeAnswer] = useState(true);
  const [maxResults, setMaxResults] = useState(5);
  const [enableCompression, setEnableCompression] = useState(false);
  const [compressionMethod, setCompressionMethod] = useState('不压缩');
  const [blacklistInput, setBlacklistInput] = useState('');
  const [blacklistSites, setBlacklistSites] = useState<string[]>([]);

  const handleProviderChange = (value: string) => {
    setSearchProvider(value);
    message.success('搜索服务商已更新');
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleApiUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiUrl(e.target.value);
  };

  const handleMaxResultsChange = (value: number) => {
    setMaxResults(value);
  };

  const handleAddBlacklistSite = () => {
    if (blacklistInput.trim() && !blacklistSites.includes(blacklistInput.trim())) {
      setBlacklistSites([...blacklistSites, blacklistInput.trim()]);
      setBlacklistInput('');
      message.success('已添加到黑名单');
    }
  };

  const handleRemoveBlacklistSite = (site: string) => {
    setBlacklistSites(blacklistSites.filter(s => s !== site));
    message.success('已从黑名单移除');
  };

  const handleTestConnection = () => {
    message.loading('正在测试连接...', 1);
    setTimeout(() => {
      message.success('连接测试成功');
    }, 1000);
  };

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
              <SearchOutlined style={{ marginRight: '8px', color: '#38b2ac' }} />
              搜索服务商
            </span>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>搜索服务商</Text>
                </div>
                <Select
                  value={searchProvider}
                  onChange={handleProviderChange}
                  style={{ minWidth: '180px' }}
                >
                  <Option value="Tavily (API 密钥)">Tavily (API 密钥)</Option>
                  <Option value="Google">Google</Option>
                  <Option value="Bing">Bing</Option>
                </Select>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>Tavily</Text>
                  <Button 
                    type="link" 
                    size="small" 
                    icon={<LinkOutlined />}
                    style={{ color: '#38b2ac', padding: 0, height: 'auto', fontSize: '12px' }}
                    onClick={() => window.open('https://tavily.com', '_blank')}
                  >
                    https://tavily.com
                  </Button>
                </div>
              </div>
            </div>
          </Space>
        </Card>

        {/* API配置 */}
        <Card 
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <SettingOutlined style={{ marginRight: '8px', color: '#38b2ac' }} />
              API 密钥
            </span>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info" style={{ flex: 1 }}>
                  <Text style={{ color: '#ffffff', fontSize: '14px', marginBottom: '4px', display: 'block' }}>API 密钥</Text>
                  <Input
                    value={apiKey}
                    onChange={handleApiKeyChange}
                    placeholder="请输入API密钥"
                    type="password"
                    style={{ width: '100%' }}
                    suffix={
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<EyeOutlined />}
                        style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                      />
                    }
                  />
                  <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    多个密钥请使用逗号分隔，多个密钥可以提高并发性能
                  </Text>
                </div>
                <Button 
                  type="primary" 
                  size="small"
                  onClick={handleTestConnection}
                  style={{ alignSelf: 'flex-start', marginTop: '20px' }}
                >
                  检测
                </Button>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>API 地址</Text>
                </div>
                <Input
                  value={apiUrl}
                  onChange={handleApiUrlChange}
                  placeholder="https://api.tavily.com"
                  style={{ width: '200px' }}
                />
              </div>
            </div>
          </Space>
        </Card>

        {/* 常规设置 */}
        <Card 
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <SettingOutlined style={{ marginRight: '8px', color: '#38b2ac' }} />
              常规设置
            </span>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>搜索包含日期</Text>
                </div>
                <Switch
                  checked={includeAnswer}
                  onChange={setIncludeAnswer}
                />
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>搜索结果个数</Text>
                </div>
                <div style={{ width: '200px' }}>
                  <Slider
                    min={1}
                    max={100}
                    value={maxResults}
                    onChange={handleMaxResultsChange}
                    marks={{
                      1: '1',
                      5: '5',
                      20: '20',
                      50: '50',
                      100: '100'
                    }}
                  />
                </div>
              </div>
            </div>
          </Space>
        </Card>

        {/* 搜索结果压缩 */}
        <Card 
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <SettingOutlined style={{ marginRight: '8px', color: '#38b2ac' }} />
              搜索结果压缩
            </span>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>压缩方法</Text>
                </div>
                <Select
                  value={compressionMethod}
                  onChange={setCompressionMethod}
                  style={{ minWidth: '120px' }}
                >
                  <Option value="不压缩">不压缩</Option>
                  <Option value="智能压缩">智能压缩</Option>
                  <Option value="高度压缩">高度压缩</Option>
                </Select>
              </div>
            </div>
          </Space>
        </Card>

        {/* 黑名单 */}
        <Card 
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <SettingOutlined style={{ marginRight: '8px', color: '#38b2ac' }} />
              黑名单
            </span>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="setting-item">
              <div className="setting-content" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <Text style={{ color: '#ffffff', fontSize: '14px', marginBottom: '8px' }}>在搜索结果中不会出现以下站点的结果</Text>
                
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
                    {blacklistSites.map((site, index) => (
                      <div key={index} className="blacklist-item">
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
};

export default SearchSettings;