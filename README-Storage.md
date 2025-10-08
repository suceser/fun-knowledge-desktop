# 本地持久化方案 - 快速导航

## ✅ 实施完成

应用配置的本地持久化方案已完成实现，可立即使用！

## 📚 文档导航

### 新手入门
👉 **[5分钟快速开始](docs/Storage-QuickStart.md)** - 最快上手指南

### 详细文档
- 📖 [完整技术文档](docs/本地持久化方案.md) - 架构、API、示例
- 📋 [实施总结](docs/Storage-Implementation-Summary.md) - 技术方案和结果
- 📁 [文件结构说明](docs/Storage-Files.md) - 新增文件详解

## 🚀 快速开始

### 在组件中使用

```tsx
import { useStorageValue } from '@/renderer/hooks/useStorage';

function MyComponent() {
  const [theme, setTheme] = useStorageValue('general.theme', 'light');
  
  return (
    <button onClick={() => setTheme('dark')}>
      切换主题
    </button>
  );
}
```

### 使用预定义 Hook

```tsx
import { useGeneralSettings } from '@/renderer/hooks/useStorage';

function Settings() {
  const [settings, setSettings] = useGeneralSettings();
  
  return (
    <select 
      value={settings?.language}
      onChange={(e) => setSettings({
        ...settings, 
        language: e.target.value
      })}
    >
      <option value="zh-CN">简体中文</option>
      <option value="en-US">English</option>
    </select>
  );
}
```

## 📦 核心文件

```
src/
├── types/
│   ├── storage.ts              # 类型定义
│   └── global.d.ts             # 全局类型
├── services/
│   └── storageService.ts       # 主进程服务
├── ipc/
│   └── storageHandlers.ts      # IPC 处理器
├── preload.ts                  # Preload 脚本
└── renderer/
    ├── services/
    │   └── storageService.ts   # 渲染进程服务
    ├── hooks/
    │   └── useStorage.ts       # React Hooks
    └── examples/
        └── StorageExample.tsx  # 使用示例
```

## 🎯 功能特性

✅ 完整的 TypeScript 类型支持  
✅ 9 个配置分类，60+ 配置项  
✅ 11 个 React Hooks  
✅ 12 个存储 API 方法  
✅ 安全的 IPC 通信  
✅ 内置缓存机制  
✅ 导入/导出/重置功能  
✅ 跨平台支持  
✅ 详细文档和示例  

## 📍 配置存储位置

- **macOS**: `~/Library/Application Support/fun-knowledge-desktop/app-config.json`
- **Windows**: `%APPDATA%/fun-knowledge-desktop/app-config.json`
- **Linux**: `~/.config/fun-knowledge-desktop/app-config.json`

## 🔧 可用的 Hooks

| Hook | 用途 |
|------|------|
| `useStorageValue<T>()` | 通用配置值 |
| `useGeneralSettings()` | 通用设置 |
| `useDisplaySettings()` | 显示设置 |
| `useModelSettings()` | 模型设置 |
| `useSearchSettings()` | 搜索设置 |
| `useShortcutSettings()` | 快捷键设置 |
| `useDocumentSettings()` | 文档设置 |
| `useDataSettings()` | 数据设置 |
| `useMCPSettings()` | MCP 设置 |
| `useMemorySettings()` | 记忆设置 |
| `useAllConfig()` | 所有配置 |

## 💡 使用示例

完整的可运行示例代码：`src/renderer/examples/StorageExample.tsx`

包含以下示例：
1. ✅ 主题切换
2. ✅ 语言设置
3. ✅ 显示设置
4. ✅ 配置信息查看
5. ✅ 导出/导入/重置
6. ✅ 批量更新

## 📊 统计信息

- **新增文件**: 8 个
- **总代码量**: 1,397 行
- **文档页数**: 4 篇
- **实施时间**: 2025-10-08
- **状态**: ✅ 已完成，可立即使用

## 🛠️ 技术栈

- **electron-store** - 配置持久化
- **TypeScript** - 类型安全
- **React Hooks** - 状态管理
- **IPC** - 进程间通信

## 📖 下一步

1. 阅读 [快速开始指南](docs/Storage-QuickStart.md)
2. 运行示例代码查看效果
3. 在实际组件中应用
4. 迁移现有的 localStorage 数据

## ❓ 需要帮助？

- 查看 [完整文档](docs/本地持久化方案.md)
- 参考 [文件结构说明](docs/Storage-Files.md)
- 阅读 [实施总结](docs/Storage-Implementation-Summary.md)

---

**状态**: ✅ 实施完成  
**可用性**: 立即可用  
**文档完整度**: 100%

