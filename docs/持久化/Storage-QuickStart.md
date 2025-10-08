# 本地持久化快速开始

## 快速概览

本应用使用 `electron-store` 实现配置的本地持久化，提供了简洁的 API 和完整的类型支持。

## 5 分钟上手

### 1. 在 React 组件中使用（最简单）

```tsx
import { useStorageValue } from '@/renderer/hooks/useStorage';

function MyComponent() {
  const [theme, setTheme] = useStorageValue('general.theme', 'light');
  
  return (
    <button onClick={() => setTheme('dark')}>
      切换到深色模式
    </button>
  );
}
```

### 2. 使用预定义的设置 Hook

```tsx
import { useGeneralSettings } from '@/renderer/hooks/useStorage';

function SettingsPanel() {
  const [settings, setSettings, loading] = useGeneralSettings();
  
  if (loading) return <div>加载中...</div>;
  
  return (
    <div>
      <p>当前语言: {settings?.language}</p>
      <button onClick={() => setSettings({ 
        ...settings, 
        language: 'en-US' 
      })}>
        切换到英文
      </button>
    </div>
  );
}
```

### 3. 直接使用服务（高级）

```tsx
import { storageService } from '@/renderer/services/storageService';

async function updateTheme() {
  await storageService.set('general.theme', 'dark');
  const theme = await storageService.get('general.theme');
  console.log(theme); // 'dark'
}
```

## 可用的配置分类

| 分类 | Hook | 说明 |
|------|------|------|
| 通用设置 | `useGeneralSettings()` | 语言、主题、启动选项 |
| 显示设置 | `useDisplaySettings()` | 字体、行高、编辑器选项 |
| 模型设置 | `useModelSettings()` | AI 模型提供商配置 |
| 搜索设置 | `useSearchSettings()` | 搜索相关配置 |
| 快捷键 | `useShortcutSettings()` | 全局快捷键配置 |
| 文档设置 | `useDocumentSettings()` | 文档自动保存等 |
| 数据设置 | `useDataSettings()` | 数据目录配置 |
| MCP 设置 | `useMCPSettings()` | MCP 服务器配置 |
| 记忆设置 | `useMemorySettings()` | 记忆功能配置 |

## 常用操作

### 获取单个配置

```tsx
const [value, setValue] = useStorageValue<string>('general.theme');
```

### 更新配置

```tsx
await setValue('dark');
```

### 批量更新

```tsx
await storageService.setMultiple({
  general: { theme: 'dark', language: 'zh-CN' },
  display: { fontSize: 16 }
});
```

### 导出配置

```tsx
const json = await storageService.export();
// 保存到文件或分享
```

### 导入配置

```tsx
await storageService.import(json);
```

### 重置配置

```tsx
await storageService.reset();
```

## 配置存储位置

- **macOS**: `~/Library/Application Support/fun-knowledge-desktop/app-config.json`
- **Windows**: `%APPDATA%/fun-knowledge-desktop/app-config.json`
- **Linux**: `~/.config/fun-knowledge-desktop/app-config.json`

## 类型安全

所有配置都有完整的 TypeScript 类型定义：

```typescript
import { AppConfig, GeneralSettings } from '@/types/storage';

// 类型安全的配置访问
const config: AppConfig = await storageService.getAll();
const general: GeneralSettings = config.general;
```

## 示例代码

完整的使用示例请查看：
- 📄 `src/renderer/examples/StorageExample.tsx` - 实际组件示例
- 📚 `docs/本地持久化方案.md` - 详细文档

## 最佳实践

1. ✅ 使用 Hook 在组件中管理配置（推荐）
2. ✅ 使用批量更新减少 IPC 调用
3. ✅ 为配置值提供默认值
4. ✅ 处理 loading 和 error 状态
5. ❌ 避免在循环中调用存储 API
6. ❌ 避免存储大量数据（使用数据库代替）

## 下一步

- 查看完整文档：`docs/本地持久化方案.md`
- 运行示例代码：将 `StorageExamplePage` 添加到路由
- 在实际项目中应用：替换现有的 localStorage 调用

## 需要帮助？

查看以下文件：
- `src/types/storage.ts` - 完整的类型定义
- `src/renderer/hooks/useStorage.ts` - Hook 实现
- `src/renderer/services/storageService.ts` - 服务实现

