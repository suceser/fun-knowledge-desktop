/**
 * API 响应数据结构
 */
export interface ApiResponse {
    choices?: Array<{
        message?: {
            content?: string;
        };
        delta?: {
            content?: string;
        };
    }>;
    usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
    };
    error?: string | {
        message?: string;
    };
    message?: string;
}