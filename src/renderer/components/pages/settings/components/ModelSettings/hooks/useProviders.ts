import { useState, useCallback, useMemo } from 'react';
import { message } from 'antd';
import { ProviderConfig, ModelInfo } from '../types';
import { initialProviders } from '../constants';

export const useProviders = () => {
  const [providers, setProviders] = useState<ProviderConfig[]>(initialProviders);
  const [selectedProviderId, setSelectedProviderId] = useState<string>('modelscope');

  // 获取选中的提供商
  const selectedProvider = useMemo(
    () => providers.find((p) => p.id === selectedProviderId),
    [providers, selectedProviderId]
  );

  // 启用/禁用提供商
  const toggleProvider = useCallback((providerId: string, enabled: boolean) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, enabled } : p))
    );
    message.success(enabled ? '服务商已启用' : '服务商已禁用');
  }, []);

  // 更新 API 密钥
  const updateApiKey = useCallback((providerId: string, apiKey: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, apiKey } : p))
    );
  }, []);

  // 更新 API 地址
  const updateApiUrl = useCallback((providerId: string, apiUrl: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, apiUrl } : p))
    );
  }, []);

  // 添加模型
  const addModel = useCallback((providerId: string, model: Partial<ModelInfo>) => {
    if (!model.name || !model.displayName) {
      message.warning('请填写模型完整信息');
      return false;
    }

    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === providerId) {
          return {
            ...p,
            models: [
              ...p.models,
              {
                id: model.name?.toLowerCase().replace(/\//g, '-') || '',
                name: model.name || '',
                displayName: model.displayName || '',
                status: model.status || 'available',
                supportStream: model.supportStream,
                isCustom: true,
              } as ModelInfo,
            ],
          };
        }
        return p;
      })
    );
    message.success('模型添加成功');
    return true;
  }, []);

  // 删除模型
  const deleteModel = useCallback((providerId: string, modelId: string) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === providerId) {
          return {
            ...p,
            models: p.models.filter((m) => m.id !== modelId),
          };
        }
        return p;
      })
    );
    message.success('模型已删除');
  }, []);

  return {
    providers,
    selectedProviderId,
    selectedProvider,
    setSelectedProviderId,
    toggleProvider,
    updateApiKey,
    updateApiUrl,
    addModel,
    deleteModel,
  };
};

