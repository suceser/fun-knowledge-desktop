import { ApiTestResult } from '../types';

/**
 * 测试模型 API Key 是否有效
 */
export const testModelApiKey = async (
  apiUrl: string,
  apiKey: string,
  modelName: string
): Promise<ApiTestResult> => {
  try {
    // 标准化 API URL
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

    // 确保有 /chat/completions 端点
    const endpoint = baseUrl.endsWith('/chat/completions')
      ? baseUrl
      : `${baseUrl}/chat/completions`;

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
      // 处理错误响应
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
      if (response.status === 401) {
        errorMessage = 'API 密钥无效或已过期';
      } else if (response.status === 403) {
        errorMessage = '无权访问该模型或 API';
      } else if (response.status === 404) {
        errorMessage = '模型不存在或 API 地址错误';
      } else if (response.status === 429) {
        errorMessage = '请求过于频繁，请稍后再试';
      } else if (response.status === 500) {
        errorMessage = '服务器内部错误';
      }

      return {
        success: false,
        error: errorMessage,
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
};

