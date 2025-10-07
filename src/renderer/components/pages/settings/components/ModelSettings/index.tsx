import React, { useState } from 'react';
import { message } from 'antd';
import { ModelInfo } from './types';
import { useProviders } from './hooks/useProviders';
import { useApiKeyTest } from './hooks/useApiKeyTest';
import { ProviderList } from './components/ProviderList';
import { ProviderConfigPanel } from './components/ProviderConfigPanel';
import { SelectModelModal } from './components/SelectModelModal';
import { AddModelModal } from './components/AddModelModal';
import { ManageModelsModal } from './components/ManageModelsModal';
import './styles/common.css';

/**
 * 模型设置主组件
 * 
 * 职责：
 * - 协调各个子组件
 * - 管理 Modal 显示状态
 * - 处理用户交互逻辑
 */
function ModelSettings(): React.ReactElement {
  // 使用自定义 hooks
  const {
    providers,
    selectedProviderId,
    selectedProvider,
    setSelectedProviderId,
    toggleProvider,
    updateApiKey,
    updateApiUrl,
    addModel,
    deleteModel,
  } = useProviders();

  const {
    testingApi,
    selectedTestModel,
    setSelectedTestModel,
    executeTest,
  } = useApiKeyTest();

  // UI 状态管理
  const [searchText, setSearchText] = useState('');
  const [selectModelModalVisible, setSelectModelModalVisible] = useState(false);
  const [addModelModalVisible, setAddModelModalVisible] = useState(false);
  const [manageModelsModalVisible, setManageModelsModalVisible] = useState(false);

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
    if (!selectedTestModel || !selectedProvider) {
      message.warning('请选择要测试的模型');
      return;
    }

    const model = selectedProvider.models.find((m) => m.id === selectedTestModel);
    if (!model) {
      message.error('未找到选中的模型');
      return;
    }

    setSelectModelModalVisible(false);
    await executeTest(selectedProvider.apiUrl, selectedProvider.apiKey, model);
  };

  // 添加模型
  const handleAddModel = (model: Partial<ModelInfo>) => {
    if (selectedProviderId) {
      const success = addModel(selectedProviderId, model);
      if (success) {
        setAddModelModalVisible(false);
      }
    }
  };

  // 删除模型
  const handleDeleteModel = (modelId: string) => {
    if (selectedProviderId) {
      deleteModel(selectedProviderId, modelId);
    }
  };

  // 查看未启用密钥的提示
  const handleViewKeyHint = () => {
    message.info('点击这里获取密钥');
  };

  return (
    <div className="settings-content-section">
      <div className="model-settings-layout">
        {/* 左侧提供商列表 */}
        <ProviderList
          providers={providers}
          selectedProviderId={selectedProviderId}
          searchText={searchText}
          onSearchChange={setSearchText}
          onProviderSelect={setSelectedProviderId}
        />

        {/* 右侧配置面板 */}
        <ProviderConfigPanel
          provider={selectedProvider}
          testingApi={testingApi}
          onToggle={(enabled) => toggleProvider(selectedProviderId, enabled)}
          onApiKeyChange={(value) => updateApiKey(selectedProviderId, value)}
          onApiUrlChange={(value) => updateApiUrl(selectedProviderId, value)}
          onTest={handleOpenTestDialog}
          onManageModels={() => setManageModelsModalVisible(true)}
          onAddModel={() => setAddModelModalVisible(true)}
          onViewKeyHint={handleViewKeyHint}
        />
      </div>

      {/* 选择测试模型对话框 */}
      <SelectModelModal
        visible={selectModelModalVisible}
        models={selectedProvider?.models || []}
        selectedModelId={selectedTestModel}
        onSelect={setSelectedTestModel}
        onConfirm={handleTestApi}
        onCancel={() => setSelectModelModalVisible(false)}
      />

      {/* 添加模型对话框 */}
      <AddModelModal
        visible={addModelModalVisible}
        onConfirm={handleAddModel}
        onCancel={() => setAddModelModalVisible(false)}
      />

      {/* 管理模型对话框 */}
      <ManageModelsModal
        visible={manageModelsModalVisible}
        provider={selectedProvider}
        onDelete={handleDeleteModel}
        onCancel={() => setManageModelsModalVisible(false)}
      />
    </div>
  );
}

export default ModelSettings;

