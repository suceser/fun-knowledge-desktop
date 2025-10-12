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

// 显示设置
export interface DisplaySettings {
  // 主题设置
  theme: '浅色' | '深色' | '系统';
  themeColor: string;
  transparentWindow: boolean;
  // 导航栏设置
  navbarPosition: '左侧' | '顶部';
  // 缩放设置
  zoomLevel: number;
  // 话题设置
  topicPosition: '左侧' | '右侧';
  autoSwitchTopic: boolean;
  showTopicTime: boolean;
  pinTopicTop: boolean;
  // 助手设置
  modelIconType: '模型图标' | 'Emoji 表情' | '不显示';
  // 原有字段（保留兼容）
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

// 搜索设置（网络搜索）
export interface SearchSettings {
  // 搜索服务商配置
  searchProvider: string; // 搜索服务商名称
  apiKey: string;
  apiUrl: string;
  // 搜索配置
  includeAnswer: boolean;
  maxResults: number;
  compressionMethod: '不压缩' | '智能压缩' | '高度压缩';
  // 网站黑名单
  blacklistSites: string[];
  // 原有字段（保留兼容）
  enableFullTextSearch: boolean;
  enableSemanticSearch: boolean;
  indexingEnabled: boolean;
}

// 快捷键项
export interface ShortcutItem {
  id: string;
  name: string;
  description: string;
  defaultKey: string;
  currentKey: string;
  category: string;
  enabled: boolean;
}

// 快捷键设置
export interface ShortcutSettings {
  // 新增：快捷键列表
  shortcuts: ShortcutItem[];
  // 原有字段（保留兼容）
  globalShortcut: string;
  newNote: string;
  search: string;
  quickCapture: string;
  toggleSidebar: string;
}

// 文档项
export interface DocumentItem {
  id: string;
  name: string;
  size: string;
  status: 'processing' | 'completed' | 'error';
  progress: number;
  type: string;
}

// 文档设置
export interface DocumentSettings {
  // OCR服务配置
  ocrProvider: string;
  ocrLanguages: string[];
  // 文档处理配置
  documentProvider: string;
  apiKey: string;
  apiUrl: string;
  // 文档列表
  documents: DocumentItem[];
  // 原有字段（保留兼容）
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
  // 用户管理
  userManagementEnabled: boolean;
  selectedUser: string;
}

// 默认配置
export const DEFAULT_APP_CONFIG: AppConfig = {
  general: {
    language: 'zh-CN',
    theme: 'auto',
    proxyMode: 'system',
    spellCheck: true,
    hardwareAcceleration: true,
    autoStart: false,
    minimizeToTray: true,
    closeToTray: false,
    showTrayIcon: true,
    checkUpdatesOnStartup: true,
    assistantMessages: true,
    backup: true,
    knowledgeBase: true,
    anonymousReporting: true,
  },
  display: {
    theme: '深色',
    themeColor: '#00B96B',
    transparentWindow: true,
    navbarPosition: '左侧',
    zoomLevel: 100,
    topicPosition: '左侧',
    autoSwitchTopic: false,
    showTopicTime: true,
    pinTopicTop: false,
    modelIconType: '模型图标',
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
    searchProvider: 'Tavily (API 密钥)',
    apiKey: '',
    apiUrl: 'https://api.tavily.com',
    includeAnswer: true,
    maxResults: 5,
    compressionMethod: '不压缩',
    blacklistSites: [],
    enableFullTextSearch: true,
    enableSemanticSearch: false,
    indexingEnabled: true,
  },
  shortcuts: {
    shortcuts: [
      {
        id: 'display-hidden-app',
        name: '显示/隐藏应用',
        description: '快速显示或隐藏应用窗口',
        defaultKey: '按下快捷键',
        currentKey: '按下快捷键',
        category: 'app',
        enabled: true,
      },
      {
        id: 'quick-assistant',
        name: '快捷助手',
        description: '快速打开AI助手对话',
        defaultKey: '⌘ + E',
        currentKey: '⌘ + E',
        category: 'assistant',
        enabled: true,
      },
      {
        id: 'open-assistant',
        name: '开关助手手',
        description: '开启或关闭助手功能',
        defaultKey: '按下快捷键',
        currentKey: '按下快捷键',
        category: 'assistant',
        enabled: true,
      },
      {
        id: 'assistant-word',
        name: '划词助手：取词',
        description: '选中文字后快速取词翻译',
        defaultKey: '按下快捷键',
        currentKey: '按下快捷键',
        category: 'assistant',
        enabled: true,
      },
      {
        id: 'exit-fullscreen',
        name: '退出全屏',
        description: '退出全屏模式',
        defaultKey: 'Escape',
        currentKey: 'Escape',
        category: 'display',
        enabled: true,
      },
      {
        id: 'new-conversation',
        name: '新建话题',
        description: '创建新的对话话题',
        defaultKey: '⌘ + N',
        currentKey: '⌘ + N',
        category: 'conversation',
        enabled: true,
      },
      {
        id: 'toggle-assistant-tips',
        name: '切换助手显示',
        description: '显示或隐藏助手提示信息',
        defaultKey: '⌘ + [',
        currentKey: '⌘ + [',
        category: 'assistant',
        enabled: true,
      },
      {
        id: 'toggle-conversation-tips',
        name: '切换话题显示',
        description: '显示或隐藏话题列表',
        defaultKey: '⌘ + ]',
        currentKey: '⌘ + ]',
        category: 'conversation',
        enabled: true,
      },
      {
        id: 'copy-last-message',
        name: '复制上一条消息',
        description: '快速复制最后一条对话消息',
        defaultKey: '⌘ + ⇧ + C',
        currentKey: '⌘ + ⇧ + C',
        category: 'conversation',
        enabled: true,
      },
      {
        id: 'search-messages',
        name: '搜索消息',
        description: '在对话历史中搜索消息',
        defaultKey: '⌘ + ⇧ + F',
        currentKey: '⌘ + ⇧ + F',
        category: 'conversation',
        enabled: true,
      },
      {
        id: 'clear-messages',
        name: '清空消息',
        description: '清空当前对话的所有消息',
        defaultKey: '⌘ + L',
        currentKey: '⌘ + L',
        category: 'conversation',
        enabled: true,
      },
      {
        id: 'clear-context',
        name: '清除上下文',
        description: '清除对话的上下文记忆',
        defaultKey: '⌘ + K',
        currentKey: '⌘ + K',
        category: 'conversation',
        enabled: true,
      },
      {
        id: 'search-previous',
        name: '在当前对话中搜索消息',
        description: '在当前对话历史中搜索特定消息',
        defaultKey: '⌘ + F',
        currentKey: '⌘ + F',
        category: 'conversation',
        enabled: true,
      },
    ],
    globalShortcut: 'CommandOrControl+Shift+K',
    newNote: 'CommandOrControl+N',
    search: 'CommandOrControl+F',
    quickCapture: 'CommandOrControl+Shift+N',
    toggleSidebar: 'CommandOrControl+B',
  },
  document: {
    ocrProvider: '系统OCR',
    ocrLanguages: [],
    documentProvider: 'MinerU',
    apiKey: '',
    apiUrl: 'https://mineru.net',
    documents: [],
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
    userManagementEnabled: true,
    selectedUser: 'default',
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

