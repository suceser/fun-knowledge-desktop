/**
 * API 请求构建器
 */

import { ChatCompletionOptions } from './Types';

/**
 * 构建聊天补全请求体
 * 
 * @param options - 聊天补全选项
 * @returns 请求体对象
 */
export function buildRequestBody(options: ChatCompletionOptions): Record<string, any> {
  const requestBody: Record<string, any> = {
    model: options.model,
    messages: options.messages,
    temperature: options.temperature ?? 0.7,
  };

  if (options.maxTokens) {
    requestBody.max_tokens = options.maxTokens;
  }

  if (options.stream) {
    requestBody.stream = true;
  }

  return requestBody;
}

/**
 * 构建请求头
 * 
 * @param apiKey - API 密钥
 * @returns 请求头对象
 */
export function buildRequestHeaders(apiKey: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };
}

