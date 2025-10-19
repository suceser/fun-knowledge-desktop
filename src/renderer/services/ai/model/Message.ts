// 消息类型
export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
    tokens?: string;
    model?: string;
}