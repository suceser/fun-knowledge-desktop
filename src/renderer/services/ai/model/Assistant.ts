// 助手类型定义
export interface Assistant {
    id: string;
    name: string;
    description: string;
    icon: string;
    systemPrompt: string;
    isDefault?: boolean;
    createdAt: string;
}