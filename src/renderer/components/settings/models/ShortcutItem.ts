// 快捷键项
export interface ShortcutItem {
    id: string;
    name: string;
    description: string;
    defaultKey: string;
    currentKey: string;
    category: string;
    enabled: boolean;
}