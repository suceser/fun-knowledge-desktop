/**
 * API Key 检测服务
 * 提供 API Key 验证功能
 */

interface TestResult {
  success: boolean;
  error?: string;
  model?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

/**
 * 标准化 API URL
 */
function normalizeApiUrl(apiUrl: string): string {
  let baseUrl = apiUrl.trim();

  // 处理 URL 结尾
  if (baseUrl.endsWith('#')) {
    // 强制使用 v1
    baseUrl = baseUrl.slice(0, -1);
    if (!baseUrl.endsWith('/v1')) {
      baseUrl = baseUrl.replace(/\/$/, '') + '/v1';
    }
  } else if (baseUrl.endsWith('/')) {
    // 避免 v1 版本
    baseUrl = baseUrl.slice(0, -1);
  }

  return baseUrl;
}

/**
 * 构建完整的 API 端点
 */
function buildEndpoint(baseUrl: string): string {
  return baseUrl.endsWith('/chat/completions')
    ? baseUrl
    : `${baseUrl}/chat/completions`;
}

/**
 * 解析错误消息
 */
function parseErrorMessage(response: Response, data: any): string {
  let errorMessage = '请求失败';

  if (data.error) {
    if (typeof data.error === 'string') {
      errorMessage = data.error;
    } else if (data.error.message) {
      errorMessage = data.error.message;
    }
  } else if (data.message) {
    errorMessage = data.message;
  }

  // 根据状态码提供更友好的错误信息
  switch (response.status) {
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
      return errorMessage;
  }
}

/**
 * 测试大模型 API Key
 *
 * @param apiUrl - API 基础地址
 * @param apiKey - API 密钥
 * @param modelName - 模型名称
 * @returns 测试结果
 */
export async function testModelApiKey(
  apiUrl: string,
  apiKey: string,
  modelName: string
): Promise<TestResult> {
  try {
    // 标准化 URL
    const baseUrl = normalizeApiUrl(apiUrl);
    const endpoint = buildEndpoint(baseUrl);

    // 构造测试请求
    const requestBody = {
      model: modelName,
      messages: [
        {
          role: 'user',
          content: 'Hello, this is a test message to verify the API key.',
        },
      ],
      max_tokens: 10,
      temperature: 0.1,
    };

    // 发送请求
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseErrorMessage(response, data),
      };
    }

    // 成功响应
    return {
      success: true,
      model: data.model,
      usage: data.usage,
    };
  } catch (error) {
    // 网络错误或其他异常
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: '网络连接失败，请检查 API 地址是否正确',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}

