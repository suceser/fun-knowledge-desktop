// 显示设置
export interface DisplaySettings {
    // 主题设置
    theme: '浅色' | '深色' | '系统';
    themeColor: string;
    transparentWindow: boolean;
    // 导航栏设置
    navbarPosition: '左侧' | '顶部';
    // 缩放设置
    zoomLevel: number;
    // 话题设置
    topicPosition: '左侧' | '右侧';
    autoSwitchTopic: boolean;
    showTopicTime: boolean;
    pinTopicTop: boolean;
    // 助手设置
    modelIconType: '模型图标' | 'Emoji 表情' | '不显示';
    // 原有字段（保留兼容）
    fontSize: number;
    fontFamily: string;
    lineHeight: number;
    showLineNumbers: boolean;
    showMinimap: boolean;
    wordWrap: boolean;
    cursorStyle: 'line' | 'block' | 'underline';
}