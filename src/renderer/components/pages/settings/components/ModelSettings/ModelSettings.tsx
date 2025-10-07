import React, { useState } from 'react';
import { message, Modal, Button } from 'antd';
import { SettingOutlined, PlusOutlined } from '@ant-design/icons';

// 子组件
import ProviderList from './ProviderList';
import ApiKeySection from './ApiKeySection';
import ModelList from './ModelList';
import SelectModelModal from './modals/SelectModelModal';

// Hooks
import { useProviders } from './hooks/useProviders';
import { useApiKeyTest } from './hooks/useApiKeyTest';

// 常量
import { initialProviders } from './constants/providers';

// 样式
import './ModelSettings.css';

function ModelSettings(): React.ReactElement {
  // ====== 状态管理 ======
  const [searchText, setSearchText] = useState('');

  // 使用自定义 Hook 管理服务商
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
  } = useProviders(initialProviders);

  // 使用自定义 Hook 管理 API 测试
  const {
    testingApi,
    selectModelModalVisible,
    selectedTestModel,
    setSelectedTestModel,
    setSelectModelModalVisible,
    openTestDialog,
    executeTest,
  } = useApiKeyTest();

  // ====== 过滤逻辑 ======
  const filteredProviders = providers.filter((provider) =>
    provider.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // ====== 事件处理 ======
  const handleTestApiKey = () => {
    openTestDialog(
      !!selectedProvider?.apiKey,
      !!selectedProvider?.apiUrl,
      selectedProvider?.models || []
    );
  };

  const handleStartTest = () => {
    if (selectedProvider) {
      executeTest(
        selectedProvider.apiUrl,
        selectedProvider.apiKey,
        selectedProvider.models
      );
    }
  };

  const handleGetKeyHint = () => {
    message.info('点击这里获取密钥');
  };

  // ====== 渲染 ======
  return (
    <div className="settings-content-section">
      <div className="model-settings-layout">
        {/* 左侧：服务商列表 */}
        <ProviderList
          providers={filteredProviders}
          selectedProviderId={selectedProviderId}
          searchText={searchText}
          onSearchChange={setSearchText}
          onProviderSelect={setSelectedProviderId}
        />

        {/* 右侧：配置区域 */}
        <div className="model-config-area">
          {selectedProvider ? (
            <>
              {/* API 密钥配置 */}
              <ApiKeySection
                apiKey={selectedProvider.apiKey}
                testingApi={testingApi}
                onApiKeyChange={updateApiKey}
                onTest={handleTestApiKey}
                onGetKeyHint={handleGetKeyHint}
              />

              {/* 模型列表 */}
              <ModelList models={selectedProvider.models} />

              {/* 操作按钮 */}
              <div className="config-actions">
                <Button
                  className="action-btn manage-btn"
                  icon={<SettingOutlined />}
                >
                  管理
                </Button>
                <Button
                  className="action-btn add-btn"
                  icon={<PlusOutlined />}
                >
                  添加
                </Button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              请选择一个模型服务商
            </div>
          )}
        </div>
      </div>

      {/* 模型选择对话框 */}
      <SelectModelModal
        visible={selectModelModalVisible}
        models={selectedProvider?.models || []}
        selectedModel={selectedTestModel}
        onModelChange={setSelectedTestModel}
        onOk={handleStartTest}
        onCancel={() => setSelectModelModalVisible(false)}
      />
    </div>
  );
}

export default ModelSettings;

