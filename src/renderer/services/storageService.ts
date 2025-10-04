// 消息存储和历史记录管理服务
import {
  Message,
  Topic,
  Assistant,
  ModelProvider,
  ChatStorage,
  ChatSettings
} from '../types/ai';

class StorageService {
  private storageKey = 'fun_knowledge_chat';

  /**
   * 获取默认设置
   */
  private getDefaultSettings(): ChatSettings {
    return {
      defaultAssistantId: 'default',
      defaultModelId: 'qwen/Qwen2.5-72B-Instruct',
      defaultProviderId: 'modelscope',
      enableStream: true,
      contextCount: 5,
      autoSaveDraft: true,
      showTokenCount: false,
      language: 'zh',
      sendHotkey: 'enter',
    };
  }

  /**
   * 获取默认助手
   */
  private getDefaultAssistants(): Record<string, Assistant> {
    return {
      'default': {
        id: 'default',
        name: '默认助手',
        description: '通用AI助手，可以回答各类问题',
        isDefault: true,
        messageCount: 0,
        systemPrompt: '你是一个有用的AI助手，请用中文回答用户的问题。',
        settings: {
          temperature: 0.7,
          maxTokens: 2048,
        },
      },
      'product-manager': {
        id: 'product-manager',
        name: '策略产品经理',
        description: '专业的产品策略分析师',
        isDefault: false,
        messageCount: 0,
        systemPrompt: '你是一个资深的产品经理，擅长产品策略分析、用户体验设计和商业模式分析。请用专业的角度分析用户的问题，并给出实用的建议。',
        settings: {
          temperature: 0.6,
          maxTokens: 3000,
        },
      },
      'business-operator': {
        id: 'business-operator',
        name: '商家运营',
        description: '电商运营专家助手',
        isDefault: false,
        messageCount: 0,
        systemPrompt: '你是一个经验丰富的电商运营专家，精通营销策略、数据分析、用户运营和供应链管理。请从商业运营的角度回答用户的问题。',
        settings: {
          temperature: 0.5,
          maxTokens: 2500,
        },
      },
    };
  }

  /**
   * 加载完整的聊天数据
   */
  loadChatData(): ChatStorage {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored) as ChatStorage;
        // 确保有默认设置和助手
        return {
          ...data,
          settings: { ...this.getDefaultSettings(), ...data.settings },
          assistants: { ...this.getDefaultAssistants(), ...data.assistants },
        };
      }
    } catch (error) {
      console.error('加载聊天数据失败:', error);
    }

    // 返回默认数据
    return {
      topics: {},
      assistants: this.getDefaultAssistants(),
      providers: {},
      settings: this.getDefaultSettings(),
    };
  }

  /**
   * 保存完整的聊天数据
   */
  saveChatData(data: ChatStorage) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('保存聊天数据失败:', error);
    }
  }

  /**
   * 创建新话题
   */
  createTopic(title: string, assistantId: string = 'default'): Topic {
    const topic: Topic = {
      id: `topic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description: '',
      messages: [],
      messageCount: 0,
      lastActive: Date.now(),
      tags: [],
      assistantId,
    };

    const data = this.loadChatData();
    data.topics[topic.id] = topic;
    data.lastTopicId = topic.id;
    this.saveChatData(data);

    return topic;
  }

  /**
   * 获取所有话题
   */
  getTopics(): Topic[] {
    const data = this.loadChatData();
    return Object.values(data.topics).sort((a, b) => b.lastActive - a.lastActive);
  }

  /**
   * 获取指定话题
   */
  getTopic(topicId: string): Topic | undefined {
    const data = this.loadChatData();
    return data.topics[topicId];
  }

  /**
   * 更新话题
   */
  updateTopic(topicId: string, updates: Partial<Topic>): Topic | undefined {
    const data = this.loadChatData();
    const topic = data.topics[topicId];

    if (topic) {
      const updatedTopic = {
        ...topic,
        ...updates,
        lastActive: Date.now(),
      };
      data.topics[topicId] = updatedTopic;
      this.saveChatData(data);
      return updatedTopic;
    }
    return undefined;
  }

  /**
   * 删除话题
   */
  deleteTopic(topicId: string): boolean {
    const data = this.loadChatData();

    if (data.topics[topicId]) {
      delete data.topics[topicId];

      // 如果删除的是当前话题，清除lastTopicId
      if (data.lastTopicId === topicId) {
        const remainingTopics = Object.values(data.topics);
        data.lastTopicId = remainingTopics.length > 0 ?
          remainingTopics.sort((a, b) => b.lastActive - a.lastActive)[0].id :
          undefined;
      }

      this.saveChatData(data);
      return true;
    }
    return false;
  }

  /**
   * 添加消息到话题
   */
  addMessage(topicId: string, message: Message): Topic | undefined {
    const data = this.loadChatData();
    const topic = data.topics[topicId];

    if (topic) {
      topic.messages.push(message);
      topic.messageCount = topic.messages.length;
      topic.lastActive = Date.now();

      // 更新最后一条消息
      if (message.role === 'user' || message.role === 'assistant') {
        topic.lastMessage = message;
      }

      // 更新话题标题（如果是第一条用户消息且标题为默认）
      if (message.role === 'user' && topic.messages.filter(m => m.role === 'user').length === 1 &&
          (topic.title === '新对话' || topic.title.startsWith('新对话'))) {
        topic.title = message.content.length > 30 ?
          message.content.substring(0, 30) + '...' :
          message.content;
      }

      data.topics[topicId] = topic;
      data.lastTopicId = topicId;
      this.saveChatData(data);
      return topic;
    }
    return undefined;
  }

  /**
   * 获取话题的消息列表
   */
  getMessages(topicId: string): Message[] {
    const topic = this.getTopic(topicId);
    return topic ? topic.messages : [];
  }

  /**
   * 获取话题的上下文消息（用于AI请求）
   */
  getContextMessages(topicId: string, contextCount: number = 5): Message[] {
    const messages = this.getMessages(topicId);
    // 只获取用户和助手的消息，排除系统消息
    const userAssistantMessages = messages.filter(m => m.role === 'user' || m.role === 'assistant');
    // 返回最后 contextCount*2 条消息（保证用户-助手对话的完整性）
    return userAssistantMessages.slice(-contextCount * 2);
  }

  /**
   * 更新消息
   */
  updateMessage(topicId: string, messageId: string, updates: Partial<Message>): Message | undefined {
    const data = this.loadChatData();
    const topic = data.topics[topicId];

    if (topic) {
      const messageIndex = topic.messages.findIndex(m => m.id === messageId);
      if (messageIndex >= 0) {
        const updatedMessage = { ...topic.messages[messageIndex], ...updates };
        topic.messages[messageIndex] = updatedMessage;
        topic.lastActive = Date.now();

        data.topics[topicId] = topic;
        this.saveChatData(data);
        return updatedMessage;
      }
    }
    return undefined;
  }

  /**
   * 删除消息
   */
  deleteMessage(topicId: string, messageId: string): boolean {
    const data = this.loadChatData();
    const topic = data.topics[topicId];

    if (topic) {
      const originalLength = topic.messages.length;
      topic.messages = topic.messages.filter(m => m.id !== messageId);

      if (topic.messages.length < originalLength) {
        topic.messageCount = topic.messages.length;
        topic.lastActive = Date.now();

        // 更新最后一条消息
        const lastMessage = topic.messages
          .filter(m => m.role === 'user' || m.role === 'assistant')
          .pop();
        topic.lastMessage = lastMessage;

        data.topics[topicId] = topic;
        this.saveChatData(data);
        return true;
      }
    }
    return false;
  }

  /**
   * 清空话题的所有消息
   */
  clearTopicMessages(topicId: string): boolean {
    const data = this.loadChatData();
    const topic = data.topics[topicId];

    if (topic) {
      topic.messages = [];
      topic.messageCount = 0;
      topic.lastMessage = undefined;
      topic.lastActive = Date.now();

      data.topics[topicId] = topic;
      this.saveChatData(data);
      return true;
    }
    return false;
  }

  /**
   * 获取所有助手
   */
  getAssistants(): Assistant[] {
    const data = this.loadChatData();
    return Object.values(data.assistants);
  }

  /**
   * 获取指定助手
   */
  getAssistant(assistantId: string): Assistant | undefined {
    const data = this.loadChatData();
    return data.assistants[assistantId];
  }

  /**
   * 创建助手
   */
  createAssistant(assistant: Omit<Assistant, 'id' | 'messageCount'>): Assistant {
    const newAssistant: Assistant = {
      ...assistant,
      id: `assistant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      messageCount: 0,
    };

    const data = this.loadChatData();
    data.assistants[newAssistant.id] = newAssistant;
    this.saveChatData(data);

    return newAssistant;
  }

  /**
   * 更新助手
   */
  updateAssistant(assistantId: string, updates: Partial<Assistant>): Assistant | undefined {
    const data = this.loadChatData();
    const assistant = data.assistants[assistantId];

    if (assistant) {
      const updatedAssistant = { ...assistant, ...updates };
      data.assistants[assistantId] = updatedAssistant;
      this.saveChatData(data);
      return updatedAssistant;
    }
    return undefined;
  }

  /**
   * 删除助手
   */
  deleteAssistant(assistantId: string): boolean {
    const data = this.loadChatData();

    // 不能删除默认助手
    if (assistantId === 'default' || !data.assistants[assistantId]) {
      return false;
    }

    delete data.assistants[assistantId];
    this.saveChatData(data);
    return true;
  }

  /**
   * 获取设置
   */
  getSettings(): ChatSettings {
    const data = this.loadChatData();
    return data.settings;
  }

  /**
   * 更新设置
   */
  updateSettings(updates: Partial<ChatSettings>): ChatSettings {
    const data = this.loadChatData();
    data.settings = { ...data.settings, ...updates };
    this.saveChatData(data);
    return data.settings;
  }

  /**
   * 获取最后使用的话题ID
   */
  getLastTopicId(): string | undefined {
    const data = this.loadChatData();
    return data.lastTopicId;
  }

  /**
   * 设置最后使用的话题ID
   */
  setLastTopicId(topicId: string | undefined) {
    const data = this.loadChatData();
    data.lastTopicId = topicId;
    this.saveChatData(data);
  }

  /**
   * 导出聊天数据
   */
  exportChatData(): string {
    const data = this.loadChatData();
    return JSON.stringify(data, null, 2);
  }

  /**
   * 导入聊天数据
   */
  importChatData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData) as ChatStorage;
      // 验证数据结构
      if (typeof data === 'object' && data.topics && data.assistants && data.settings) {
        this.saveChatData(data);
        return true;
      }
    } catch (error) {
      console.error('导入聊天数据失败:', error);
    }
    return false;
  }

  /**
   * 清空所有数据
   */
  clearAllData() {
    localStorage.removeItem(this.storageKey);
  }
}

// 导出单例实例
export const storageService = new StorageService();
export default storageService;
