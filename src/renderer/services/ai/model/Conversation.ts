// 对话历史类型（已废弃，使用Topic代替）
import {Message} from "./Message";

export interface Conversation {
    assistantId: string;
    messages: Message[];
}
