import { useState } from 'react';

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

export function useProviders(initialProviders: ProviderConfig[]) {
  const [providers, setProviders] = useState<ProviderConfig[]>(initialProviders);
  const [selectedProviderId, setSelectedProviderId] = useState<string>('modelscope');

  const selectedProvider = providers.find((p) => p.id === selectedProviderId);

  // 更新提供商启用状态
  const toggleProvider = (enabled: boolean) => {
    setProviders(
      providers.map((p) =>
        p.id === selectedProviderId ? { ...p, enabled } : p
      )
    );
  };

  // 更新 API Key
  const updateApiKey = (apiKey: string) => {
    setProviders(
      providers.map((p) =>
        p.id === selectedProviderId ? { ...p, apiKey } : p
      )
    );
  };

  // 更新 API URL
  const updateApiUrl = (apiUrl: string) => {
    setProviders(
      providers.map((p) =>
        p.id === selectedProviderId ? { ...p, apiUrl } : p
      )
    );
  };

  // 添加模型
  const addModel = (model: ModelInfo) => {
    setProviders(
      providers.map((p) => {
        if (p.id === selectedProviderId) {
          return {
            ...p,
            models: [...p.models, model],
          };
        }
        return p;
      })
    );
  };

  // 删除模型
  const deleteModel = (modelId: string) => {
    setProviders(
      providers.map((p) => {
        if (p.id === selectedProviderId) {
          return {
            ...p,
            models: p.models.filter((m) => m.id !== modelId),
          };
        }
        return p;
      })
    );
  };

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
}

