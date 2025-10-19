// 话题类型
import {Message} from "./Message";

export interface Topic {
    id: string;
    title: string;
    assistantId: string;
    messages: Message[];
    createdAt: string;
    updatedAt: string;
}
