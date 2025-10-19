// 文档项
export interface DocumentItem {
    id: string;
    name: string;
    size: string;
    status: 'processing' | 'completed' | 'error';
    progress: number;
    type: string;
}