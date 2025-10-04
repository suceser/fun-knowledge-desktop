// 聊天状态管理Hook
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Message,
  Topic,
  Assistant,
  ModelProvider,
  ChatState,
  ChatSettings,
  AIRequest
} from '../types/ai';
import { aiService } from '../services/aiService';
import { storageService } from '../services/storageService';

export interface ChatStateHook {
  // 当前状态
  currentTopic: Topic | undefined;
  currentAssistant: Assistant | undefined;
  topics: Topic[];
  assistants: Assistant[];
  providers: ModelProvider[];
  settings: ChatSettings;
  chatState: ChatState;

  // 话题管理
  createTopic: (title?: string, assistantId?: string) => Promise<Topic>;
  switchTopic: (topicId: string) => void;
  deleteTopic: (topicId: string) => Promise<boolean>;
  renameTopic: (topicId: string, newTitle: string) => Promise<boolean>;
  clearTopicMessages: (topicId: string) => Promise<boolean>;

  // 消息管理
  sendMessage: (content: string, attachments?: any[]) => Promise<void>;
  resendMessage: (messageId: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<boolean>;
  editMessage: (messageId: string, newContent: string) => Promise<boolean>;

  // 助手管理
  switchAssistant: (assistantId: string) => void;
  updateAssistant: (assistantId: string, updates: Partial<Assistant>) => Promise<boolean>;

  // 设置管理
  updateSettings: (updates: Partial<ChatSettings>) => void;

  // 工具方法
  refresh: () => void;
  isLoading: boolean;
  error: string | undefined;
}

export function useChatState(): ChatStateHook {
  // 基础状态
  const [topics, setTopics] = useState<Topic[]>([]);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [providers, setProviders] = useState<ModelProvider[]>([]);
  const [settings, setSettings] = useState<ChatSettings | null>(null);
  const [chatState, setChatState] = useState<ChatState>({
    currentAssistantId: 'default',
    isLoading: false,
  });

  // 引用，用于流式响应
  const streamingController = useRef<AbortController | null>(null);

  // 计算当前话题和助手
  const currentTopic = topics.find(t => t.id === chatState.currentTopicId);
  const currentAssistant = assistants.find(a => a.id === chatState.currentAssistantId);

  // 初始化
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = useCallback(async () => {
    try {
      setChatState(prev => ({ ...prev, isLoading: true, error: undefined }));

      // 初始化AI服务
      aiService.initialize();

      // 加载数据
      const loadedSettings = storageService.getSettings();
      const loadedTopics = storageService.getTopics();
      const loadedAssistants = storageService.getAssistants();
      const loadedProviders = aiService.getProviders();

      setSettings(loadedSettings);
      setTopics(loadedTopics);
      setAssistants(loadedAssistants);
      setProviders(loadedProviders);

      // 设置当前话题
      const lastTopicId = storageService.getLastTopicId();
      if (lastTopicId && loadedTopics.find(t => t.id === lastTopicId)) {
        setChatState(prev => ({ ...prev, currentTopicId: lastTopicId }));
      } else if (loadedTopics.length > 0) {
        setChatState(prev => ({ ...prev, currentTopicId: loadedTopics[0].id }));
      }

      // 设置当前助手
      setChatState(prev => ({
        ...prev,
        currentAssistantId: loadedSettings.defaultAssistantId,
      }));
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '初始化失败',
      }));
    } finally {
      setChatState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // 刷新数据
  const refresh = useCallback(() => {
    const refreshedTopics = storageService.getTopics();
    const refreshedAssistants = storageService.getAssistants();
    const refreshedProviders = aiService.getProviders();
    const refreshedSettings = storageService.getSettings();

    setTopics(refreshedTopics);
    setAssistants(refreshedAssistants);
    setProviders(refreshedProviders);
    setSettings(refreshedSettings);
  }, []);

  // 创建话题
  const createTopic = useCallback(async (title?: string, assistantId?: string): Promise<Topic> => {
    const topicTitle = title || `新对话 ${new Date().toLocaleDateString()}`;
    const selectedAssistantId = assistantId || chatState.currentAssistantId;

    const newTopic = storageService.createTopic(topicTitle, selectedAssistantId);

    // 更新状态
    setTopics(prev => [newTopic, ...prev]);
    setChatState(prev => ({ ...prev, currentTopicId: newTopic.id }));

    return newTopic;
  }, [chatState.currentAssistantId]);

  // 切换话题
  const switchTopic = useCallback((topicId: string) => {
    setChatState(prev => ({ ...prev, currentTopicId: topicId }));
    storageService.setLastTopicId(topicId);
  }, []);

  // 删除话题
  const deleteTopic = useCallback(async (topicId: string): Promise<boolean> => {
    const success = storageService.deleteTopic(topicId);

    if (success) {
      setTopics(prev => prev.filter(t => t.id !== topicId));

      // 如果删除的是当前话题，切换到其他话题
      if (chatState.currentTopicId === topicId) {
        const remainingTopics = topics.filter(t => t.id !== topicId);
        if (remainingTopics.length > 0) {
          setChatState(prev => ({ ...prev, currentTopicId: remainingTopics[0].id }));
        } else {
          setChatState(prev => ({ ...prev, currentTopicId: undefined }));
        }
      }
    }

    return success;
  }, [topics, chatState.currentTopicId]);

  // 重命名话题
  const renameTopic = useCallback(async (topicId: string, newTitle: string): Promise<boolean> => {
    const updatedTopic = storageService.updateTopic(topicId, { title: newTitle });

    if (updatedTopic) {
      setTopics(prev => prev.map(t => t.id === topicId ? updatedTopic : t));
      return true;
    }

    return false;
  }, []);

  // 清空话题消息
  const clearTopicMessages = useCallback(async (topicId: string): Promise<boolean> => {
    const success = storageService.clearTopicMessages(topicId);

    if (success) {
      setTopics(prev => prev.map(t =>
        t.id === topicId ? { ...t, messages: [], messageCount: 0, lastMessage: undefined } : t
      ));
    }

    return success;
  }, []);

  // 发送消息
  const sendMessage = useCallback(async (content: string, attachments?: any[]) => {
    if (!currentTopic || !currentAssistant || !settings) {
      throw new Error('缺少必要的聊天环境');
    }

    // 创建用户消息
    const userMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
      attachments,
    };

    // 添加到话题
    const updatedTopic = storageService.addMessage(currentTopic.id, userMessage);
    if (updatedTopic) {
      setTopics(prev => prev.map(t => t.id === currentTopic.id ? updatedTopic : t));
    }

    // 准备AI请求
    setChatState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      // 取消之前的流式请求
      if (streamingController.current) {
        streamingController.current.abort();
      }

      // 获取上下文消息
      const contextMessages = storageService.getContextMessages(currentTopic.id, settings.contextCount);
      const allMessages = [...contextMessages, userMessage];

      // 获取当前使用的模型
      const currentProvider = providers.find(p => p.id === settings.defaultProviderId);
      const currentModel = currentProvider?.models.find(m => m.id === settings.defaultModelId);

      if (!currentProvider || !currentModel) {
        throw new Error('当前模型配置无效');
      }

      const aiRequest: AIRequest = {
        messages: allMessages,
        model: currentModel.id,
        providerId: currentProvider.id,
        temperature: currentAssistant.settings?.temperature,
        maxTokens: currentAssistant.settings?.maxTokens,
        stream: settings.enableStream,
        systemPrompt: currentAssistant.systemPrompt,
      };

      // 创建助手消息占位符
      const assistantMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        model: currentModel.displayName,
      };

      // 添加到话题
      const topicWithAssistantMsg = storageService.addMessage(currentTopic.id, assistantMessage);
      if (topicWithAssistantMsg) {
        setTopics(prev => prev.map(t => t.id === currentTopic.id ? topicWithAssistantMsg : t));
        setChatState(prev => ({ ...prev, streamingMessageId: assistantMessage.id }));
      }

      if (settings.enableStream) {
        // 流式响应
        streamingController.current = new AbortController();
        let fullContent = '';

        for await (const response of aiService.sendStreamRequest(aiRequest)) {
          if (streamingController.current.signal.aborted) {
            break;
          }

          if (response.error) {
            throw new Error(response.error);
          }

          fullContent += response.content;

          // 更新消息内容
          storageService.updateMessage(currentTopic.id, assistantMessage.id, {
            content: fullContent,
            tokenCount: response.usage?.totalTokens,
          });

          // 更新UI
          setTopics(prev => prev.map(t => {
            if (t.id === currentTopic.id) {
              return {
                ...t,
                messages: t.messages.map(m =>
                  m.id === assistantMessage.id ? { ...m, content: fullContent } : m
                ),
                lastMessage: { ...assistantMessage, content: fullContent },
              };
            }
            return t;
          }));
        }
      } else {
        // 非流式响应
        const response = await aiService.sendRequest(aiRequest);

        if (response.error) {
          throw new Error(response.error);
        }

        // 更新助手消息
        storageService.updateMessage(currentTopic.id, assistantMessage.id, {
          content: response.content,
          tokenCount: response.usage?.totalTokens,
        });

        // 更新UI
        setTopics(prev => prev.map(t => {
          if (t.id === currentTopic.id) {
            return {
              ...t,
              messages: t.messages.map(m =>
                m.id === assistantMessage.id ? { ...m, content: response.content } : m
              ),
              lastMessage: { ...assistantMessage, content: response.content },
            };
          }
          return t;
        }));
      }

    } catch (error) {
      // 删除失败的助手消息
      storageService.deleteMessage(currentTopic.id, userMessage.id);
      setTopics(prev => prev.map(t =>
        t.id === currentTopic.id ?
          { ...t, messages: t.messages.filter(m => m.id !== userMessage.id) } :
          t
      ));

      setChatState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '发送消息失败',
      }));
    } finally {
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        streamingMessageId: undefined
      }));
      streamingController.current = null;
    }
  }, [currentTopic, currentAssistant, settings, providers]);

  // 重新发送消息
  const resendMessage = useCallback(async (messageId: string): Promise<void> => {
    if (!currentTopic) return;

    const message = currentTopic.messages.find(m => m.id === messageId);
    if (message && message.role === 'user') {
      await sendMessage(message.content, message.attachments);
    }
  }, [currentTopic, sendMessage]);

  // 删除消息
  const deleteMessage = useCallback(async (messageId: string): Promise<boolean> => {
    if (!currentTopic) return false;

    const success = storageService.deleteMessage(currentTopic.id, messageId);

    if (success) {
      const updatedTopic = storageService.getTopic(currentTopic.id);
      if (updatedTopic) {
        setTopics(prev => prev.map(t => t.id === currentTopic.id ? updatedTopic : t));
      }
    }

    return success;
  }, [currentTopic]);

  // 编辑消息
  const editMessage = useCallback(async (messageId: string, newContent: string): Promise<boolean> => {
    if (!currentTopic) return false;

    const updatedMessage = storageService.updateMessage(currentTopic.id, messageId, {
      content: newContent,
    });

    if (updatedMessage) {
      const updatedTopic = storageService.getTopic(currentTopic.id);
      if (updatedTopic) {
        setTopics(prev => prev.map(t => t.id === currentTopic.id ? updatedTopic : t));
      }
      return true;
    }

    return false;
  }, [currentTopic]);

  // 切换助手
  const switchAssistant = useCallback((assistantId: string) => {
    setChatState(prev => ({ ...prev, currentAssistantId: assistantId }));
    // 也可以更新设置中的默认助手
    if (settings) {
      storageService.updateSettings({ defaultAssistantId: assistantId });
      setSettings(prev => prev ? { ...prev, defaultAssistantId: assistantId } : null);
    }
  }, [settings]);

  // 更新助手
  const updateAssistant = useCallback(async (assistantId: string, updates: Partial<Assistant>): Promise<boolean> => {
    const updatedAssistant = storageService.updateAssistant(assistantId, updates);

    if (updatedAssistant) {
      setAssistants(prev => prev.map(a => a.id === assistantId ? updatedAssistant : a));
      return true;
    }

    return false;
  }, []);

  // 更新设置
  const updateSettings = useCallback((updates: Partial<ChatSettings>) => {
    const updatedSettings = storageService.updateSettings(updates);
    setSettings(updatedSettings);
  }, []);

  return {
    // 当前状态
    currentTopic,
    currentAssistant,
    topics,
    assistants,
    providers,
    settings: settings || storageService.getSettings(),
    chatState,

    // 话题管理
    createTopic,
    switchTopic,
    deleteTopic,
    renameTopic,
    clearTopicMessages,

    // 消息管理
    sendMessage,
    resendMessage,
    deleteMessage,
    editMessage,

    // 助手管理
    switchAssistant,
    updateAssistant,

    // 设置管理
    updateSettings,

    // 工具方法
    refresh,
    isLoading: chatState.isLoading,
    error: chatState.error,
  };
}
