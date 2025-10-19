export interface MCPServerConfig {
    id: string;
    name: string;
    command: string;
    args: string[];
    env?: Record<string, string>;
    enabled: boolean;
}