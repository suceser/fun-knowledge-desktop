/**
 * 全局类型声明
 */

import {AppConfig} from '../../renderer/components/settings/models/AppConfig';
import {StorageResult} from '../services/storage/models/StorageResult';

export interface ElectronAPI {
    storage: {
        get: <T = unknown>(key: string) => Promise<StorageResult<T>>;
        set: <T = unknown>(key: string, value: T) => Promise<StorageResult<void>>;
        delete: (key: string) => Promise<StorageResult<void>>;
        has: (key: string) => Promise<StorageResult<boolean>>;
        clear: () => Promise<StorageResult<void>>;
        reset: () => Promise<StorageResult<void>>;
        getAll: () => Promise<StorageResult<AppConfig>>;
        setMultiple: (config: Partial<AppConfig>) => Promise<StorageResult<void>>;
        export: () => Promise<StorageResult<string>>;
        import: (json: string) => Promise<StorageResult<void>>;
        getStorePath: () => Promise<StorageResult<string>>;
        getStoreSize: () => Promise<StorageResult<number>>;
    };
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

export {};

