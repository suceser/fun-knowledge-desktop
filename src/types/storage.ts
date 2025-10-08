/**
 * 存储相关的类型定义
 */

// 应用配置
export interface AppConfig {
  // 通用设置
  general: GeneralSettings;
  // 显示设置
  display: DisplaySettings;
  // 模型设置
  models: ModelSettings;
  // 搜索设置
  search: SearchSettings;
  // 快捷键设置
  shortcuts: ShortcutSettings;
  // 文档设置
  document: DocumentSettings;
  // 数据设置
  data: DataSettings;
  // MCP设置
  mcp: MCPSettings;
  // 记忆设置
  memory: MemorySettings;
}

// 通用设置
export interface GeneralSettings {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  autoStart: boolean;
  minimizeToTray: boolean;
  closeToTray: boolean;
  checkUpdatesOnStartup: boolean;
}

// 显示设置
export interface DisplaySettings {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  showLineNumbers: boolean;
  showMinimap: boolean;
  wordWrap: boolean;
  cursorStyle: 'line' | 'block' | 'underline';
}

// 模型设置
export interface ModelSettings {
  providers: Record<string, ProviderConfig>;
  defaultProvider: string;
  defaultModel: string;
}

export interface ProviderConfig {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'azure' | 'gemini' | 'custom';
  apiKey?: string;
  apiUrl?: string;
  enabled: boolean;
  models: string[];
}

// 搜索设置
export interface SearchSettings {
  enableFullTextSearch: boolean;
  enableSemanticSearch: boolean;
  searchProvider: 'local' | 'cloud';
  indexingEnabled: boolean;
  maxResults: number;
}

// 快捷键设置
export interface ShortcutSettings {
  globalShortcut: string;
  newNote: string;
  search: string;
  quickCapture: string;
  toggleSidebar: string;
}

// 文档设置
export interface DocumentSettings {
  autoSave: boolean;
  autoSaveInterval: number;
  defaultFormat: 'markdown' | 'html' | 'text';
  enableVersionControl: boolean;
  maxVersions: number;
}

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

// MCP设置
export interface MCPSettings {
  enabled: boolean;
  servers: MCPServerConfig[];
}

export interface MCPServerConfig {
  id: string;
  name: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
  enabled: boolean;
}

// 记忆设置
export interface MemorySettings {
  enabled: boolean;
  maxMemoryItems: number;
  retentionDays: number;
  autoCleanup: boolean;
}

// 默认配置
export const DEFAULT_APP_CONFIG: AppConfig = {
  general: {
    language: 'zh-CN',
    theme: 'auto',
    autoStart: false,
    minimizeToTray: true,
    closeToTray: false,
    checkUpdatesOnStartup: true,
  },
  display: {
    fontSize: 14,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    lineHeight: 1.6,
    showLineNumbers: false,
    showMinimap: false,
    wordWrap: true,
    cursorStyle: 'line',
  },
  models: {
    providers: {},
    defaultProvider: '',
    defaultModel: '',
  },
  search: {
    enableFullTextSearch: true,
    enableSemanticSearch: false,
    searchProvider: 'local',
    indexingEnabled: true,
    maxResults: 50,
  },
  shortcuts: {
    globalShortcut: 'CommandOrControl+Shift+K',
    newNote: 'CommandOrControl+N',
    search: 'CommandOrControl+F',
    quickCapture: 'CommandOrControl+Shift+N',
    toggleSidebar: 'CommandOrControl+B',
  },
  document: {
    autoSave: true,
    autoSaveInterval: 30,
    defaultFormat: 'markdown',
    enableVersionControl: true,
    maxVersions: 10,
  },
  data: {
    dataDirectory: '',
    databasePath: '',
    attachmentsPath: '',
    logsPath: '',
    backupEnabled: true,
    backupInterval: 24,
    maxBackups: 7,
  },
  mcp: {
    enabled: false,
    servers: [],
  },
  memory: {
    enabled: true,
    maxMemoryItems: 1000,
    retentionDays: 30,
    autoCleanup: true,
  },
};

// 存储操作结果
export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 存储事件
export type StorageEvent = 'config-updated' | 'config-reset' | 'storage-error';

export interface StorageEventData {
  event: StorageEvent;
  key?: string;
  value?: unknown;
  error?: string;
}

