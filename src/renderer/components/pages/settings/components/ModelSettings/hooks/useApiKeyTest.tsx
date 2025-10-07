import { useState, useCallback } from 'react';
import { Modal } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { ModelInfo } from '../types';
import { testModelApiKey } from '../services/apiKeyService';

interface UseApiKeyTestProps {
  message: MessageInstance;
}

interface UseApiKeyTestReturn {
  testingApi: boolean;
  selectedTestModel: string;
  setSelectedTestModel: (modelId: string) => void;
  executeTest: (apiUrl: string, apiKey: string, model: ModelInfo) => Promise<void>;
}

export const useApiKeyTest = ({ message }: UseApiKeyTestProps): UseApiKeyTestReturn => {
  const [testingApi, setTestingApi] = useState(false);
  const [selectedTestModel, setSelectedTestModel] = useState<string>('');

  // 执行 API 测试
  const executeTest = useCallback(
    async (apiUrl: string, apiKey: string, model: ModelInfo) => {
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
    },
    [message]
  );

  return {
    testingApi,
    selectedTestModel,
    setSelectedTestModel,
    executeTest,
  };
};

