/**
 * 获取模型配置的 Hook
 */

import { useEffect, useState } from 'react';
import { storageService } from 'rservices/storage/StorageService';
import { DEFAULT_APP_CONFIG } from 'components/settings/models/DefaultAppConfig';
import { ModelSettings } from 'components/settings/models/ModelSettings';

export interface ModelConfig {
  providerId: string;
  providerName: string;
  apiKey: string;
  apiUrl: string;
  modelName: string;
  modelDisplayName: string;
}

/**
 * 获取第一个启用的模型配置
 */
export function useModelConfig() {
  const [modelConfig, setModelConfig] = useState<ModelConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModelConfig = async () => {
      try {
        setLoading(true);
        setError(null);

        // 获取模型设置
        const modelSettings = await storageService.get<ModelSettings>('models');
        const settings: ModelSettings = modelSettings || DEFAULT_APP_CONFIG.models;

        // 查找第一个已启用且配置完整的provider
        const providers = Object.values(settings.providers || {});
        
        for (const provider of providers) {
          if (
            provider.enabled &&
            provider.apiKey &&
            provider.apiUrl &&
            provider.models &&
            provider.models.length > 0
          ) {
            // 使用该provider的第一个模型
            const modelName = provider.models[0];
            
            setModelConfig({
              providerId: provider.id,
              providerName: provider.name,
              apiKey: provider.apiKey,
              apiUrl: provider.apiUrl,
              modelName: modelName,
              modelDisplayName: modelName,
            });
            setLoading(false);
            return;
          }
        }

        // 如果没有找到已启用的provider，设置错误
        setError('未找到已启用的模型。请在设置中配置并启用至少一个模型。');
        setModelConfig(null);
      } catch (err) {
        console.error('Failed to load models config:', err);
        setError('加载模型配置失败');
        setModelConfig(null);
      } finally {
        setLoading(false);
      }
    };

    loadModelConfig();
  }, []);

  return { modelConfig, loading, error };
}

/**
 * 获取所有已启用的模型配置
 */
export function useAllModelConfigs() {
  const [modelConfigs, setModelConfigs] = useState<ModelConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModelConfigs = async () => {
      try {
        setLoading(true);
        setError(null);

        // 获取模型设置
        const modelSettings = await storageService.get<ModelSettings>('models');
        const settings: ModelSettings = modelSettings || DEFAULT_APP_CONFIG.models;

        // 获取所有已启用的providers
        const providers = Object.values(settings.providers || {});
        const configs: ModelConfig[] = [];

        for (const provider of providers) {
          if (
            provider.enabled &&
            provider.apiKey &&
            provider.apiUrl &&
            provider.models &&
            provider.models.length > 0
          ) {
            // 为每个模型创建一个配置
            for (const modelName of provider.models) {
              configs.push({
                providerId: provider.id,
                providerName: provider.name,
                apiKey: provider.apiKey,
                apiUrl: provider.apiUrl,
                modelName: modelName,
                modelDisplayName: modelName,
              });
            }
          }
        }

        setModelConfigs(configs);
        
        if (configs.length === 0) {
          setError('未找到已启用的模型。请在设置中配置并启用至少一个模型。');
        }
      } catch (err) {
        console.error('Failed to load models configs:', err);
        setError('加载模型配置失败');
      } finally {
        setLoading(false);
      }
    };

    loadModelConfigs();
  }, []);

  return { modelConfigs, loading, error };
}

