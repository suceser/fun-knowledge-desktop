// 存储操作结果
export interface StorageResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}