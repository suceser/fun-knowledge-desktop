// 助手类型定义
export interface Assistant {
  id: string;
  name: string;
  description: string;
  icon: string;
  systemPrompt: string;
  isDefault?: boolean;
  createdAt: string;
}

// 消息类型
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tokens?: string;
  model?: string;
}

// 话题类型
export interface Topic {
  id: string;
  title: string;
  assistantId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// 对话历史类型（已废弃，使用Topic代替）
export interface Conversation {
  assistantId: string;
  messages: Message[];
}

