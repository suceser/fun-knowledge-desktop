/**
 * AI 服务 - 用于调用大模型 API
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

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

export interface ChatCompletionResult {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

/**
 * 调用大模型 API 进行聊天补全
 */
export async function chatCompletion(
  options: ChatCompletionOptions
): Promise<ChatCompletionResult> {
  try {
    // 标准化 API URL
    let baseUrl = options.apiUrl.trim();

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

    // 确保有 /chat/completions 端点
    const endpoint = baseUrl.endsWith('/chat/completions')
      ? baseUrl
      : `${baseUrl}/chat/completions`;

    // 构造请求体
    const requestBody: any = {
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

    // 发送请求
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${options.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    // 处理流式响应
    if (options.stream && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter((line) => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || '';
                if (content) {
                  fullContent += content;
                  options.onStream?.(content);
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }

        return {
          success: true,
          content: fullContent,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : '流式响应处理失败',
        };
      }
    }

    // 处理非流式响应
    const data = await response.json();

    if (!response.ok) {
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
    const content = data.choices?.[0]?.message?.content || '';
    const usage = data.usage;

    return {
      success: true,
      content,
      usage: {
        promptTokens: usage?.prompt_tokens,
        completionTokens: usage?.completion_tokens,
        totalTokens: usage?.total_tokens,
      },
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

