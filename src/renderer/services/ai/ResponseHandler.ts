/**
 * API 响应处理器
 */

import { ApiResponse, ChatCompletionResult, TokenUsage } from './Types';
import { handleApiError } from './RrrorHandler';

/**
 * 提取 Token 使用情况
 * 
 * @param usage - API 返回的 usage 对象
 * @returns Token 使用情况
 */
function extractTokenUsage(usage?: ApiResponse['usage']): TokenUsage | undefined {
  if (!usage) {
    return undefined;
  }

  return {
    promptTokens: usage.prompt_tokens,
    completionTokens: usage.completion_tokens,
    totalTokens: usage.total_tokens,
  };
}

/**
 * 处理成功的 API 响应
 * 
 * @param data - API 响应数据
 * @returns 成功结果
 */
function handleSuccessResponse(data: ApiResponse): ChatCompletionResult {
  const content = data.choices?.[0]?.message?.content || '';
  const usage = extractTokenUsage(data.usage);

  return {
    success: true,
    content,
    usage,
  };
}

/**
 * 处理非流式响应
 * 
 * @param response - HTTP 响应对象
 * @returns 响应结果
 */
export async function handleNormalResponse(
  response: Response
): Promise<ChatCompletionResult> {
  const data: ApiResponse = await response.json();

  // 处理错误响应
  if (!response.ok) {
    return handleApiError(response, data);
  }

  // 处理成功响应
  return handleSuccessResponse(data);
}

