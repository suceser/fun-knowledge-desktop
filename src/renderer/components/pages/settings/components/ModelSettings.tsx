import React, { useState, useEffect } from 'react';
import {
  Typography,
  Input,
  Button,
  message,
  Spin,
  Switch,
  Modal,
  Space,
  Tooltip,
  Collapse,
  Select,
} from 'antd';
import {
  SearchOutlined,
  ApiOutlined,
  KeyOutlined,
  DatabaseOutlined,
  SettingOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  LinkOutlined,
  RobotOutlined,
  DeleteOutlined,
  CopyOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import './ModelSettings.css';

const { Title, Text } = Typography;
const { Password } = Input;
const { Panel } = Collapse;
const { Option } = Select;

interface ModelInfo {
  id: string;
  name: string;
  displayName: string;
  status: 'available' | 'unavailable';
  maxTokens?: number;
  supportStream?: boolean;
  costPer1kTokens?: number;
  isCustom?: boolean;
}

interface ProviderConfig {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  apiKey: string;
  apiUrl: string;
  models: ModelInfo[];
  description?: string;
}

// 模拟的模型服务商数据
const initialProviders: ProviderConfig[] = [
  {
    id: 'modelscope',
    name: 'ModelScope 魔搭',
    icon: 'modelscope',
    enabled: true,
    apiKey: '',
    apiUrl: 'https://api-inference.modelscope.cn/v1/',
    description: '魔搭社区 v1 版本',
    models: [
      {
        id: 'qwen2.5-72b-instruct',
        name: 'Qwen/Qwen2.5-72B-Instruct',
        displayName: 'Qwen2.5-72B-Instruct',
        status: 'available',
        maxTokens: 8192,
        supportStream: true,
      },
      {
        id: 'qwen2.5-vl-72b-instruct',
        name: 'Qwen/Qwen2.5-VL-72B-Instruct',
        displayName: 'Qwen2.5-VL-72B-Instruct',
        status: 'available',
        maxTokens: 8192,
        supportStream: true,
      },
      {
        id: 'qwen2.5-coder-32b-instruct',
        name: 'Qwen/Qwen2.5-Coder-32B-Instruct',
        displayName: 'Qwen2.5-Coder-32B-Instruct',
        status: 'available',
        maxTokens: 8192,
        supportStream: true,
      },
    ],
  },
  {
    id: 'siliconflow',
    name: '硅基流动',
    icon: 'siliconflow',
    enabled: false,
    apiKey: '',
    apiUrl: 'https://api.siliconflow.cn/v1/',
    models: [],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    icon: 'openrouter',
    enabled: false,
    apiKey: '',
    apiUrl: 'https://openrouter.ai/api/v1/',
    models: [],
  },
  {
    id: 'o3',
    name: 'O3',
    icon: 'o3',
    enabled: false,
    apiKey: '',
    apiUrl: '',
    models: [],
  },
  {
    id: 'aihubmix',
    name: 'AiHubMix',
    icon: 'aihubmix',
    enabled: false,
    apiKey: '',
    apiUrl: '',
    models: [],
  },
  {
    id: 'deepseek',
    name: '深度求索',
    icon: 'deepseek',
    enabled: false,
    apiKey: '',
    apiUrl: 'https://api.deepseek.com/v1/',
    models: [
      {
        id: 'deepseek-r1',
        name: 'deepseek-ai/DeepSeek-R1',
        displayName: 'DeepSeek-R1',
        status: 'available',
        supportStream: true,
      },
      {
        id: 'deepseek-v3',
        name: 'deepseek-ai/DeepSeek-V3',
        displayName: 'DeepSeek-V3',
        status: 'available',
        supportStream: true,
      },
    ],
  },
  {
    id: 'ollama',
    name: 'Ollama',
    icon: 'ollama',
    enabled: false,
    apiKey: '',
    apiUrl: 'http://localhost:11434/v1/',
    models: [],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: 'anthropic',
    enabled: false,
    apiKey: '',
    apiUrl: 'https://api.anthropic.com/v1/',
    models: [],
  },
  {
    id: 'aionly',
    name: '唯一—AI (AiOnly)',
    icon: 'aihubmix',
    enabled: false,
    apiKey: '',
    apiUrl: '',
    models: [],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    icon: 'openai',
    enabled: false,
    apiKey: '',
    apiUrl: 'https://api.openai.com/v1/',
    models: [],
  },
  {
    id: 'azure',
    name: 'Azure OpenAI',
    icon: 'azure',
    enabled: false,
    apiKey: '',
    apiUrl: '',
    models: [],
  },
  {
    id: 'ppio',
    name: 'PPIO 派欧云',
    icon: 'ppio',
    enabled: false,
    apiKey: '',
    apiUrl: '',
    models: [],
  },
  {
    id: 'burncloud',
    name: 'BurnCloud',
    icon: 'burncloud',
    enabled: false,
    apiKey: '',
    apiUrl: '',
    models: [],
  },
  {
    id: 'cephalon',
    name: 'Cephalon',
    icon: 'cephalon',
    enabled: false,
    apiKey: '',
    apiUrl: '',
    models: [],
  },
  {
    id: 'phb',
    name: 'PH8 大模型开放平台',
    icon: 'phb',
    enabled: false,
    apiKey: '',
    apiUrl: '',
    models: [],
  },
  {
    id: 'ai302',
    name: '302.AI',
    icon: 'ai302',
    enabled: false,
    apiKey: '',
    apiUrl: '',
    models: [],
  },
  {
    id: 'newapi',
    name: 'New API',
    icon: 'newapi',
    enabled: false,
    apiKey: '',
    apiUrl: '',
    models: [],
  },
  {
    id: 'lanketech',
    name: '蓝科技',
    icon: 'cherryin',
    enabled: false,
    apiKey: '',
    apiUrl: '',
    models: [],
  },
  {
    id: 'wuxin',
    name: '无问芯穹',
    icon: 'cherryin',
    enabled: false,
    apiKey: '',
    apiUrl: '',
    models: [],
  },
];

function ModelSettings(): React.ReactElement {
  const [providers, setProviders] = useState<ProviderConfig[]>(initialProviders);
  const [selectedProviderId, setSelectedProviderId] = useState<string>('modelscope');
  const [searchText, setSearchText] = useState('');
  const [testingApi, setTestingApi] = useState(false);
  const [addModelModalVisible, setAddModelModalVisible] = useState(false);
  const [manageModelsModalVisible, setManageModelsModalVisible] = useState(false);
  const [selectModelModalVisible, setSelectModelModalVisible] = useState(false);
  const [selectedTestModel, setSelectedTestModel] = useState<string>('');
  const [newModel, setNewModel] = useState<Partial<ModelInfo>>({
    name: '',
    displayName: '',
    status: 'available',
    supportStream: true,
  });

  const selectedProvider = providers.find((p) => p.id === selectedProviderId);

  // 过滤后的提供商列表
  const filteredProviders = providers.filter((provider) =>
    provider.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // 处理提供商启用/禁用
  const handleToggleProvider = (enabled: boolean) => {
    setProviders(
      providers.map((p) =>
        p.id === selectedProviderId ? { ...p, enabled } : p
      )
    );
    message.success(enabled ? '服务商已启用' : '服务商已禁用');
  };

  // 处理 API 密钥更新
  const handleApiKeyChange = (value: string) => {
    setProviders(
      providers.map((p) =>
        p.id === selectedProviderId ? { ...p, apiKey: value } : p
      )
    );
  };

  // 处理 API 地址更新
  const handleApiUrlChange = (value: string) => {
    setProviders(
      providers.map((p) =>
        p.id === selectedProviderId ? { ...p, apiUrl: value } : p
      )
    );
  };

  // 打开模型选择对话框
  const handleOpenTestDialog = () => {
    if (!selectedProvider?.apiKey) {
      message.warning('请先输入 API 密钥');
      return;
    }

    if (!selectedProvider?.apiUrl) {
      message.warning('请先输入 API 地址');
      return;
    }

    if (!selectedProvider.models || selectedProvider.models.length === 0) {
      message.warning('该服务商暂无可用模型');
      return;
    }

    // 默认选择第一个可用模型
    setSelectedTestModel(selectedProvider.models[0]?.id || '');
    setSelectModelModalVisible(true);
  };

  // 测试 API 连接
  const handleTestApi = async () => {
    if (!selectedTestModel) {
      message.warning('请选择要测试的模型');
      return;
    }

    const model = selectedProvider?.models.find(m => m.id === selectedTestModel);
    if (!model) {
      message.error('未找到选中的模型');
      return;
    }

    setSelectModelModalVisible(false);
    setTestingApi(true);

    const hideLoading = message.loading(
      `正在测试 ${model.displayName}...`,
      0
    );

    try {
      // 调用 API 检测函数
      const result = await testModelApiKey(
        selectedProvider!.apiUrl,
        selectedProvider!.apiKey,
        model.name
      );

      hideLoading();

      if (result.success) {
        Modal.success({
          title: '检测成功',
          content: (
            <div>
              <p>✅ API 密钥有效</p>
              <p>模型：{model.displayName}</p>
              {result.model && <p>响应模型：{result.model}</p>}
              {result.usage && (
                <p style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: '12px' }}>
                  消耗 tokens: {result.usage.total_tokens || 0}
                </p>
              )}
            </div>
          ),
        });
      } else {
        Modal.error({
          title: '检测失败',
          content: (
            <div>
              <p>❌ API 密钥检测失败</p>
              <p>模型：{model.displayName}</p>
              <p style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
                错误信息：{result.error || '未知错误'}
              </p>
            </div>
          ),
        });
      }
    } catch (error) {
      hideLoading();
      Modal.error({
        title: '检测失败',
        content: (
          <div>
            <p>❌ API 密钥检测失败</p>
            <p>模型：{model.displayName}</p>
            <p style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
              错误信息：{error instanceof Error ? error.message : '网络请求失败'}
            </p>
          </div>
        ),
      });
    } finally {
      setTestingApi(false);
    }
  };

  // API Key 检测函数
  const testModelApiKey = async (
    apiUrl: string,
    apiKey: string,
    modelName: string
  ): Promise<{
    success: boolean;
    error?: string;
    model?: string;
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
      total_tokens?: number;
    };
  }> => {
    try {
      // 标准化 API URL
      let baseUrl = apiUrl.trim();

      // 处理 URL 结尾
      if (baseUrl.endsWith('#')) {
        // 强制使用 v1
        baseUrl = baseUrl.slice(0, -1);
        if (!baseUrl.endsWith('/v1')) {
          baseUrl = baseUrl.replace(/\/$/, '') + '/v1';
        }
      } else if (baseUrl.endsWith('/')) {
        // 避免 v1 版本
        baseUrl = baseUrl.slice(0, -1);
      }

      // 确保有 /chat/completions 端点
      const endpoint = baseUrl.endsWith('/chat/completions')
        ? baseUrl
        : `${baseUrl}/chat/completions`;

      // 构造测试请求
      const requestBody = {
        model: modelName,
        messages: [
          {
            role: 'user',
            content: 'Hello, this is a test message to verify the API key.',
          },
        ],
        max_tokens: 10,
        temperature: 0.1,
      };

      // 发送请求
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        // 处理错误响应
        let errorMessage = '请求失败';

        if (data.error) {
          if (typeof data.error === 'string') {
            errorMessage = data.error;
          } else if (data.error.message) {
            errorMessage = data.error.message;
          }
        } else if (data.message) {
          errorMessage = data.message;
        }

        // 根据状态码提供更友好的错误信息
        if (response.status === 401) {
          errorMessage = 'API 密钥无效或已过期';
        } else if (response.status === 403) {
          errorMessage = '无权访问该模型或 API';
        } else if (response.status === 404) {
          errorMessage = '模型不存在或 API 地址错误';
        } else if (response.status === 429) {
          errorMessage = '请求过于频繁，请稍后再试';
        } else if (response.status === 500) {
          errorMessage = '服务器内部错误';
        }

        return {
          success: false,
          error: errorMessage,
        };
      }

      // 成功响应
      return {
        success: true,
        model: data.model,
        usage: data.usage,
      };
    } catch (error) {
      // 网络错误或其他异常
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: '网络连接失败，请检查 API 地址是否正确',
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
      };
    }
  };

  // 复制 API 地址
  const handleCopyApiUrl = () => {
    if (selectedProvider?.apiUrl) {
      navigator.clipboard.writeText(selectedProvider.apiUrl);
      message.success('API 地址已复制到剪贴板');
    }
  };

  // 打开管理模型对话框
  const handleManageModels = () => {
    setManageModelsModalVisible(true);
  };

  // 添加新模型
  const handleAddModel = () => {
    if (!newModel.name || !newModel.displayName) {
      message.warning('请填写模型完整信息');
      return;
    }

    const updatedProviders = providers.map((p) => {
      if (p.id === selectedProviderId) {
        return {
          ...p,
          models: [
            ...p.models,
            {
              id: newModel.name?.toLowerCase().replace(/\//g, '-') || '',
              name: newModel.name || '',
              displayName: newModel.displayName || '',
              status: newModel.status || 'available',
              supportStream: newModel.supportStream,
              isCustom: true,
            } as ModelInfo,
          ],
        };
      }
      return p;
    });

    setProviders(updatedProviders);
    setAddModelModalVisible(false);
    setNewModel({
      name: '',
      displayName: '',
      status: 'available',
      supportStream: true,
    });
    message.success('模型添加成功');
  };

  // 删除模型
  const handleDeleteModel = (modelId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个模型吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const updatedProviders = providers.map((p) => {
          if (p.id === selectedProviderId) {
            return {
              ...p,
              models: p.models.filter((m) => m.id !== modelId),
            };
          }
          return p;
        });
        setProviders(updatedProviders);
        message.success('模型已删除');
      },
    });
  };

  // 查看未启用密钥的提示
  const handleViewKeyHint = () => {
    message.info('点击这里获取密钥');
  };

  return (
    <div className="settings-content-section">
      <div className="model-settings-layout">
        {/* 左侧提供商列表 */}
        <div className="model-providers-sidebar">
          <Title level={5} className="providers-title">
            模型服务商
          </Title>

          {/* 搜索框 */}
          <div className="provider-search">
            <Input
              placeholder="搜索模型 ID 或名称"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </div>

          {/* 提供商列表 */}
          <div className="providers-list">
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className={`provider-item ${
                  selectedProviderId === provider.id ? 'active' : ''
                }`}
                onClick={() => setSelectedProviderId(provider.id)}
              >
                <div className={`provider-icon ${provider.icon}`}>
                  <ApiOutlined />
                </div>
                <div className="provider-info">
                  <Text className="provider-name">{provider.name}</Text>
                </div>
                <div className="provider-status">
                  <div
                    className={`status-indicator ${
                      provider.enabled ? 'on' : 'off'
                    }`}
                  />
                  <Text className={`status-text ${provider.enabled ? 'on' : 'off'}`}>
                    {provider.enabled ? 'ON' : ''}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧配置区域 */}
        <div className="model-config-area">
          {selectedProvider ? (
            <>
              {/* 配置头部 */}
              <div className="config-header">
                <div className="config-title">
                  <div className={`provider-icon ${selectedProvider.icon}`}>
                    <ApiOutlined />
                  </div>
                  <div>
                    <Title level={4} className="config-title-text">
                      {selectedProvider.name}
                    </Title>
                    {selectedProvider.description && (
                      <Text className="config-subtitle">
                        {selectedProvider.description}
                      </Text>
                    )}
                  </div>
                </div>
                <Switch
                  checked={selectedProvider.enabled}
                  onChange={handleToggleProvider}
                  checkedChildren="启用"
                  unCheckedChildren="禁用"
                />
              </div>

              {/* 配置表单 */}
              <div className="config-form">
                {/* API 密钥配置 */}
                <div className="config-section">
                  <Title level={5} className="section-title">
                    <KeyOutlined /> API 密钥
                  </Title>
                  <div className="form-item">
                    <Text className="form-label">API 密钥</Text>
                    <Space.Compact style={{ width: '100%' }}>
                      <Password
                        className="form-input"
                        placeholder="请输入 API 密钥"
                        value={selectedProvider.apiKey}
                        onChange={(e) => handleApiKeyChange(e.target.value)}
                        iconRender={(visible) =>
                          visible ? <EyeOutlined /> : <EyeOutlined />
                        }
                      />
                      <Button
                        className="test-btn"
                        onClick={handleOpenTestDialog}
                        loading={testingApi}
                        icon={<CheckCircleOutlined />}
                      >
                        检测
                      </Button>
                    </Space.Compact>
                    {!selectedProvider.apiKey && (
                      <Text
                        style={{
                          color: '#38b2ac',
                          fontSize: '0.8rem',
                          marginTop: '0.5rem',
                          display: 'block',
                          cursor: 'pointer',
                        }}
                        onClick={handleViewKeyHint}
                      >
                        点击这里获取密钥
                      </Text>
                    )}
                  </div>
                </div>

                {/* API 地址配置 */}
                <div className="config-section">
                  <Title level={5} className="section-title">
                    <LinkOutlined /> API 地址
                  </Title>
                  <div className="form-item">
                    <Text className="form-label">API 地址</Text>
                    <Space.Compact style={{ width: '100%' }}>
                      <Input
                        className="form-input"
                        placeholder="请输入 API 地址"
                        value={selectedProvider.apiUrl}
                        onChange={(e) => handleApiUrlChange(e.target.value)}
                      />
                      <Tooltip title="复制 API 地址">
                        <Button
                          className="test-btn"
                          icon={<CopyOutlined />}
                          onClick={handleCopyApiUrl}
                        />
                      </Tooltip>
                    </Space.Compact>
                    <Text
                      style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '0.75rem',
                        marginTop: '0.5rem',
                        display: 'block',
                      }}
                    >
                      / 结尾避免 v1 版本，# 结尾强制使用 v1 版本
                    </Text>
                  </div>
                </div>

                {/* 模型列表 */}
                <div className="config-section">
                  <Title level={5} className="section-title">
                    <DatabaseOutlined /> 模型 ({selectedProvider.models.length})
                  </Title>
                  {selectedProvider.models.length > 0 ? (
                    <div className="models-grid">
                      {selectedProvider.models.map((model) => (
                        <div key={model.id} className="model-item">
                          <div className="model-name">
                            <RobotOutlined
                              style={{
                                color: '#38b2ac',
                                fontSize: '0.9rem',
                              }}
                            />
                            {model.displayName}
                          </div>
                          <div className="model-status">
                            <div
                              className={`status-indicator ${
                                model.status === 'available' ? 'on' : 'off'
                              }`}
                            />
                            <Text
                              className={`status-text ${
                                model.status === 'available' ? 'on' : 'off'
                              }`}
                            >
                              {model.status === 'available'
                                ? '可用'
                                : '不可用'}
                            </Text>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Text
                      style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        display: 'block',
                        textAlign: 'center',
                        padding: '2rem',
                      }}
                    >
                      暂无可用模型
                    </Text>
                  )}
                </div>

                {/* 操作按钮 */}
                <div className="config-actions">
                  <Button
                    className="action-btn manage-btn"
                    icon={<SettingOutlined />}
                    onClick={handleManageModels}
                  >
                    管理
                  </Button>
                  <Button
                    className="action-btn add-btn"
                    icon={<PlusOutlined />}
                    onClick={() => setAddModelModalVisible(true)}
                  >
                    添加
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <Text>请选择一个模型服务商</Text>
            </div>
          )}
        </div>
      </div>

      {/* 选择测试模型对话框 */}
      <Modal
        title="选择测试模型"
        open={selectModelModalVisible}
        onOk={handleTestApi}
        onCancel={() => setSelectModelModalVisible(false)}
        okText="开始检测"
        cancelText="取消"
        width={500}
        styles={{
          mask: { backdropFilter: 'blur(8px)' },
        }}
      >
        <div style={{ marginTop: '1rem' }}>
          <Text
            style={{
              display: 'block',
              marginBottom: '1rem',
              color: 'rgba(0, 0, 0, 0.65)',
            }}
          >
            请选择一个模型来测试 API 密钥是否有效。测试将发送一条简单的消息。
          </Text>
          <div>
            <Text style={{ display: 'block', marginBottom: '0.5rem' }}>
              选择模型
            </Text>
            <Select
              value={selectedTestModel}
              onChange={(value) => setSelectedTestModel(value)}
              style={{ width: '100%' }}
              placeholder="请选择模型"
            >
              {selectedProvider?.models.map((model) => (
                <Option key={model.id} value={model.id}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{model.displayName}</span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'rgba(0, 0, 0, 0.45)',
                      }}
                    >
                      {model.status === 'available' ? '可用' : '不可用'}
                    </span>
                  </div>
                </Option>
              ))}
            </Select>
          </div>
          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: 'rgba(24, 144, 255, 0.05)',
              border: '1px solid rgba(24, 144, 255, 0.2)',
              borderRadius: '6px',
            }}
          >
            <Text style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.65)' }}>
              💡 提示：测试将消耗少量 tokens（约 10-20 tokens）
            </Text>
          </div>
        </div>
      </Modal>

      {/* 添加模型对话框 */}
      <Modal
        title="添加模型"
        open={addModelModalVisible}
        onOk={handleAddModel}
        onCancel={() => {
          setAddModelModalVisible(false);
          setNewModel({
            name: '',
            displayName: '',
            status: 'available',
            supportStream: true,
          });
        }}
        okText="添加"
        cancelText="取消"
        width={500}
        styles={{
          mask: { backdropFilter: 'blur(8px)' },
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: '1rem' }}>
          <div>
            <Text style={{ display: 'block', marginBottom: '0.5rem' }}>
              模型 ID
            </Text>
            <Input
              placeholder="例如: gpt-4"
              value={newModel.name}
              onChange={(e) =>
                setNewModel({ ...newModel, name: e.target.value })
              }
            />
          </div>
          <div>
            <Text style={{ display: 'block', marginBottom: '0.5rem' }}>
              显示名称
            </Text>
            <Input
              placeholder="例如: GPT-4"
              value={newModel.displayName}
              onChange={(e) =>
                setNewModel({ ...newModel, displayName: e.target.value })
              }
            />
          </div>
          <div>
            <Text style={{ display: 'block', marginBottom: '0.5rem' }}>
              状态
            </Text>
            <Select
              value={newModel.status}
              onChange={(value) =>
                setNewModel({ ...newModel, status: value })
              }
              style={{ width: '100%' }}
            >
              <Option value="available">可用</Option>
              <Option value="unavailable">不可用</Option>
            </Select>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text>支持流式输出</Text>
            <Switch
              checked={newModel.supportStream}
              onChange={(checked) =>
                setNewModel({ ...newModel, supportStream: checked })
              }
            />
          </div>
        </Space>
      </Modal>

      {/* 管理模型对话框 */}
      <Modal
        title={`管理模型 - ${selectedProvider?.name}`}
        open={manageModelsModalVisible}
        onCancel={() => setManageModelsModalVisible(false)}
        footer={null}
        width={700}
        styles={{
          mask: { backdropFilter: 'blur(8px)' },
        }}
      >
        <div style={{ marginTop: '1rem' }}>
          {selectedProvider && selectedProvider.models.length > 0 ? (
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {selectedProvider.models.map((model) => (
                <div
                  key={model.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: 'rgba(26, 26, 46, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: '#ffffff',
                        fontWeight: 500,
                        display: 'block',
                      }}
                    >
                      {model.displayName}
                    </Text>
                    <Text
                      style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '0.8rem',
                      }}
                    >
                      {model.name}
                    </Text>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    <div className="model-status">
                      <div
                        className={`status-indicator ${
                          model.status === 'available' ? 'on' : 'off'
                        }`}
                      />
                      <Text
                        className={`status-text ${
                          model.status === 'available' ? 'on' : 'off'
                        }`}
                      >
                        {model.status === 'available' ? '可用' : '不可用'}
                      </Text>
                    </div>
                    {model.isCustom && (
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteModel(model.id)}
                      >
                        删除
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </Space>
          ) : (
            <Text style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              暂无可用模型
            </Text>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default ModelSettings;
