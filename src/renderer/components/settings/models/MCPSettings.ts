// MCP设置
import {MCPServerConfig} from "./MCPServerConfig";

export interface MCPSettings {
    enabled: boolean;
    servers: MCPServerConfig[];
}