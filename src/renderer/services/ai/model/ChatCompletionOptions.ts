import {ChatMessage} from "./ChatMessage";

/**
 * 聊天补全选项
 */
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