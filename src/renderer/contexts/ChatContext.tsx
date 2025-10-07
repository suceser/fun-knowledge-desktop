import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Assistant, Conversation, Message, Topic } from '../types/assistant';

interface ChatContextType {
  // 助手相关
  assistants: Assistant[];
  currentAssistant: Assistant | null;
  addAssistant: (assistant: Omit<Assistant, 'id' | 'createdAt'>) => void;
  updateAssistant: (id: string, updates: Partial<Assistant>) => void;
  deleteAssistant: (id: string) => void;
  setCurrentAssistant: (assistant: Assistant) => void;

  // 话题相关
  topics: Topic[];
  currentTopic: Topic | null;
  addTopic: (title: string, assistantId: string) => void;
  deleteTopic: (topicId: string) => void;
  setCurrentTopic: (topic: Topic) => void;
  updateTopicTitle: (topicId: string, title: string) => void;

  // 对话相关（兼容旧代码）
  conversations: Record<string, Conversation>;
  currentMessages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearCurrentConversation: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// 默认助手数据
const defaultAssistants: Assistant[] = [
  {
    id: '1',
    name: '默认助手',
    description: '通用的AI助手',
    icon: '🤖',
    systemPrompt: '你是一个友好、专业的AI助手，能够回答各种问题并提供帮助。',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: '策略产品经理',
    description: '专业的产品策略顾问',
    icon: '💼',
    systemPrompt: '你是一名资深的策略产品经理，擅长产品规划、需求分析和策略制定。你对市场趋势和用户需求有深刻的理解。',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: '商家运营',
    description: '电商运营专家',
    icon: '🛒',
    systemPrompt: '你是一位经验丰富的电商运营专家，精通店铺运营、营销推广、数据分析等各个方面。',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: '社群运营',
    description: '社群管理与运营',
    icon: '👥',
    systemPrompt: '你是一名专业的社群运营专家，擅长社群建设、用户维护、活动策划等工作。',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: '市场营销',
    description: '市场策略与营销',
    icon: '📊',
    systemPrompt: '你是一名专业的市场营销专家，你对营销策略和品牌推广有着深厚的理解，擅长通过心理学原理影响购买行为。',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: '要点精炼',
    description: '内容提炼与总结',
    icon: '✨',
    systemPrompt: '你是一个内容提炼专家，擅长从长文本中提取关键信息，总结要点，用简洁的语言表达复杂的内容。',
    createdAt: new Date().toISOString(),
  },
];

// 从localStorage加载话题
const loadTopicsFromStorage = (): Topic[] => {
  try {
    const stored = localStorage.getItem('chat_topics');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load topics from storage:', error);
    return [];
  }
};

// 保存话题到localStorage
const saveTopicsToStorage = (topics: Topic[]) => {
  try {
    localStorage.setItem('chat_topics', JSON.stringify(topics));
  } catch (error) {
    console.error('Failed to save topics to storage:', error);
  }
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assistants, setAssistants] = useState<Assistant[]>(defaultAssistants);
  const [currentAssistant, setCurrentAssistant] = useState<Assistant | null>(null); // 默认不选中
  const [conversations, setConversations] = useState<Record<string, Conversation>>({});

  // 话题管理 - 从localStorage加载
  const [topics, setTopics] = useState<Topic[]>(() => loadTopicsFromStorage());
  const [currentTopic, setCurrentTopicState] = useState<Topic | null>(null);

  // 添加助手
  const addAssistant = (assistant: Omit<Assistant, 'id' | 'createdAt'>) => {
    const newAssistant: Assistant = {
      ...assistant,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setAssistants([...assistants, newAssistant]);
  };

  // 更新助手
  const updateAssistant = (id: string, updates: Partial<Assistant>) => {
    setAssistants(assistants.map(a =>
      a.id === id ? { ...a, ...updates } : a
    ));

    // 如果更新的是当前助手，也更新当前助手
    if (currentAssistant?.id === id) {
      setCurrentAssistant({ ...currentAssistant, ...updates });
    }
  };

  // 删除助手
  const deleteAssistant = (id: string) => {
    setAssistants(assistants.filter(a => a.id !== id));

    // 如果删除的是当前助手，切换到默认助手
    if (currentAssistant?.id === id) {
      const defaultAssistant = assistants.find(a => a.isDefault);
      setCurrentAssistant(defaultAssistant || assistants[0]);
    }
  };

  // 添加话题
  const addTopic = (title: string, assistantId: string) => {
    const newTopic: Topic = {
      id: Date.now().toString(),
      title,
      assistantId,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTopics(prev => {
      const updated = [newTopic, ...prev];
      saveTopicsToStorage(updated);
      return updated;
    });
    setCurrentTopicState(newTopic);
  };

  // 删除话题
  const deleteTopic = (topicId: string) => {
    setTopics(prev => {
      const updated = prev.filter(t => t.id !== topicId);
      saveTopicsToStorage(updated);
      return updated;
    });

    // 如果删除的是当前话题，清空当前话题
    if (currentTopic?.id === topicId) {
      setCurrentTopicState(null);
    }
  };

  // 设置当前话题
  const setCurrentTopic = (topic: Topic | null) => {
    setCurrentTopicState(topic);
    // 切换话题时，也切换对应的助手
    if (topic) {
      const assistant = assistants.find(a => a.id === topic.assistantId);
      if (assistant) {
        setCurrentAssistant(assistant);
      }
    }
  };

  // 更新话题标题
  const updateTopicTitle = (topicId: string, title: string) => {
    setTopics(prev => {
      const updated = prev.map(t =>
        t.id === topicId
          ? { ...t, title, updatedAt: new Date().toISOString() }
          : t
      );
      saveTopicsToStorage(updated);
      return updated;
    });

    if (currentTopic?.id === topicId) {
      setCurrentTopicState(prev => prev ? { ...prev, title } : null);
    }
  };

  // 获取当前对话消息（只使用话题消息）
  const currentMessages = currentTopic ? currentTopic.messages : [];

  // 添加消息（统一使用话题管理）
  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    // 如果没有当前话题，自动创建一个
    if (!currentTopic && currentAssistant) {
      const newTopic: Topic = {
        id: Date.now().toString(),
        title: '新话题',
        assistantId: currentAssistant.id,
        messages: [newMessage],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setTopics(prev => {
        const updated = [newTopic, ...prev];
        saveTopicsToStorage(updated);
        return updated;
      });
      setCurrentTopicState(newTopic);
      return;
    }

    if (currentTopic) {
      // 添加到当前话题
      setTopics(prev => {
        const updated = prev.map(t => {
          if (t.id !== currentTopic.id) return t;

          const updatedMessages = [...t.messages, newMessage];

          // 自动更新标题：使用第一条用户消息的内容
          let newTitle = t.title;
          if (t.title === '新话题' && message.role === 'user' && updatedMessages.length === 1) {
            newTitle = message.content.slice(0, 20) + (message.content.length > 20 ? '...' : '');
          }

          return {
            ...t,
            messages: updatedMessages,
            title: newTitle,
            updatedAt: new Date().toISOString(),
          };
        });

        saveTopicsToStorage(updated);
        return updated;
      });

      // 更新当前话题状态
      setCurrentTopicState(prev => {
        if (!prev) return null;

        const updatedMessages = [...prev.messages, newMessage];
        let newTitle = prev.title;

        if (prev.title === '新话题' && message.role === 'user' && updatedMessages.length === 1) {
          newTitle = message.content.slice(0, 20) + (message.content.length > 20 ? '...' : '');
        }

        return {
          ...prev,
          messages: updatedMessages,
          title: newTitle,
          updatedAt: new Date().toISOString(),
        };
      });
    }
  };

  // 清空当前对话
  const clearCurrentConversation = () => {
    if (currentTopic) {
      setTopics(prev => {
        const updated = prev.map(t =>
          t.id === currentTopic.id
            ? { ...t, messages: [], updatedAt: new Date().toISOString() }
            : t
        );
        saveTopicsToStorage(updated);
        return updated;
      });
      setCurrentTopicState(prev => prev ? { ...prev, messages: [] } : null);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        assistants,
        currentAssistant,
        addAssistant,
        updateAssistant,
        deleteAssistant,
        setCurrentAssistant,
        topics,
        currentTopic,
        addTopic,
        deleteTopic,
        setCurrentTopic,
        updateTopicTitle,
        conversations,
        currentMessages,
        addMessage,
        clearCurrentConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

