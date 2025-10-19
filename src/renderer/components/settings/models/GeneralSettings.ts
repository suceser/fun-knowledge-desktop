// 通用设置
export interface GeneralSettings {
    language: string;
    theme: 'light' | 'dark' | 'auto';
    proxyMode: 'system' | 'direct' | 'custom';
    spellCheck: boolean;
    hardwareAcceleration: boolean;
    autoStart: boolean;
    minimizeToTray: boolean;
    closeToTray: boolean;
    showTrayIcon: boolean;
    checkUpdatesOnStartup: boolean;
    // 通知设置
    assistantMessages: boolean;
    backup: boolean;
    knowledgeBase: boolean;
    // 隐私设置
    anonymousReporting: boolean;
}