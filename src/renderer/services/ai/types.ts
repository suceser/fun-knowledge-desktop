/**
 * AI 服务相关的类型定义
 */

/**
 * 聊天消息
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * 聊天补全选项
 */
export interface ChatCompletionOptions {
  apiUrl: string;
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
  onStream?: (text: string) => void;
}

/**
 * Token 使用情况
 */
export interface TokenUsage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

/**
 * 聊天补全结果
 */
export interface ChatCompletionResult {
  success: boolean;
  content?: string;
  error?: string;
  usage?: TokenUsage;
}

/**
 * API 响应数据结构
 */
export interface ApiResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
    delta?: {
      content?: string;
    };
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  error?: string | {
    message?: string;
  };
  message?: string;
}

