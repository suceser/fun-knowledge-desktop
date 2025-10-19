import { useState, useCallback } from 'react';
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

      try {
        const result = await testModelApiKey(apiUrl, apiKey, model.name);

        if (result.success) {
          // 检测成功，显示全局提示
          message.success('模型服务连接成功');
        } else {
          // 检测失败，显示错误信息
          message.error(`检测失败：${result.error || '未知错误'}`);
        }
      } catch (error) {
        // 网络错误或其他异常
        message.error(`检测失败：${error instanceof Error ? error.message : '网络请求失败'}`);
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

