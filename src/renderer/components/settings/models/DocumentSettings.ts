// 文档设置
import {DocumentItem} from "./DocumentItem";

export interface DocumentSettings {
    // OCR服务配置
    ocrProvider: string;
    ocrLanguages: string[];
    // 文档处理配置
    documentProvider: string;
    apiKey: string;
    apiUrl: string;
    // 文档列表
    documents: DocumentItem[];
    // 原有字段（保留兼容）
    autoSave: boolean;
    autoSaveInterval: number;
    defaultFormat: 'markdown' | 'html' | 'text';
    enableVersionControl: boolean;
    maxVersions: number;
}