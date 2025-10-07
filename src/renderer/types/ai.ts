// AI 相关类型定义

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
  tokenCount?: number;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'file' | 'url';
  name: string;
  url: string;
  size?: number;
}

export interface Topic {
  id: string;
  title: string;
  description?: string;
  messages: Message[];
  lastMessage?: Message;
  messageCount: number;
  lastActive: number;
  tags: string[];
  assistantId?: string;
  modelId?: string;
}

export interface Assistant {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  systemPrompt?: string;
  isDefault: boolean;
  messageCount: number;
  settings?: AssistantSettings;
}

export interface AssistantSettings {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface ModelProvider {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'error';
  apiKey?: string;
  apiUrl?: string;
  models: Model[];
  settings?: ProviderSettings;
}

export interface Model {
  id: string;
  name: string;
  displayName: string;
  status: 'available' | 'unavailable';
  maxTokens?: number;
  supportStream?: boolean;
  costPer1kTokens?: number;
}

export interface ProviderSettings {
  timeout?: number;
  retryAttempts?: number;
  enableStream?: boolean;
}

export interface AIRequest {
  messages: Message[];
  model: string;
  providerId: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  systemPrompt?: string;
}

export interface AIResponse {
  id: string;
  content: string;
  model: string;
  providerId: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: 'stop' | 'length' | 'content_filter' | 'tool_calls';
  error?: string;
}

export interface ChatState {
  currentTopicId?: string;
  currentAssistantId: string;
  isLoading: boolean;
  error?: string;
  streamingMessageId?: string;
}

// 本地存储相关
export interface ChatStorage {
  topics: Record<string, Topic>;
  assistants: Record<string, Assistant>;
  providers: Record<string, ModelProvider>;
  settings: ChatSettings;
  lastTopicId?: string;
}

export interface ChatSettings {
  defaultAssistantId: string;
  defaultModelId: string;
  defaultProviderId: string;
  enableStream: boolean;
  contextCount: number;
  autoSaveDraft: boolean;
  showTokenCount: boolean;
  language: string;
  sendHotkey: string;
}
