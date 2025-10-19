import { useState, useCallback, useMemo, useEffect } from 'react';
import { MessageInstance } from 'antd/es/message/interface';
import { ProviderConfig, ModelInfo } from '../types';
import { initialProviders } from '../constants';
import { usePartialUpdate } from '../../../../../hooks/UseSettingsStorage';
import {DEFAULT_APP_CONFIG} from "../../../models/DefaultAppConfig";

interface UseProvidersProps {
  message: MessageInstance;
}

// 将 ModelSettings 的 ProviderConfig 转换为 storage 的格式
const convertToStorageFormat = (providers: ProviderConfig[]) => {
  const providersRecord: Record<string, any> = {};
  providers.forEach((p) => {
    providersRecord[p.id] = {
      id: p.id,
      name: p.name,
      type: 'custom',
      apiKey: p.apiKey,
      apiUrl: p.apiUrl,
      enabled: p.enabled,
      models: p.models.map((m) => m.name),
    };
  });
  return providersRecord;
};

export const useProviders = ({ message }: UseProvidersProps) => {
  const [settings, updateSettings, loading] = usePartialUpdate(
    'models',
    DEFAULT_APP_CONFIG.models
  );
  
  const [providers, setProviders] = useState<ProviderConfig[]>(initialProviders);
  const [selectedProviderId, setSelectedProviderId] = useState<string>('modelscope');

  // 从持久化存储初始化 providers
  useEffect(() => {
    if (!loading && Object.keys(settings.providers).length > 0) {
      // 如果存储中有数据，使用存储的数据
      // 这里可以根据需要合并 initialProviders 和存储的数据
      const storedProviders = Object.values(settings.providers);
      if (storedProviders.length > 0) {
        // 简单起见，我们暂时使用 initialProviders
        // 实际项目中需要做更复杂的合并逻辑
      }
    }
  }, [loading, settings.providers]);

  // 获取选中的提供商
  const selectedProvider = useMemo(
    () => providers.find((p) => p.id === selectedProviderId),
    [providers, selectedProviderId]
  );

  // 启用/禁用提供商
  const toggleProvider = useCallback(async (providerId: string, enabled: boolean) => {
    const newProviders = providers.map((p) => (p.id === providerId ? { ...p, enabled } : p));
    setProviders(newProviders);
    await updateSettings({ providers: convertToStorageFormat(newProviders) });
    message.success(enabled ? '服务商已启用' : '服务商已禁用');
  }, [message, providers, updateSettings]);

  // 更新 API 密钥
  const updateApiKey = useCallback(async (providerId: string, apiKey: string) => {
    const newProviders = providers.map((p) => (p.id === providerId ? { ...p, apiKey } : p));
    setProviders(newProviders);
    await updateSettings({ providers: convertToStorageFormat(newProviders) });
  }, [providers, updateSettings]);

  // 更新 API 地址
  const updateApiUrl = useCallback(async (providerId: string, apiUrl: string) => {
    const newProviders = providers.map((p) => (p.id === providerId ? { ...p, apiUrl } : p));
    setProviders(newProviders);
    await updateSettings({ providers: convertToStorageFormat(newProviders) });
  }, [providers, updateSettings]);

  // 添加模型
  const addModel = useCallback(async (providerId: string, model: Partial<ModelInfo>) => {
    if (!model.name || !model.displayName) {
      message.warning('请填写模型完整信息');
      return false;
    }

    const newProviders = providers.map((p) => {
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
    });
    
    setProviders(newProviders);
    await updateSettings({ providers: convertToStorageFormat(newProviders) });
    message.success('模型添加成功');
    return true;
  }, [message, providers, updateSettings]);

  // 删除模型
  const deleteModel = useCallback(async (providerId: string, modelId: string) => {
    const newProviders = providers.map((p) => {
      if (p.id === providerId) {
        return {
          ...p,
          models: p.models.filter((m) => m.id !== modelId),
        };
      }
      return p;
    });
    
    setProviders(newProviders);
    await updateSettings({ providers: convertToStorageFormat(newProviders) });
    message.success('模型已删除');
  }, [message, providers, updateSettings]);

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
    loading,
  };
};

