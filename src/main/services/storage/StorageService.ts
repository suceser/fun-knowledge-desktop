/**
 * 主进程存储服务
 * 使用 electron-store 实现配置持久化
 */

import Store from 'electron-store';
import {app} from 'electron';
import path from 'path';
import {AppConfig} from "components/settings/models/AppConfig";
import {StorageResult} from "./models/StorageResult";
import {DEFAULT_APP_CONFIG} from "components/settings/models/DefaultAppConfig";

// 扩展 Store 类型以包含所有方法（解决类型推断问题）
type StoreType<T> = Store<T> & {
    get<K extends keyof T>(key: K): T[K];
    get<V = unknown>(key: string): V;
    set<K extends keyof T>(key: K, value: T[K]): void;
    set(key: string, value: unknown): void;
    delete(key: string): void;
    has(key: string): boolean;
    clear(): void;
    store: T;
    readonly path: string;
    readonly size: number;
    onDidChange<K extends keyof T>(
        key: K,
        callback: (newValue: T[K], oldValue: T[K]) => void
    ): () => void;
    onDidChange(
        key: string,
        callback: (newValue: unknown, oldValue: unknown) => void
    ): () => void;
};

// 存储配置
const storeConfig = {
    name: 'app-config',
    cwd: app.getPath('userData'),
    fileExtension: 'json',
    clearInvalidConfig: true,
    defaults: DEFAULT_APP_CONFIG,
};

// 创建存储实例
const store = new Store<AppConfig>(storeConfig) as StoreType<AppConfig>;

/**
 * 存储服务类
 */
class StorageService {
    private store: StoreType<AppConfig>;
    private listeners: Map<string, Set<(value: unknown) => void>>;

    constructor() {
        this.store = store;
        this.listeners = new Map();
        this.initializeDataPaths();
    }

    /**
     * 初始化数据路径
     */
    private initializeDataPaths(): void {
        const userData = app.getPath('userData');
        const currentConfig = this.store.get('data');

        // 如果路径为空，设置默认路径
        if (!currentConfig.dataDirectory) {
            this.store.set('data.dataDirectory', userData);
        }
        if (!currentConfig.databasePath) {
            this.store.set('data.databasePath', path.join(userData, 'databases'));
        }
        if (!currentConfig.attachmentsPath) {
            this.store.set('data.attachmentsPath', path.join(userData, 'attachments'));
        }
        if (!currentConfig.logsPath) {
            this.store.set('data.logsPath', path.join(userData, 'logs'));
        }
    }

    /**
     * 获取配置值
     */
    get<K extends keyof AppConfig>(key: K): AppConfig[K];
    get<T = unknown>(key: string): T;
    get(key: string): unknown {
        return this.store.get(key);
    }

    /**
     * 设置配置值
     */
    set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): StorageResult<void>;
    set<T = unknown>(key: string, value: T): StorageResult<void>;
    set(key: string, value: unknown): StorageResult<void> {
        try {
            this.store.set(key, value);
            this.notifyListeners(key, value);
            return {success: true};
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * 删除配置项
     */
    delete(key: string): StorageResult<void> {
        try {
            this.store.delete(key);
            this.notifyListeners(key, undefined);
            return {success: true};
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * 检查配置项是否存在
     */
    has(key: string): boolean {
        return this.store.has(key);
    }

    /**
     * 清空所有配置
     */
    clear(): StorageResult<void> {
        try {
            this.store.clear();
            return {success: true};
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * 重置到默认配置
     */
    reset(): StorageResult<void> {
        try {
            this.store.clear();
            this.store.store = DEFAULT_APP_CONFIG;
            this.initializeDataPaths();
            return {success: true};
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * 获取所有配置
     */
    getAll(): AppConfig {
        return this.store.store;
    }

    /**
     * 设置多个配置项
     */
    setMultiple(config: Partial<AppConfig>): StorageResult<void> {
        try {
            Object.entries(config).forEach(([key, value]) => {
                this.store.set(key, value);
            });
            return {success: true};
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * 导出配置
     */
    export(): StorageResult<string> {
        try {
            const config = this.store.store;
            const json = JSON.stringify(config, null, 2);
            return {success: true, data: json};
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * 导入配置
     */
    import(json: string): StorageResult<void> {
        try {
            const config = JSON.parse(json);
            this.store.store = config;
            return {success: true};
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * 获取存储文件路径
     */
    getStorePath(): string {
        return this.store.path;
    }

    /**
     * 获取存储大小（字节）
     */
    getStoreSize(): number {
        return this.store.size;
    }

    /**
     * 监听配置变化
     */
    watch(key: string, callback: (newValue: unknown, oldValue: unknown) => void): () => void {
        return this.store.onDidChange(key, callback);
    }

    /**
     * 添加配置变化监听器
     */
    addListener(key: string, callback: (value: unknown) => void): void {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key)?.add(callback);
    }

    /**
     * 移除配置变化监听器
     */
    removeListener(key: string, callback: (value: unknown) => void): void {
        this.listeners.get(key)?.delete(callback);
    }

    /**
     * 通知监听器
     */
    private notifyListeners(key: string, value: unknown): void {
        this.listeners.get(key)?.forEach(callback => callback(value));
    }
}

// 导出单例
export const storageService = new StorageService();

