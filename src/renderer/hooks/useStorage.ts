/**
 * 存储相关的 React Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { AppConfig } from '../../main/types/storage';

/**
 * 使用存储值的 Hook
 * @param key 配置键
 * @param defaultValue 默认值
 * @returns [value, setValue, loading, error]
 */
export function useStorageValue<T>(
  key: string,
  defaultValue?: T
): [T | undefined, (value: T) => Promise<void>, boolean, string | undefined] {
  const [value, setValue] = useState<T | undefined>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const loadValue = async () => {
      try {
        setLoading(true);
        const result = await storageService.get<T>(key);
        if (result !== undefined) {
          setValue(result);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [key]);

  const updateValue = useCallback(
    async (newValue: T) => {
      try {
        const success = await storageService.set(key, newValue);
        if (success) {
          setValue(newValue);
          setError(undefined);
        } else {
          setError('Failed to update value');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    },
    [key]
  );

  return [value, updateValue, loading, error];
}

/**
 * 使用所有配置的 Hook
 * @returns [config, updateConfig, loading, error]
 */
export function useAllConfig(): [
  AppConfig | undefined,
  (config: Partial<AppConfig>) => Promise<void>,
  boolean,
  string | undefined
] {
  const [config, setConfig] = useState<AppConfig | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const result = await storageService.getAll();
        if (result) {
          setConfig(result);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const updateConfig = useCallback(async (newConfig: Partial<AppConfig>) => {
    try {
      const success = await storageService.setMultiple(newConfig);
      if (success) {
        setConfig(prev => (prev ? { ...prev, ...newConfig } : undefined));
        setError(undefined);
      } else {
        setError('Failed to update config');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  return [config, updateConfig, loading, error];
}

/**
 * 使用通用设置的 Hook
 */
export function useGeneralSettings() {
  return useStorageValue<AppConfig['general']>('general');
}

/**
 * 使用显示设置的 Hook
 */
export function useDisplaySettings() {
  return useStorageValue<AppConfig['display']>('display');
}

/**
 * 使用模型设置的 Hook
 */
export function useModelSettings() {
  return useStorageValue<AppConfig['models']>('models');
}

/**
 * 使用搜索设置的 Hook
 */
export function useSearchSettings() {
  return useStorageValue<AppConfig['search']>('search');
}

/**
 * 使用快捷键设置的 Hook
 */
export function useShortcutSettings() {
  return useStorageValue<AppConfig['shortcuts']>('shortcuts');
}

/**
 * 使用文档设置的 Hook
 */
export function useDocumentSettings() {
  return useStorageValue<AppConfig['document']>('document');
}

/**
 * 使用数据设置的 Hook
 */
export function useDataSettings() {
  return useStorageValue<AppConfig['data']>('data');
}

/**
 * 使用 MCP 设置的 Hook
 */
export function useMCPSettings() {
  return useStorageValue<AppConfig['mcp']>('mcp');
}

/**
 * 使用记忆设置的 Hook
 */
export function useMemorySettings() {
  return useStorageValue<AppConfig['memory']>('memory');
}

