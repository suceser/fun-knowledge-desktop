import React, { useState, useEffect } from 'react';
import { Typography, Input, Button, message, Spin } from 'antd';
import {
  SearchOutlined,
  ApiOutlined,
  KeyOutlined,
  DatabaseOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { aiService } from '../../../../services/aiService';
import { ModelProvider } from '../../../../types/ai';
import './ModelSettings.css';

const { Title, Text } = Typography;
const { Password } = Input;

interface ModelInfo {
  id: string;
  name: string;
  status: 'available' | 'unavailable';
}

interface ModelProvider {
  id: string;
  name: string;
  icon: string;
  status: 'on' | 'off';
  apiKey?: string;
  apiUrl?: string;
  models?: ModelInfo[];
}

function ModelSettings(): React.ReactElement {
  const [selectedProvider, setSelectedProvider] = useState<string>('modelscope');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [modelProviders, setModelProviders] = useState<ModelProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [testingProvider, setTestingProvider] = useState<string>('');

  // 加载提供商数据
  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = () => {
    const providers = aiService.getProviders();
    setModelProviders(providers);

    // 如果当前选中的提供商不存在，选择第一个
    if (providers.length > 0 && !providers.find(p => p.id === selectedProvider)) {
      setSelectedProvider(providers[0].id);
    }
  };


  // 过滤提供商
  const filteredProviders = modelProviders.filter((provider) =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 获取当前选中的提供商
  const currentProvider = modelProviders.find((p) => p.id === selectedProvider);

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
  };

  const handleTest = async () => {
    if (!currentProvider) return;

    setTestingProvider(currentProvider.id);
    try {
      const result = await aiService.testProvider(currentProvider.id);
      if (result.success) {
        message.success('连接测试成功');
        loadProviders(); // 重新加载提供商状态
      } else {
        message.error(`连接测试失败: ${result.error}`);
      }
    } catch (error) {
      message.error('连接测试异常');
    } finally {
      setTestingProvider('');
    }
  };

  const handleManage = () => {
    // TODO: 实现管理模型功能
    message.info('模型管理功能开发中');
  };

  const handleAdd = () => {
    // TODO: 实现添加模型功能
    message.info('添加模型功能开发中');
  };

  // 更新提供商配置
  const handleProviderUpdate = async (updates: Partial<ModelProvider>) => {
    if (!currentProvider) return;

    setLoading(true);
    try {
      const updated = aiService.updateProvider(currentProvider.id, updates);
      if (updated) {
        loadProviders();
        message.success('配置更新成功');
      }
    } catch (error) {
      message.error('配置更新失败');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, providerId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleProviderSelect(providerId);
    }
  };

  const renderProviderIcon = (icon: string) => {
    const iconMap: { [key: string]: string } = {
      cherryin: '🍒',
      siliconflow: '🌊',
      modelscope: '🔮',
      openrouter: '🚀',
      o3: '⭕',
      aihubmix: '🤖',
      deepseek: '🔍',
      ollama: '🦙',
      anthropic: '🤖',
      openai: '🤖',
      azure: '☁️',
      ppio: '💾',
      burncloud: '🔥',
      cephalon: '🧠',
      phb: '🏢',
      ai302: '🎯',
      newapi: '🆕',
    };
    return iconMap[icon] || '🤖';
  };

  return (
    <div className="settings-content-section">
      <div className="model-settings-layout">
        {/* 左侧提供商列表 */}
        <div className="model-providers-sidebar">
          <Title level={5} className="providers-title">
            搜索模型平台
          </Title>

          <div className="provider-search">
            <Input
              placeholder="搜索模型平台..."
              prefix={
                <SearchOutlined style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="providers-list">
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className={`provider-item ${
                  selectedProvider === provider.id ? 'active' : ''
                }`}
                onClick={() => handleProviderSelect(provider.id)}
                onKeyDown={(e) => handleKeyDown(e, provider.id)}
                role="button"
                tabIndex={0}
              >
                <div className={`provider-icon ${provider.icon}`}>
                  {renderProviderIcon(provider.icon)}
                </div>
                <div className="provider-info">
                  <div className="provider-name">{provider.name}</div>
                </div>
                <div className="provider-status">
                  <div className={`status-indicator ${provider.status === 'connected' ? 'on' : 'off'}`} />
                  <span className={`status-text ${provider.status === 'connected' ? 'on' : 'off'}`}>
                    {provider.status === 'connected' ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧配置区域 */}
        <div className="model-config-area">
          {currentProvider ? (
            <>
              {/* 配置头部 */}
              <div className="config-header">
                <div className="config-title">
                  <div className={`provider-icon ${currentProvider.icon}`}>
                    {renderProviderIcon(currentProvider.icon)}
                  </div>
                  <div>
                    <Title level={4} className="config-title-text">
                      {currentProvider.name}
                    </Title>
                    <Text className="config-subtitle">
                      {currentProvider.status === 'connected' ? '已连接' :
                       currentProvider.status === 'error' ? '连接错误' : '未连接'}
                    </Text>
                  </div>
                </div>
              </div>

              {/* 配置表单 */}
              <div className="config-form">
                {/* API 密钥配置 */}
                <div className="config-section">
                  <Title level={5} className="section-title">
                    <KeyOutlined />
                    API 密钥
                  </Title>

                  <div className="form-item">
                    <Text className="form-label">API Key</Text>
                    <div className="password-input">
                      <Password
                        placeholder="请输入API密钥"
                        value={currentProvider.apiKey || ''}
                        visibilityToggle
                        onChange={(e) => {
                          handleProviderUpdate({ apiKey: e.target.value });
                        }}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: '0.5rem',
                    }}
                  >
                    <Button
                      className="test-btn"
                      onClick={handleTest}
                      loading={testingProvider === currentProvider.id}
                      disabled={!currentProvider.apiKey || testingProvider !== ''}
                    >
                      {testingProvider === currentProvider.id ? '测试中...' : '检测'}
                    </Button>
                  </div>
                </div>

                {/* API 地址配置 */}
                <div className="config-section">
                  <Title level={5} className="section-title">
                    <ApiOutlined />
                    API 地址
                  </Title>

                  <div className="form-item">
                    <Text className="form-label">Base URL</Text>
                    <div className="form-input">
                      <Input
                        placeholder="请输入API地址"
                        value={currentProvider.apiUrl || ''}
                        onChange={(e) => {
                          handleProviderUpdate({ apiUrl: e.target.value });
                        }}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <Text
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.8rem',
                      display: 'block',
                      marginTop: '0.5rem',
                    }}
                  >
                    {currentProvider.apiUrl} 结束配置时请确保以 /
                    结尾，否则可能导致请求失败
                  </Text>
                </div>

                {/* 模型列表 */}
                {currentProvider.models &&
                  currentProvider.models.length > 0 && (
                    <div className="config-section models-section">
                      <Title level={5} className="section-title">
                        <DatabaseOutlined />
                        模型
                      </Title>

                      <div className="models-grid">
                        {currentProvider.models.map((model) => (
                          <div key={model.id} className="model-item">
                            <div className="model-name" title={model.name}>
                              {model.displayName || model.name}
                            </div>
                            <div className="model-status">
                              <div
                                className={`status-indicator ${
                                  model.status === 'available' ? 'on' : 'off'
                                }`}
                              />
                              <span
                                className={`status-text ${
                                  model.status === 'available' ? 'on' : 'off'
                                }`}
                              >
                                {model.status === 'available'
                                  ? '可用'
                                  : '不可用'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Text
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.8rem',
                          display: 'block',
                          marginTop: '1rem',
                        }}
                      >
                        共 {currentProvider.models.length} 个模型可用
                      </Text>
                    </div>
                  )}
              </div>

              {/* 操作按钮 */}
              <div className="config-actions">
                <Button
                  className="action-btn manage-btn"
                  onClick={handleManage}
                >
                  管理
                </Button>
                <Button className="action-btn add-btn" onClick={handleAdd}>
                  添加
                </Button>
              </div>
            </>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              <SettingOutlined
                style={{ fontSize: '3rem', marginBottom: '1rem' }}
              />
              <Title level={4} style={{ color: '#ffffff' }}>
                请选择模型提供商
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                从左侧列表中选择要配置的模型提供商
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModelSettings;
