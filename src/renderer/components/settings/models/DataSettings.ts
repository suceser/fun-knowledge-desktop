// 数据设置
export interface DataSettings {
    dataDirectory: string;
    databasePath: string;
    attachmentsPath: string;
    logsPath: string;
    backupEnabled: boolean;
    backupInterval: number;
    maxBackups: number;
}