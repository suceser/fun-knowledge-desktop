/**
 * 聊天补全核心功能
 */

import { ChatCompletionOptions, ChatCompletionResult } from './types';
import { prepareEndpointUrl } from './urlUtils';
import { buildRequestBody, buildRequestHeaders } from './requestBuilder';
import { handleStreamResponse } from './streamHandler';
import { handleNormalResponse } from './responseHandler';
import { handleNetworkError } from './errorHandler';

/**
 * 调用大模型 API 进行聊天补全
 * 
 * @param options - 聊天补全选项
 * @returns 聊天补全结果
 * 
 * @example
 * ```typescript
 * const result = await chatCompletion({
 *   apiUrl: 'https://api.example.com/v1',
 *   apiKey: 'your-api-key',
 *   model: 'gpt-3.5-turbo',
 *   messages: [
 *     { role: 'user', content: 'Hello!' }
 *   ],
 * });
 * 
 * if (result.success) {
 *   console.log(result.content);
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export async function chatCompletion(
  options: ChatCompletionOptions
): Promise<ChatCompletionResult> {
  try {
    // 1. 准备端点 URL
    const endpoint = prepareEndpointUrl(options.apiUrl);

    // 2. 构建请求体和请求头
    const requestBody = buildRequestBody(options);
    const headers = buildRequestHeaders(options.apiKey);

    // 3. 发送请求
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    // 4. 处理响应
    if (options.stream && response.body) {
      // 处理流式响应
      return await handleStreamResponse(response, options.onStream);
    } else {
      // 处理非流式响应
      return await handleNormalResponse(response);
    }
  } catch (error) {
    // 5. 处理网络错误和其他异常
    return handleNetworkError(error);
  }
}

