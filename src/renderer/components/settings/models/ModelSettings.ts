// 模型设置
import {ProviderConfig} from "./ProviderConfig";

export interface ModelSettings {
    providers: Record<string, ProviderConfig>;
    defaultProvider: string;
    defaultModel: string;
}