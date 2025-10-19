// 快捷键设置
import {ShortcutItem} from "./ShortcutItem";

export interface ShortcutSettings {
    // 新增：快捷键列表
    shortcuts: ShortcutItem[];
    // 原有字段（保留兼容）
    globalShortcut: string;
    newNote: string;
    search: string;
    quickCapture: string;
    toggleSidebar: string;
}
