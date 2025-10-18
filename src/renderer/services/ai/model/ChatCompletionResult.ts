import {TokenUsage} from "./TokenUsage";

/**
 * 聊天补全结果
 */
export interface ChatCompletionResult {
    success: boolean;
    content?: string;
    error?: string;
    usage?: TokenUsage;
}