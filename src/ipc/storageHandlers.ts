/**
 * 存储相关的 IPC 处理器
 */

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { storageService } from '../services/storageService';
import { AppConfig } from '../types/storage';

/**
 * 注册所有存储相关的 IPC 处理器
 */
export function registerStorageHandlers(): void {
  // 获取配置值
  ipcMain.handle('storage:get', (_event: IpcMainInvokeEvent, key: string) => {
    try {
      return { success: true, data: storageService.get(key) };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

  // 设置配置值
  ipcMain.handle('storage:set', (_event: IpcMainInvokeEvent, key: string, value: unknown) => {
    return storageService.set(key, value);
  });

  // 删除配置项
  ipcMain.handle('storage:delete', (_event: IpcMainInvokeEvent, key: string) => {
    return storageService.delete(key);
  });

  // 检查配置项是否存在
  ipcMain.handle('storage:has', (_event: IpcMainInvokeEvent, key: string) => {
    try {
      return { success: true, data: storageService.has(key) };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

  // 清空所有配置
  ipcMain.handle('storage:clear', () => {
    return storageService.clear();
  });

  // 重置到默认配置
  ipcMain.handle('storage:reset', () => {
    return storageService.reset();
  });

  // 获取所有配置
  ipcMain.handle('storage:getAll', () => {
    try {
      return { success: true, data: storageService.getAll() };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

  // 设置多个配置项
  ipcMain.handle('storage:setMultiple', (_event: IpcMainInvokeEvent, config: Partial<AppConfig>) => {
    return storageService.setMultiple(config);
  });

  // 导出配置
  ipcMain.handle('storage:export', () => {
    return storageService.export();
  });

  // 导入配置
  ipcMain.handle('storage:import', (_event: IpcMainInvokeEvent, json: string) => {
    return storageService.import(json);
  });

  // 获取存储文件路径
  ipcMain.handle('storage:getStorePath', () => {
    try {
      return { success: true, data: storageService.getStorePath() };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

  // 获取存储大小
  ipcMain.handle('storage:getStoreSize', () => {
    try {
      return { success: true, data: storageService.getStoreSize() };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });
}

/**
 * 注销所有存储相关的 IPC 处理器
 */
export function unregisterStorageHandlers(): void {
  ipcMain.removeHandler('storage:get');
  ipcMain.removeHandler('storage:set');
  ipcMain.removeHandler('storage:delete');
  ipcMain.removeHandler('storage:has');
  ipcMain.removeHandler('storage:clear');
  ipcMain.removeHandler('storage:reset');
  ipcMain.removeHandler('storage:getAll');
  ipcMain.removeHandler('storage:setMultiple');
  ipcMain.removeHandler('storage:export');
  ipcMain.removeHandler('storage:import');
  ipcMain.removeHandler('storage:getStorePath');
  ipcMain.removeHandler('storage:getStoreSize');
}

