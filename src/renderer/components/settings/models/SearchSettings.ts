// 搜索设置（网络搜索）
export interface SearchSettings {
    // 搜索服务商配置
    searchProvider: string; // 搜索服务商名称
    apiKey: string;
    apiUrl: string;
    // 搜索配置
    includeAnswer: boolean;
    maxResults: number;
    compressionMethod: '不压缩' | '智能压缩' | '高度压缩';
    // 网站黑名单
    blacklistSites: string[];
    // 原有字段（保留兼容）
    enableFullTextSearch: boolean;
    enableSemanticSearch: boolean;
    indexingEnabled: boolean;
}
