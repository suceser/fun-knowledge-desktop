import { useState } from 'react';
import { message, Modal } from 'antd';
import { testModelApiKey } from '../services/apiKeyService';

interface Model {
  id: string;
  name: string;
  displayName: string;
}

interface UseApiKeyTestReturn {
  testingApi: boolean;
  selectModelModalVisible: boolean;
  selectedTestModel: string;
  setSelectedTestModel: (model: string) => void;
  setSelectModelModalVisible: (visible: boolean) => void;
  openTestDialog: (hasApiKey: boolean, hasApiUrl: boolean, models: Model[]) => void;
  executeTest: (apiUrl: string, apiKey: string, models: Model[]) => Promise<void>;
}

export function useApiKeyTest(): UseApiKeyTestReturn {
  const [testingApi, setTestingApi] = useState(false);
  const [selectModelModalVisible, setSelectModelModalVisible] = useState(false);
  const [selectedTestModel, setSelectedTestModel] = useState<string>('');

  // 打开模型选择对话框
  const openTestDialog = (
    hasApiKey: boolean,
    hasApiUrl: boolean,
    models: Model[]
  ) => {
    if (!hasApiKey) {
      message.warning('请先输入 API 密钥');
      return;
    }

    if (!hasApiUrl) {
      message.warning('请先输入 API 地址');
      return;
    }

    if (!models || models.length === 0) {
      message.warning('该服务商暂无可用模型');
      return;
    }

    // 默认选择第一个可用模型
    setSelectedTestModel(models[0]?.id || '');
    setSelectModelModalVisible(true);
  };

  // 执行测试
  const executeTest = async (
    apiUrl: string,
    apiKey: string,
    models: Model[]
  ) => {
    if (!selectedTestModel) {
      message.warning('请选择要测试的模型');
      return;
    }

    const model = models.find((m) => m.id === selectedTestModel);
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
      const result = await testModelApiKey(apiUrl, apiKey, model.name);

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

  return {
    testingApi,
    selectModelModalVisible,
    selectedTestModel,
    setSelectedTestModel,
    setSelectModelModalVisible,
    openTestDialog,
    executeTest,
  };
}

