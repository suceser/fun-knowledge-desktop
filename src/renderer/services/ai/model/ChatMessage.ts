/**
 * 聊天消息
 */
export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
