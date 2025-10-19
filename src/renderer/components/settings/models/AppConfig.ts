// 应用配置
import {GeneralSettings} from "./GeneralSettings";
import {DisplaySettings} from "./DisplaySettings";
import {ModelSettings} from "./ModelSettings";
import {SearchSettings} from "./SearchSettings";
import {ShortcutSettings} from "./ShortcutSettings";
import {DocumentSettings} from "./DocumentSettings";
import {DataSettings} from "./DataSettings";
import {MCPSettings} from "./MCPSettings";
import {MemorySettings} from "./MemorySettings";

export interface AppConfig {
    // 通用设置
    general: GeneralSettings;
    // 显示设置
    display: DisplaySettings;
    // 模型设置
    models: ModelSettings;
    // 搜索设置
    search: SearchSettings;
    // 快捷键设置
    shortcuts: ShortcutSettings;
    // 文档设置
    document: DocumentSettings;
    // 数据设置
    data: DataSettings;
    // MCP设置
    mcp: MCPSettings;
    // 记忆设置
    memory: MemorySettings;
}