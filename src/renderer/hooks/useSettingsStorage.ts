/**
 * 设置页面专用的 Storage Hooks
 * 
 * 这个文件提供了每个设置组件的专用 hook，
 * 封装了配置的读取、保存和默认值处理逻辑
 */

import { useCallback, useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import {
  GeneralSettings,
  DisplaySettings,
  SearchSettings,
  ShortcutSettings,
  ShortcutItem,
  DocumentSettings,
  DocumentItem,
  DataSettings,
  MCPSettings,
  MemorySettings,
  DEFAULT_APP_CONFIG,
} from '../../main/types/storage';

/**
 * 通用的设置 Hook 工厂函数
 */
function useSettingsField<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => Promise<void>, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  // 加载配置
  useEffect(() => {
    const loadValue = async () => {
      try {
        setLoading(true);
        const result = await storageService.get<T>(key);
        // 如果存储中有值，使用存储的值；否则使用默认值
        if (result !== undefined) {
          setValue(result);
        } else {
          setValue(defaultValue);
        }
      } catch (error) {
        console.error(`Failed to load ${key}:`, error);
        setValue(defaultValue);
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [key, defaultValue]);

  // 更新配置
  const updateValue = useCallback(
    async (newValue: T) => {
      try {
        const success = await storageService.set(key, newValue);
        if (success) {
          setValue(newValue);
        }
      } catch (error) {
        console.error(`Failed to update ${key}:`, error);
      }
    },
    [key]
  );

  return [value, updateValue, loading];
}

/**
 * 通用设置 Hook
 */
export function useGeneralSettingsStorage() {
  return useSettingsField<GeneralSettings>('general', DEFAULT_APP_CONFIG.general);
}

/**
 * 显示设置 Hook
 */
export function useDisplaySettingsStorage() {
  return useSettingsField<DisplaySettings>('display', DEFAULT_APP_CONFIG.display);
}

/**
 * 搜索设置 Hook
 */
export function useSearchSettingsStorage() {
  return useSettingsField<SearchSettings>('search', DEFAULT_APP_CONFIG.search);
}

/**
 * 快捷键设置 Hook
 */
export function useShortcutSettingsStorage() {
  return useSettingsField<ShortcutSettings>('shortcuts', DEFAULT_APP_CONFIG.shortcuts);
}

/**
 * 文档设置 Hook
 */
export function useDocumentSettingsStorage() {
  return useSettingsField<DocumentSettings>('document', DEFAULT_APP_CONFIG.document);
}

/**
 * 数据设置 Hook
 */
export function useDataSettingsStorage() {
  return useSettingsField<DataSettings>('data', DEFAULT_APP_CONFIG.data);
}

/**
 * MCP设置 Hook
 */
export function useMCPSettingsStorage() {
  return useSettingsField<MCPSettings>('mcp', DEFAULT_APP_CONFIG.mcp);
}

/**
 * 记忆设置 Hook
 */
export function useMemorySettingsStorage() {
  return useSettingsField<MemorySettings>('memory', DEFAULT_APP_CONFIG.memory);
}

/**
 * 单个配置字段的 Hook（支持嵌套路径）
 * 例如：useConfigField('general.language', 'zh-CN')
 */
export function useConfigField<T>(path: string, defaultValue: T): [T, (value: T) => Promise<void>, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  // 加载配置
  useEffect(() => {
    const loadValue = async () => {
      try {
        setLoading(true);
        const result = await storageService.get<T>(path);
        if (result !== undefined) {
          setValue(result);
        } else {
          setValue(defaultValue);
        }
      } catch (error) {
        console.error(`Failed to load ${path}:`, error);
        setValue(defaultValue);
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [path, defaultValue]);

  // 更新配置
  const updateValue = useCallback(
    async (newValue: T) => {
      try {
        const success = await storageService.set(path, newValue);
        if (success) {
          setValue(newValue);
        }
      } catch (error) {
        console.error(`Failed to update ${path}:`, error);
      }
    },
    [path]
  );

  return [value, updateValue, loading];
}

/**
 * 部分更新配置的 Hook
 * 用于只更新对象的某些字段而不覆盖整个对象
 */
export function usePartialUpdate<T extends object>(
  key: string,
  defaultValue: T
): [T, (partial: Partial<T>) => Promise<void>, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  // 加载配置
  useEffect(() => {
    const loadValue = async () => {
      try {
        setLoading(true);
        const result = await storageService.get<T>(key);
        if (result !== undefined) {
          setValue(result);
        } else {
          setValue(defaultValue);
        }
      } catch (error) {
        console.error(`Failed to load ${key}:`, error);
        setValue(defaultValue);
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [key, defaultValue]);

  // 部分更新配置
  const updatePartial = useCallback(
    async (partial: Partial<T>) => {
      try {
        const newValue = { ...value, ...partial };
        const success = await storageService.set(key, newValue);
        if (success) {
          setValue(newValue);
        }
      } catch (error) {
        console.error(`Failed to update ${key}:`, error);
      }
    },
    [key, value]
  );

  return [value, updatePartial, loading];
}

