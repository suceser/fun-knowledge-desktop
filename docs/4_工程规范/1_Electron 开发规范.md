# Electron 应用开发规范

## 一 架构设计

1. 理解三种进程：主进程（应用管理）、预加载脚本（安全桥梁）、渲染进程（UI 展示）
2. 主进程代码放在 `src/main/`，渲染进程代码放在 `src/renderer/`，IPC 处理器放在 `src/ipc/`
3. 业务逻辑放在主进程，UI 逻辑放在渲染进程，通过 IPC 通信

## 二 进程通信（IPC）

1. 渲染进程调用主进程使用 `ipcRenderer.invoke` 和 `ipcMain.handle`
2. 主进程向渲染进程广播使用 `webContents.send`
3. 必须使用 `contextBridge.exposeInMainWorld` 安全暴露 API 
4. IPC 处理器按功能模块化，创建独立的 handler 文件 
5. 为暴露的 API 创建完整的 TypeScript 类型定义 
6. 渲染进程通过 `window.electronAPI` 调用主进程功能

## 三 安全性（重要）

1. 必须设置 `nodeIntegration: false`（禁用渲染进程中的 Node.js） 
2. 必须设置 `contextIsolation: true`（启用上下文隔离） 
3. 必须设置 `enableRemoteModule: false`（禁用远程模块） 
4. 启用 `sandbox: true` 和 `webSecurity: true`
5. 在 HTML 中添加内容安全策略（CSP） 
6. 禁止直接暴露 `ipcRenderer` 到渲染进程 
7. 验证所有来自渲染进程的输入参数 
8. 规范化文件路径，防止路径遍历攻击 
9. 限制外部内容加载，使用 `will-navigate` 事件拦截 
10. 外部链接使用系统浏览器打开（`shell.openExternal`） 
11. 定期更新 Electron 版本以修复安全漏洞

## 四 文件系统

1. 使用 `app.getPath()` 获取跨平台路径（如 `userData`、`documents`） 
2. 禁止硬编码文件路径，必须使用系统 API 
3. 使用 `fs/promises` 进行异步文件操作 
4. 写入文件前确保目录存在（`fs.mkdir` with `recursive: true`） 
5. 使用 `electron-store` 管理本地配置和状态 
6. 敏感数据使用加密存储（`encryptionKey` 选项）

## 五 窗口管理

1. 窗口创建时设置 `show: false`，使用 `ready-to-show` 事件再显示 
2. 使用 `screen.getPrimaryDisplay()` 获取屏幕尺寸 
3. 保存和恢复窗口位置、大小、最大化和全屏状态 
4. 设置最小窗口尺寸（`minWidth`、`minHeight`） 
5. 使用 `backgroundColor` 避免白屏闪烁 
6. 窗口关闭前保存状态到本地存储 
7. 多窗口使用 `Map` 管理，记录窗口 ID 
8. 窗口销毁时清理相关资源和事件监听

## 六 原生功能

1. 应用菜单根据平台差异化配置（macOS 有 App 菜单） 
2. 使用 `accelerator` 定义菜单快捷键（如 `CmdOrCtrl+N`） 
3. 文件对话框设置默认路径为用户文档目录 
4. 文件对话框使用 `filters` 限制文件类型 
5. 系统通知使用前检查 `Notification.isSupported()`
6. 通知点击时恢复和聚焦主窗口 
7. 系统托盘图标使用 `nativeImage.createFromPath()`
8. 托盘菜单包含显示/隐藏窗口和退出功能

## 七 性能优化

1. 大型模块使用延迟加载（动态 `import()`） 
2. 启用 `backgroundThrottling` 进行背景节流 
3. 避免频繁的 IPC 调用，使用防抖或节流 
4. 定期监控内存使用（`process.memoryUsage()`） 
5. 窗口关闭时清理定时器、订阅和事件监听 
6. 使用 `enablePreferredSizeMode` 和 `webgl: true` 优化渲染

## 八 生命周期管理

1. 使用 `app.on('ready')` 创建窗口 
2. macOS 下保持菜单栏活跃（`window-all-closed` 不退出） 
3. 使用 `app.on('activate')` 处理 macOS Dock 点击
4. `before-quit` 事件中保存应用状态和清理资源 
5. 注销 IPC 处理器避免内存泄漏 
6. 关闭数据库连接和清理临时文件

## 九 最佳实践

1. IPC 通道名使用命名空间（如 `storage:get`、`dialog:open`）
2. 主进程错误使用 `try-catch` 捕获并返回结果对象
3. 使用单例模式管理全局服务（如 `WindowManager`）
4. 路径处理统一使用 `path.join()` 而非字符串拼接
5. 配置文件使用 JSON 格式，便于人工编辑
6. 定期备份用户数据到多个位置

## 十 禁止事项

1. 禁止在渲染进程中启用 `nodeIntegration`
2. 禁止直接暴露 `ipcRenderer` 到全局 
3. 禁止使用 `remote` 模块（已废弃） 
4. 禁止在主进程中执行未验证的代码 
5. 禁止硬编码敏感信息（如 API 密钥） 
6. 禁止忽略安全警告和最佳实践 
7. 禁止在生产环境保留 DevTools 开关 
8. 禁止使用同步文件操作（使用异步 API）

