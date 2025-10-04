// AI 服务核心功能
import { AIRequest, AIResponse, ModelProvider, Model, Message } from '../types/ai';

class AIService {
  private providers: Map<string, ModelProvider> = new Map();

  /**
   * 初始化AI服务
   */
  initialize() {
    // 从本地存储加载提供商配置
    this.loadProviders();
  }

  /**
   * 从本地存储加载提供商配置
   */
  private loadProviders() {
    try {
      const stored = localStorage.getItem('ai_providers');
      if (stored) {
        const providersData = JSON.parse(stored);
        Object.values(providersData).forEach((provider: any) => {
          this.providers.set(provider.id, provider);
        });
      } else {
        // 初始化默认提供商
        this.initializeDefaultProviders();
      }
    } catch (error) {
      console.error('加载AI提供商配置失败:', error);
      this.initializeDefaultProviders();
    }
  }

  /**
   * 初始化默认提供商配置
   */
  private initializeDefaultProviders() {
    const defaultProviders: ModelProvider[] = [
      {
        id: 'modelscope',
        name: 'ModelScope 魔搭',
        icon: 'modelscope',
        status: 'disconnected',
        apiUrl: 'https://api-inference.modelscope.cn/v1/',
        models: [
          {
            id: 'qwen/Qwen2.5-72B-Instruct',
            name: 'qwen/Qwen2.5-72B-Instruct',
            displayName: 'Qwen2.5-72B',
            status: 'available',
            maxTokens: 32768,
            supportStream: true,
          },
          {
            id: 'qwen/Qwen2.5-VL-72B-Instruct',
            name: 'qwen/Qwen2.5-VL-72B-Instruct',
            displayName: 'Qwen2.5-VL-72B',
            status: 'available',
            maxTokens: 32768,
            supportStream: true,
          },
          {
            id: 'deepseek-ai/DeepSeek-R1',
            name: 'deepseek-ai/DeepSeek-R1',
            displayName: 'DeepSeek-R1',
            status: 'available',
            maxTokens: 65536,
            supportStream: true,
          },
          {
            id: 'deepseek-ai/DeepSeek-V3',
            name: 'deepseek-ai/DeepSeek-V3',
            displayName: 'DeepSeek-V3',
            status: 'available',
            maxTokens: 65536,
            supportStream: true,
          },
        ],
        settings: {
          timeout: 30000,
          retryAttempts: 3,
          enableStream: true,
        },
      },
      {
        id: 'openai',
        name: 'OpenAI',
        icon: 'openai',
        status: 'disconnected',
        apiUrl: 'https://api.openai.com/v1/',
        models: [
          {
            id: 'gpt-4o',
            name: 'gpt-4o',
            displayName: 'GPT-4o',
            status: 'available',
            maxTokens: 128000,
            supportStream: true,
          },
          {
            id: 'gpt-4o-mini',
            name: 'gpt-4o-mini',
            displayName: 'GPT-4o Mini',
            status: 'available',
            maxTokens: 128000,
            supportStream: true,
          },
          {
            id: 'gpt-3.5-turbo',
            name: 'gpt-3.5-turbo',
            displayName: 'GPT-3.5 Turbo',
            status: 'available',
            maxTokens: 16385,
            supportStream: true,
          },
        ],
        settings: {
          timeout: 30000,
          retryAttempts: 3,
          enableStream: true,
        },
      },
    ];

    defaultProviders.forEach(provider => {
      this.providers.set(provider.id, provider);
    });
    this.saveProviders();
  }

  /**
   * 保存提供商配置到本地存储
   */
  private saveProviders() {
    try {
      const providersObj: Record<string, ModelProvider> = {};
      this.providers.forEach((provider, key) => {
        providersObj[key] = provider;
      });
      localStorage.setItem('ai_providers', JSON.stringify(providersObj));
    } catch (error) {
      console.error('保存AI提供商配置失败:', error);
    }
  }

  /**
   * 获取所有提供商
   */
  getProviders(): ModelProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * 获取指定提供商
   */
  getProvider(providerId: string): ModelProvider | undefined {
    return this.providers.get(providerId);
  }

  /**
   * 更新提供商配置
   */
  updateProvider(providerId: string, updates: Partial<ModelProvider>) {
    const provider = this.providers.get(providerId);
    if (provider) {
      const updatedProvider = { ...provider, ...updates };
      this.providers.set(providerId, updatedProvider);
      this.saveProviders();
      return updatedProvider;
    }
    return undefined;
  }

  /**
   * 测试提供商连接
   */
  async testProvider(providerId: string): Promise<{ success: boolean; error?: string }> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      return { success: false, error: '提供商不存在' };
    }

    if (!provider.apiKey) {
      return { success: false, error: 'API密钥未配置' };
    }

    try {
      const testMessages: Message[] = [
        {
          id: 'test',
          role: 'user',
          content: '你好',
          timestamp: Date.now(),
        },
      ];

      const response = await this.sendRequest({
        messages: testMessages,
        model: provider.models[0]?.id || '',
        providerId: provider.id,
        maxTokens: 10,
      });

      if (response.error) {
        return { success: false, error: response.error };
      }

      // 更新提供商状态
      this.updateProvider(providerId, { status: 'connected' });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '连接测试失败';
      this.updateProvider(providerId, { status: 'error' });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * 发送AI请求
   */
  async sendRequest(request: AIRequest): Promise<AIResponse> {
    const provider = this.providers.get(request.providerId);
    if (!provider) {
      return {
        id: Date.now().toString(),
        content: '',
        model: request.model,
        providerId: request.providerId,
        error: '提供商不存在',
      };
    }

    if (!provider.apiKey) {
      return {
        id: Date.now().toString(),
        content: '',
        model: request.model,
        providerId: request.providerId,
        error: 'API密钥未配置',
      };
    }

    try {
      const response = await this.makeAPIRequest(provider, request);
      return response;
    } catch (error) {
      console.error('AI请求失败:', error);
      return {
        id: Date.now().toString(),
        content: '',
        model: request.model,
        providerId: request.providerId,
        error: error instanceof Error ? error.message : '请求失败',
      };
    }
  }

  /**
   * 发送流式AI请求
   */
  async *sendStreamRequest(request: AIRequest): AsyncGenerator<AIResponse, void, unknown> {
    const provider = this.providers.get(request.providerId);
    if (!provider) {
      yield {
        id: Date.now().toString(),
        content: '',
        model: request.model,
        providerId: request.providerId,
        error: '提供商不存在',
      };
      return;
    }

    if (!provider.apiKey) {
      yield {
        id: Date.now().toString(),
        content: '',
        model: request.model,
        providerId: request.providerId,
        error: 'API密钥未配置',
      };
      return;
    }

    try {
      yield* this.makeStreamAPIRequest(provider, request);
    } catch (error) {
      console.error('流式AI请求失败:', error);
      yield {
        id: Date.now().toString(),
        content: '',
        model: request.model,
        providerId: request.providerId,
        error: error instanceof Error ? error.message : '请求失败',
      };
    }
  }

  /**
   * 实际的API请求
   */
  private async makeAPIRequest(provider: ModelProvider, request: AIRequest): Promise<AIResponse> {
    const messages = request.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    // 添加系统提示词
    if (request.systemPrompt) {
      messages.unshift({
        role: 'system',
        content: request.systemPrompt,
      });
    }

    const requestBody = {
      model: request.model,
      messages: messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 2048,
      stream: false,
    };

    const response = await fetch(`${provider.apiUrl}chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API请求失败: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'API返回错误');
    }

    return {
      id: data.id || Date.now().toString(),
      content: data.choices[0]?.message?.content || '',
      model: data.model || request.model,
      providerId: request.providerId,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      } : undefined,
      finishReason: data.choices[0]?.finish_reason,
    };
  }

  /**
   * 流式API请求
   */
  private async *makeStreamAPIRequest(provider: ModelProvider, request: AIRequest): AsyncGenerator<AIResponse, void, unknown> {
    const messages = request.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    // 添加系统提示词
    if (request.systemPrompt) {
      messages.unshift({
        role: 'system',
        content: request.systemPrompt,
      });
    }

    const requestBody = {
      model: request.model,
      messages: messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 2048,
      stream: true,
    };

    const response = await fetch(`${provider.apiUrl}chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API请求失败: ${response.status} ${errorText}`);
    }

    if (!response.body) {
      throw new Error('响应体为空');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';

              if (content) {
                yield {
                  id: parsed.id || Date.now().toString(),
                  content: content,
                  model: parsed.model || request.model,
                  providerId: request.providerId,
                  usage: parsed.usage ? {
                    promptTokens: parsed.usage.prompt_tokens,
                    completionTokens: parsed.usage.completion_tokens,
                    totalTokens: parsed.usage.total_tokens,
                  } : undefined,
                  finishReason: parsed.choices[0]?.finish_reason,
                };
              }
            } catch (e) {
              // 忽略解析错误，继续处理下一行
              console.warn('解析SSE数据失败:', e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * 获取可用的模型列表
   */
  getAvailableModels(): { providerId: string; providerName: string; model: Model }[] {
    const result: { providerId: string; providerName: string; model: Model }[] = [];

    this.providers.forEach((provider, providerId) => {
      if (provider.status === 'connected') {
        provider.models.forEach(model => {
          if (model.status === 'available') {
            result.push({
              providerId,
              providerName: provider.name,
              model,
            });
          }
        });
      }
    });

    return result;
  }
}

// 导出单例实例
export const aiService = new AIService();
export default aiService;
