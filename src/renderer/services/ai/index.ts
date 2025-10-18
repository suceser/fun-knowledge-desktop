/**
 * AI 服务统一导出
 * 
 * 提供大模型 API 调用功能
 */

// 导出主要功能
export { chatCompletion } from './chatCompletion';

// 导出类型定义
export type {
  ChatMessage,
  ChatCompletionOptions,
  ChatCompletionResult,
  TokenUsage,
  ApiResponse,
} from './types';

// 导出工具函数（如果需要在外部使用）
export {
  normalizeApiUrl,
  buildChatEndpoint,
  prepareEndpointUrl,
} from './urlUtils';

export {
  buildRequestBody,
  buildRequestHeaders,
} from './requestBuilder';

export {
  getErrorMessageByStatus,
  extractErrorMessage,
  handleApiError,
  handleNetworkError,
} from './errorHandler';

export {
  handleStreamResponse,
} from './streamHandler';

export {
  handleNormalResponse,
} from './responseHandler';

