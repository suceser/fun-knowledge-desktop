# 本地持久化方案 - 文件结构说明

## 新增文件列表

### 类型定义
```
src/types/
├── storage.ts          # 存储相关类型定义（AppConfig、各种Settings接口）
└── global.d.ts         # 全局类型声明（window.electronAPI）
```

### 主进程
```
src/
├── services/
│   └── storageService.ts    # 主进程存储服务（electron-store 封装）
└── ipc/
    └── storageHandlers.ts   # IPC 处理器（注册所有存储相关的 IPC 通道）
```

### Preload 脚本
```
src/
└── preload.ts              # 更新：暴露存储 API 到渲染进程
```

### 渲染进程
```
src/renderer/
├── services/
│   └── storageService.ts   # 渲染进程存储服务（封装 IPC 调用）
├── hooks/
│   └── useStorage.ts       # React Hooks（useStorageValue 等）
└── examples/
    └── StorageExample.tsx  # 完整的使用示例组件
```

### 文档
```
docs/
├── 本地持久化方案.md                      # 完整技术文档
├── Storage-QuickStart.md                # 5分钟快速入门
├── Storage-Implementation-Summary.md    # 实施总结
└── Storage-Files.md                     # 文件结构说明（本文件）
```

## 文件依赖关系

```
main.ts
  └─> ipc/storageHandlers.ts
        └─> services/storageService.ts (主进程)
              └─> electron-store

preload.ts
  └─> types/storage.ts
  └─> types/global.d.ts

渲染进程组件
  └─> hooks/useStorage.ts
        └─> renderer/services/storageService.ts
              └─> window.electronAPI (来自 preload)
                    └─> IPC 通信
                          └─> ipc/storageHandlers.ts
```

## 文件详细说明

### 1. `src/types/storage.ts` (240 行)

**作用**: 定义所有存储相关的 TypeScript 类型

**包含内容**:
- `AppConfig` - 应用配置主接口
- `GeneralSettings` - 通用设置
- `DisplaySettings` - 显示设置
- `ModelSettings` - 模型设置
- `SearchSettings` - 搜索设置
- `ShortcutSettings` - 快捷键设置
- `DocumentSettings` - 文档设置
- `DataSettings` - 数据设置
- `MCPSettings` - MCP 设置
- `MemorySettings` - 记忆设置
- `DEFAULT_APP_CONFIG` - 默认配置
- `StorageResult<T>` - 操作结果类型

**谁使用它**: 所有文件

---

### 2. `src/types/global.d.ts` (30 行)

**作用**: 声明全局类型，让 TypeScript 知道 `window.electronAPI` 的结构

**包含内容**:
- `ElectronAPI` 接口定义
- 全局 `window` 类型扩展

**谁使用它**: 渲染进程中访问 `window.electronAPI` 的代码

---

### 3. `src/services/storageService.ts` (230 行)

**作用**: 主进程存储服务，封装 electron-store

**主要方法**:
- `get/set/delete/has` - 基础 CRUD
- `clear/reset` - 清空和重置
- `getAll/setMultiple` - 批量操作
- `export/import` - 导入导出
- `watch/addListener/removeListener` - 监听变化
- `getStorePath/getStoreSize` - 获取元信息

**特点**:
- 单例模式
- 自动初始化数据路径
- 支持配置变化监听

**谁使用它**: IPC 处理器

---

### 4. `src/ipc/storageHandlers.ts` (125 行)

**作用**: 注册所有存储相关的 IPC 处理器

**注册的通道**:
- `storage:get` - 获取配置
- `storage:set` - 设置配置
- `storage:delete` - 删除配置
- `storage:has` - 检查存在
- `storage:clear` - 清空配置
- `storage:reset` - 重置配置
- `storage:getAll` - 获取所有
- `storage:setMultiple` - 批量设置
- `storage:export` - 导出配置
- `storage:import` - 导入配置
- `storage:getStorePath` - 获取路径
- `storage:getStoreSize` - 获取大小

**特点**:
- 统一的错误处理
- 返回 `StorageResult` 格式

**谁使用它**: main.ts（注册时），preload.ts（调用时）

---

### 5. `src/preload.ts` (60 行)

**作用**: 安全地暴露存储 API 到渲染进程

**暴露的 API**:
- `window.electronAPI.storage.*` - 所有存储方法

**特点**:
- 使用 `contextBridge` 确保安全
- 完整的类型定义
- 异步 Promise 接口

**谁使用它**: Electron 自动加载到渲染进程

---

### 6. `src/renderer/services/storageService.ts` (210 行)

**作用**: 渲染进程存储服务，封装 IPC 调用

**主要方法**:
- 所有与主进程服务相同的方法
- 额外的缓存管理方法

**特点**:
- 单例模式
- 内置缓存机制（Map）
- 简化的 API（直接返回数据而非 Result）
- 自动错误日志

**谁使用它**: React Hooks 和组件

---

### 7. `src/renderer/hooks/useStorage.ts` (172 行)

**作用**: 提供 React Hooks 方便在组件中使用

**导出的 Hooks**:
- `useStorageValue<T>(key, defaultValue)` - 通用 Hook
- `useGeneralSettings()` - 通用设置
- `useDisplaySettings()` - 显示设置
- `useModelSettings()` - 模型设置
- `useSearchSettings()` - 搜索设置
- `useShortcutSettings()` - 快捷键设置
- `useDocumentSettings()` - 文档设置
- `useDataSettings()` - 数据设置
- `useMCPSettings()` - MCP 设置
- `useMemorySettings()` - 记忆设置
- `useAllConfig()` - 所有配置

**特点**:
- 返回 `[value, setValue, loading, error]` 元组
- 自动处理 loading 状态
- 自动处理错误
- 完整的类型支持

**谁使用它**: React 组件

---

### 8. `src/renderer/examples/StorageExample.tsx` (330 行)

**作用**: 完整的使用示例组件

**包含示例**:
1. 基本用法 - 主题切换
2. 通用设置 - 语言、开机启动
3. 显示设置 - 字体、自动换行
4. 配置信息 - 存储路径、大小
5. 导出/导入/重置
6. 批量更新

**特点**:
- 可运行的真实代码
- 使用 Ant Design 组件
- 完整的错误处理
- 清晰的注释

**谁使用它**: 开发者学习参考

---

## 核心流程

### 读取配置流程

```
React组件
  └─> useStorageValue('general.theme')
        └─> storageService.get('general.theme')  [渲染进程]
              └─> window.electronAPI.storage.get('general.theme')
                    └─> ipcRenderer.invoke('storage:get', 'general.theme')
                          └─> IPC 通道
                                └─> storageHandlers 处理
                                      └─> storageService.get('general.theme')  [主进程]
                                            └─> electron-store
                                                  └─> app-config.json
```

### 写入配置流程

```
React组件
  └─> setTheme('dark')
        └─> storageService.set('general.theme', 'dark')  [渲染进程]
              └─> window.electronAPI.storage.set('general.theme', 'dark')
                    └─> ipcRenderer.invoke('storage:set', 'general.theme', 'dark')
                          └─> IPC 通道
                                └─> storageHandlers 处理
                                      └─> storageService.set('general.theme', 'dark')  [主进程]
                                            └─> electron-store
                                                  └─> app-config.json (自动保存)
```

## 文件大小统计

| 文件 | 行数 | 大小 | 类型 |
|------|------|------|------|
| `src/types/storage.ts` | 240 | ~7KB | 类型定义 |
| `src/types/global.d.ts` | 30 | ~1KB | 类型定义 |
| `src/services/storageService.ts` | 230 | ~8KB | 主进程服务 |
| `src/ipc/storageHandlers.ts` | 125 | ~4KB | IPC 处理器 |
| `src/preload.ts` | 60 | ~2KB | Preload 脚本 |
| `src/renderer/services/storageService.ts` | 210 | ~7KB | 渲染进程服务 |
| `src/renderer/hooks/useStorage.ts` | 172 | ~6KB | React Hooks |
| `src/renderer/examples/StorageExample.tsx` | 330 | ~11KB | 示例代码 |
| **总计** | **1,397** | **~46KB** | - |

## 修改的现有文件

- `src/main.ts` - 添加了 2 行（导入和注册 IPC 处理器）
- `package.json` - 添加了 1 个依赖（electron-store）

## 配置文件（运行时生成）

```
~/Library/Application Support/fun-knowledge-desktop/
└── app-config.json                 # 实际存储的配置文件（~2-10KB）
```

## 使用建议

### 快速上手
1. 先看 `docs/Storage-QuickStart.md`
2. 运行 `StorageExample.tsx` 中的示例
3. 在实际组件中使用 Hooks

### 深入了解
1. 阅读 `docs/本地持久化方案.md`
2. 查看具体实现代码
3. 根据需求扩展功能

### 添加新功能
1. 修改 `src/types/storage.ts` 添加新类型
2. 更新 `DEFAULT_APP_CONFIG` 添加默认值
3. 可选：添加新的专用 Hook

---

**提示**: 所有文件都有详细的注释，建议阅读源码了解细节。

