import React, { useState } from 'react';
import { Typography, Input, Button } from 'antd';
import {
  SearchOutlined,
  ApiOutlined,
  KeyOutlined,
  DatabaseOutlined,
  SettingOutlined,
} from '@ant-design/icons';
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
  const [selectedProvider, setSelectedProvider] =
    useState<string>('modelscope');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 模拟的模型提供商数据
  const modelProviders: ModelProvider[] = [
    {
      id: 'cherryin',
      name: 'CherryIN',
      icon: 'cherryin',
      status: 'on',
      apiKey: '••••••••••••••••••••••••••••••••',
      apiUrl: 'https://api.cherryin.com/v1/',
      models: [
        { id: 'gpt-4', name: 'GPT-4', status: 'available' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', status: 'available' },
      ],
    },
    {
      id: 'siliconflow',
      name: '硅基流动',
      icon: 'siliconflow',
      status: 'on',
      apiKey: '••••••••••••••••••••••••••••••••',
      apiUrl: 'https://api.siliconflow.cn/v1/',
      models: [
        { id: 'qwen-turbo', name: 'Qwen Turbo', status: 'available' },
        { id: 'qwen-plus', name: 'Qwen Plus', status: 'available' },
      ],
    },
    {
      id: 'modelscope',
      name: 'ModelScope 魔搭',
      icon: 'modelscope',
      status: 'on',
      apiKey: '••••••••••••••••••••••••••••••••',
      apiUrl: 'https://api-inference.modelscope.cn/v1/',
      models: [
        {
          id: 'qwen2.5-72b-instruct',
          name: 'Qwen/Qwen2.5-72B-Instruct',
          status: 'available',
        },
        {
          id: 'qwen2.5-vl-72b-instruct',
          name: 'Qwen/Qwen2.5-VL-72B-Instruct',
          status: 'available',
        },
        {
          id: 'qwen2.5-coder-32b-instruct',
          name: 'Qwen/Qwen2.5-Coder-32B-Instruct',
          status: 'available',
        },
        {
          id: 'deepseek-r1',
          name: 'deepseek-ai/DeepSeek-R1',
          status: 'available',
        },
        {
          id: 'deepseek-v3',
          name: 'deepseek-ai/DeepSeek-V3',
          status: 'available',
        },
      ],
    },
    {
      id: 'openrouter',
      name: 'OpenRouter',
      icon: 'openrouter',
      status: 'off',
    },
    {
      id: 'o3',
      name: 'O3',
      icon: 'o3',
      status: 'off',
    },
    {
      id: 'aihubmix',
      name: 'AiHubMix',
      icon: 'aihubmix',
      status: 'off',
    },
    {
      id: 'deepseek',
      name: '深度求索',
      icon: 'deepseek',
      status: 'off',
    },
    {
      id: 'ollama',
      name: 'Ollama',
      icon: 'ollama',
      status: 'off',
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      icon: 'anthropic',
      status: 'off',
    },
    {
      id: 'openai',
      name: 'OpenAI',
      icon: 'openai',
      status: 'off',
    },
    {
      id: 'azure',
      name: 'Azure OpenAI',
      icon: 'azure',
      status: 'off',
    },
    {
      id: 'ppio',
      name: 'PPIO 派盘云',
      icon: 'ppio',
      status: 'off',
    },
    {
      id: 'burncloud',
      name: 'BurnCloud',
      icon: 'burncloud',
      status: 'off',
    },
    {
      id: 'cephalon',
      name: 'Cephalon',
      icon: 'cephalon',
      status: 'off',
    },
    {
      id: 'phb',
      name: 'PHB 大模型开放平台',
      icon: 'phb',
      status: 'off',
    },
    {
      id: 'ai302',
      name: '302.AI',
      icon: 'ai302',
      status: 'off',
    },
    {
      id: 'newapi',
      name: 'New API',
      icon: 'newapi',
      status: 'off',
    },
  ];

  // 过滤提供商
  const filteredProviders = modelProviders.filter((provider) =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 获取当前选中的提供商
  const currentProvider = modelProviders.find((p) => p.id === selectedProvider);

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
  };

  const handleTest = () => {
    // TODO: 实现测试连接功能
  };

  const handleManage = () => {
    // TODO: 实现管理模型功能
  };

  const handleAdd = () => {
    // TODO: 实现添加模型功能
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
                  <div className={`status-indicator ${provider.status}`} />
                  <span className={`status-text ${provider.status}`}>
                    {provider.status.toUpperCase()}
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
                      {currentProvider.status === 'on' ? '已连接' : '未连接'}
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
                        value={currentProvider.apiKey}
                        visibilityToggle
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
                    <Button className="test-btn" onClick={handleTest}>
                      检测
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
                        value={currentProvider.apiUrl}
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
                            <div className="model-name">{model.name}</div>
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
                        备有 ModelScope 魔搭 又名 模型 优化更新详情
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
