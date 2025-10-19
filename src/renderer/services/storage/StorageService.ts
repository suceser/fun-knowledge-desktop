/**
 * 渲染进程存储服务
 * 封装与主进程的通信，提供简洁的 API
 */
import {AppConfig} from "../../components/settings/models/AppConfig";

class RendererStorageService {
  private cache: Map<string, unknown>;

  constructor() {
    this.cache = new Map();
  }

  /**
   * 获取配置值
   */
  async get<T = unknown>(key: string, useCache = true): Promise<T | undefined> {
    // 如果使用缓存且缓存中存在，直接返回
    if (useCache && this.cache.has(key)) {
      return this.cache.get(key) as T;
    }

    const result = await window.electronAPI.storage.get<T>(key);
    if (result.success && result.data !== undefined) {
      this.cache.set(key, result.data);
      return result.data;
    }
    
    return undefined;
  }

  /**
   * 设置配置值
   */
  async set<T = unknown>(key: string, value: T): Promise<boolean> {
    const result = await window.electronAPI.storage.set(key, value);
    if (result.success) {
      this.cache.set(key, value);
      return true;
    }
    console.error('Failed to set config:', result.error);
    return false;
  }

  /**
   * 删除配置项
   */
  async delete(key: string): Promise<boolean> {
    const result = await window.electronAPI.storage.delete(key);
    if (result.success) {
      this.cache.delete(key);
      return true;
    }
    console.error('Failed to delete config:', result.error);
    return false;
  }

  /**
   * 检查配置项是否存在
   */
  async has(key: string): Promise<boolean> {
    const result = await window.electronAPI.storage.has(key);
    return result.success && result.data === true;
  }

  /**
   * 清空所有配置
   */
  async clear(): Promise<boolean> {
    const result = await window.electronAPI.storage.clear();
    if (result.success) {
      this.cache.clear();
      return true;
    }
    console.error('Failed to clear config:', result.error);
    return false;
  }

  /**
   * 重置到默认配置
   */
  async reset(): Promise<boolean> {
    const result = await window.electronAPI.storage.reset();
    if (result.success) {
      this.cache.clear();
      return true;
    }
    console.error('Failed to reset config:', result.error);
    return false;
  }

  /**
   * 获取所有配置
   */
  async getAll(): Promise<AppConfig | undefined> {
    const result = await window.electronAPI.storage.getAll();
    if (result.success && result.data) {
      return result.data;
    }
    console.error('Failed to get all config:', result.error);
    return undefined;
  }

  /**
   * 设置多个配置项
   */
  async setMultiple(config: Partial<AppConfig>): Promise<boolean> {
    const result = await window.electronAPI.storage.setMultiple(config);
    if (result.success) {
      // 更新缓存
      Object.entries(config).forEach(([key, value]) => {
        this.cache.set(key, value);
      });
      return true;
    }
    console.error('Failed to set multiple config:', result.error);
    return false;
  }

  /**
   * 导出配置
   */
  async export(): Promise<string | undefined> {
    const result = await window.electronAPI.storage.export();
    if (result.success && result.data) {
      return result.data;
    }
    console.error('Failed to export config:', result.error);
    return undefined;
  }

  /**
   * 导入配置
   */
  async import(json: string): Promise<boolean> {
    const result = await window.electronAPI.storage.import(json);
    if (result.success) {
      this.cache.clear();
      return true;
    }
    console.error('Failed to import config:', result.error);
    return false;
  }

  /**
   * 获取存储文件路径
   */
  async getStorePath(): Promise<string | undefined> {
    const result = await window.electronAPI.storage.getStorePath();
    if (result.success && result.data) {
      return result.data;
    }
    console.error('Failed to get store path:', result.error);
    return undefined;
  }

  /**
   * 获取存储大小（字节）
   */
  async getStoreSize(): Promise<number | undefined> {
    const result = await window.electronAPI.storage.getStoreSize();
    if (result.success && result.data !== undefined) {
      return result.data;
    }
    console.error('Failed to get store size:', result.error);
    return undefined;
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 获取指定配置项的缓存
   */
  getCacheValue<T = unknown>(key: string): T | undefined {
    return this.cache.get(key) as T | undefined;
  }

  /**
   * 设置指定配置项的缓存
   */
  setCacheValue<T = unknown>(key: string, value: T): void {
    this.cache.set(key, value);
  }
}

// 导出单例
export const storageService = new RendererStorageService();

