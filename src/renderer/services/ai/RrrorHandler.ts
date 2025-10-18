/**
 * API 错误处理器
 */

import {ApiResponse} from "./model/ApiResponse";
import {ChatCompletionResult} from "./model/ChatCompletionResult";

/**
 * 根据 HTTP 状态码获取友好的错误消息
 * 
 * @param status - HTTP 状态码
 * @returns 错误消息
 */
export function getErrorMessageByStatus(status: number): string {
  switch (status) {
    case 401:
      return 'API 密钥无效或已过期';
    case 403:
      return '无权访问该模型或 API';
    case 404:
      return '模型不存在或 API 地址错误';
    case 429:
      return '请求过于频繁，请稍后再试';
    case 500:
      return '服务器内部错误';
    default:
      return '请求失败';
  }
}

/**
 * 从 API 响应中提取错误消息
 * 
 * @param data - API 响应数据
 * @returns 错误消息
 */
export function extractErrorMessage(data: ApiResponse): string {
  if (data.error) {
    if (typeof data.error === 'string') {
      return data.error;
    } else if (data.error.message) {
      return data.error.message;
    }
  }
  
  if (data.message) {
    return data.message;
  }
  
  return '未知错误';
}

/**
 * 处理 API 错误响应
 * 
 * @param response - HTTP 响应对象
 * @param data - API 响应数据
 * @returns 错误结果
 */
export function handleApiError(
  response: Response,
  data: ApiResponse
): ChatCompletionResult {
  const extractedError = extractErrorMessage(data);
  const statusError = getErrorMessageByStatus(response.status);
  
  // 优先使用状态码对应的错误消息，如果是默认消息则使用提取的错误
  const errorMessage = statusError !== '请求失败' ? statusError : extractedError;

  return {
    success: false,
    error: errorMessage,
  };
}

/**
 * 处理网络错误
 * 
 * @param error - 错误对象
 * @returns 错误结果
 */
export function handleNetworkError(error: unknown): ChatCompletionResult {
  // 网络连接错误
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      success: false,
      error: '网络连接失败，请检查 API 地址是否正确',
    };
  }

  // 其他错误
  return {
    success: false,
    error: error instanceof Error ? error.message : '未知错误',
  };
}

