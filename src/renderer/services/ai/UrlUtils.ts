/**
 * URL 处理工具函数
 */

/**
 * 标准化 API URL
 * 
 * @param apiUrl - 原始 API URL
 * @returns 标准化后的 URL
 * 
 * @example
 * normalizeApiUrl('https://api.example.com/') // 'https://api.example.com'
 * normalizeApiUrl('https://api.example.com#') // 'https://api.example.com/v1'
 */
export function normalizeApiUrl(apiUrl: string): string {
  let baseUrl = apiUrl.trim();

  // 处理 URL 结尾
  if (baseUrl.endsWith('#')) {
    // 强制使用 v1
    baseUrl = baseUrl.slice(0, -1);
    if (!baseUrl.endsWith('/v1')) {
      baseUrl = baseUrl.replace(/\/$/, '') + '/v1';
    }
  } else if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  return baseUrl;
}

/**
 * 构建聊天补全端点 URL
 * 
 * @param baseUrl - 基础 URL
 * @returns 完整的聊天补全端点 URL
 * 
 * @example
 * buildChatEndpoint('https://api.example.com/v1') // 'https://api.example.com/v1/chat/completions'
 */
export function buildChatEndpoint(baseUrl: string): string {
  return baseUrl.endsWith('/chat/completions')
    ? baseUrl
    : `${baseUrl}/chat/completions`;
}

/**
 * 标准化并构建完整的聊天端点 URL
 * 
 * @param apiUrl - 原始 API URL
 * @returns 完整的聊天补全端点 URL
 */
export function prepareEndpointUrl(apiUrl: string): string {
  const normalized = normalizeApiUrl(apiUrl);
  return buildChatEndpoint(normalized);
}

