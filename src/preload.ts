/**
 * Preload 脚本
 * 在渲染进程中暴露安全的 IPC 通信接口
 */

import { contextBridge, ipcRenderer } from 'electron';
import {StorageResult} from "./main/services/storage/models/StorageResult";
import {AppConfig} from "./renderer/components/settings/models/AppConfig";

// 暴露存储 API 到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  storage: {
    // 获取配置值
    get: <T = unknown>(key: string): Promise<StorageResult<T>> => 
      ipcRenderer.invoke('storage:get', key),
    
    // 设置配置值
    set: <T = unknown>(key: string, value: T): Promise<StorageResult<void>> => 
      ipcRenderer.invoke('storage:set', key, value),
    
    // 删除配置项
    delete: (key: string): Promise<StorageResult<void>> => 
      ipcRenderer.invoke('storage:delete', key),
    
    // 检查配置项是否存在
    has: (key: string): Promise<StorageResult<boolean>> => 
      ipcRenderer.invoke('storage:has', key),
    
    // 清空所有配置
    clear: (): Promise<StorageResult<void>> => 
      ipcRenderer.invoke('storage:clear'),
    
    // 重置到默认配置
    reset: (): Promise<StorageResult<void>> => 
      ipcRenderer.invoke('storage:reset'),
    
    // 获取所有配置
    getAll: (): Promise<StorageResult<AppConfig>> => 
      ipcRenderer.invoke('storage:getAll'),
    
    // 设置多个配置项
    setMultiple: (config: Partial<AppConfig>): Promise<StorageResult<void>> => 
      ipcRenderer.invoke('storage:setMultiple', config),
    
    // 导出配置
    export: (): Promise<StorageResult<string>> => 
      ipcRenderer.invoke('storage:export'),
    
    // 导入配置
    import: (json: string): Promise<StorageResult<void>> => 
      ipcRenderer.invoke('storage:import', json),
    
    // 获取存储文件路径
    getStorePath: (): Promise<StorageResult<string>> => 
      ipcRenderer.invoke('storage:getStorePath'),
    
    // 获取存储大小
    getStoreSize: (): Promise<StorageResult<number>> => 
      ipcRenderer.invoke('storage:getStoreSize'),
  },
});
