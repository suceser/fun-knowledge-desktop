// 记忆设置
export interface MemorySettings {
    enabled: boolean;
    maxMemoryItems: number;
    retentionDays: number;
    autoCleanup: boolean;
    // 用户管理
    userManagementEnabled: boolean;
    selectedUser: string;
}