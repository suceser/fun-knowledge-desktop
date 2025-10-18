# Electron 应用开发规范

本文档定义了项目中 Electron 桌面应用的开发规范和最佳实践。

## 目录

- [架构设计](#架构设计)
- [进程通信](#进程通信)
- [安全性](#安全性)
- [文件系统](#文件系统)
- [窗口管理](#窗口管理)
- [原生功能](#原生功能)
- [性能优化](#性能优化)
- [打包与分发](#打包与分发)
- [调试与测试](#调试与测试)
- [最佳实践](#最佳实践)

---

## 架构设计

### 进程模型

Electron 应用包含三种类型的进程：

```
┌─────────────────────────────────────────────┐
│           主进程 (Main Process)              │
│  - 应用生命周期管理                           │
│  - 窗口创建和管理                             │
│  - 原生 API 访问                              │
│  - IPC 服务端                                 │
└────────────────┬────────────────────────────┘
                 │
       ┌─────────┴──────────┐
       │                    │
┌──────▼──────┐      ┌──────▼──────┐
│ 预加载脚本   │      │ 预加载脚本   │
│ (Preload)   │      │ (Preload)   │
└──────┬──────┘      └──────┬──────┘
       │                    │
┌──────▼──────┐      ┌──────▼──────┐
│ 渲染进程 1   │      │ 渲染进程 2   │
│ (Renderer)  │      │ (Renderer)  │
│  - Web 页面  │      │  - Web 页面  │
│  - React UI │      │  - React UI │
└─────────────┘      └─────────────┘
```

### 目录结构

```
src/
├── main.ts                    # 主进程入口
├── preload.ts                 # 预加载脚本
├── main/                      # 主进程代码
│   ├── services/              # 主进程服务
│   │   └── StorageService.ts
│   ├── types/                 # 类型定义
│   │   ├── Global.d.ts
│   │   └── Storage.ts
│   └── utils/                 # 工具函数
├── ipc/                       # IPC 通信
│   └── StorageHandlers.ts
├── renderer/                  # 渲染进程代码
│   ├── App.tsx               # React 应用入口
│   ├── components/           # React 组件
│   ├── services/             # 前端服务
│   ├── hooks/                # 自定义 Hooks
│   └── types/                # 前端类型
└── renderer.tsx              # 渲染进程入口
```

---

## 进程通信

### IPC 通信原则

1. **单向通信**：渲染进程 → 主进程
2. **双向通信**：使用 `ipcRenderer.invoke` 和 `ipcMain.handle`
3. **事件广播**：主进程 → 渲染进程使用 `webContents.send`

### 预加载脚本 (Preload)

预加载脚本是渲染进程和主进程之间的桥梁，使用 `contextBridge` 安全地暴露 API。

```typescript
// ✅ 推荐：使用 contextBridge
// src/preload.ts

import { contextBridge, ipcRenderer } from 'electron';

// 定义暴露给渲染进程的 API 类型
interface ElectronAPI {
  storage: {
    get: <T>(key: string) => Promise<StorageResult<T>>;
    set: <T>(key: string, value: T) => Promise<StorageResult<void>>;
    delete: (key: string) => Promise<StorageResult<void>>;
  };
  dialog: {
    showOpenDialog: (options: OpenDialogOptions) => Promise<string[]>;
    showSaveDialog: (options: SaveDialogOptions) => Promise<string>;
  };
}

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  storage: {
    get: <T>(key: string) => 
      ipcRenderer.invoke('storage:get', key),
    
    set: <T>(key: string, value: T) => 
      ipcRenderer.invoke('storage:set', key, value),
    
    delete: (key: string) => 
      ipcRenderer.invoke('storage:delete', key),
  },
  
  dialog: {
    showOpenDialog: (options: OpenDialogOptions) => 
      ipcRenderer.invoke('dialog:open', options),
    
    showSaveDialog: (options: SaveDialogOptions) => 
      ipcRenderer.invoke('dialog:save', options),
  },
});

// ❌ 避免：直接暴露 ipcRenderer
// contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer); // 不安全！
```

### IPC 处理器 (Handlers)

在主进程中注册 IPC 处理器：

```typescript
// ✅ 推荐：模块化的 IPC 处理器
// src/ipc/StorageHandlers.ts

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { storageService } from '../main/services/StorageService';

/**
 * 注册存储相关的 IPC 处理器
 */
export function registerStorageHandlers(): void {
  // 获取配置值
  ipcMain.handle(
    'storage:get', 
    async (_event: IpcMainInvokeEvent, key: string) => {
      try {
        const data = await storageService.get(key);
        return { success: true, data };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }
  );

  // 设置配置值
  ipcMain.handle(
    'storage:set',
    async (_event: IpcMainInvokeEvent, key: string, value: unknown) => {
      try {
        await storageService.set(key, value);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }
  );
}

/**
 * 注销存储相关的 IPC 处理器
 */
export function unregisterStorageHandlers(): void {
  ipcMain.removeHandler('storage:get');
  ipcMain.removeHandler('storage:set');
}
```

### 渲染进程调用

在渲染进程中使用暴露的 API：

```typescript
// ✅ 推荐：使用类型安全的 API
// src/renderer/services/StorageService.ts

class StorageService {
  async get<T>(key: string): Promise<T | undefined> {
    const result = await window.electronAPI.storage.get<T>(key);
    
    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to get value:', result.error);
      throw new Error(result.error);
    }
  }

  async set<T>(key: string, value: T): Promise<boolean> {
    const result = await window.electronAPI.storage.set(key, value);
    
    if (!result.success) {
      console.error('Failed to set value:', result.error);
      throw new Error(result.error);
    }
    
    return true;
  }
}

export const storageService = new StorageService();
```

### 类型定义

为暴露的 API 添加类型定义：

```typescript
// ✅ 推荐：类型定义
// src/main/types/Global.d.ts

interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface ElectronAPI {
  storage: {
    get: <T>(key: string) => Promise<StorageResult<T>>;
    set: <T>(key: string, value: T) => Promise<StorageResult<void>>;
    delete: (key: string) => Promise<StorageResult<void>>;
  };
}

// 扩展 Window 接口
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
```

---

## 安全性

### 安全配置

```typescript
// ✅ 推荐：安全的 BrowserWindow 配置
// src/main.ts

import { app, BrowserWindow } from 'electron';
import path from 'node:path';

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // ✅ 使用预加载脚本
      preload: path.join(__dirname, 'preload.js'),
      
      // ✅ 禁用 Node.js 集成（重要！）
      nodeIntegration: false,
      
      // ✅ 启用上下文隔离（重要！）
      contextIsolation: true,
      
      // ✅ 禁用远程模块
      enableRemoteModule: false,
      
      // ✅ 禁用 Web Workers 中的 Node.js
      nodeIntegrationInWorker: false,
      
      // ✅ 禁用 Sub-frames 中的 Node.js
      nodeIntegrationInSubFrames: false,
      
      // ✅ 启用沙箱模式
      sandbox: true,
      
      // ✅ 限制导航
      webSecurity: true,
    },
  });

  return mainWindow;
};
```

### 内容安全策略 (CSP)

```html
<!-- ✅ 推荐：在 HTML 中添加 CSP -->
<!-- index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="
    default-src 'self';
    script-src 'self';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self' data:;
    connect-src 'self' https://api.example.com;
  "
/>
```

### 验证和清理输入

```typescript
// ✅ 推荐：验证来自渲染进程的输入
// src/ipc/FileHandlers.ts

import { ipcMain } from 'electron';
import path from 'node:path';
import fs from 'node:fs/promises';

ipcMain.handle('file:read', async (_event, filePath: string) => {
  // 验证文件路径
  if (typeof filePath !== 'string') {
    throw new Error('Invalid file path');
  }

  // 规范化路径，防止路径遍历攻击
  const normalizedPath = path.normalize(filePath);
  
  // 确保路径在允许的目录内
  const allowedDir = app.getPath('userData');
  if (!normalizedPath.startsWith(allowedDir)) {
    throw new Error('Access denied');
  }

  try {
    const content = await fs.readFile(normalizedPath, 'utf-8');
    return { success: true, data: content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

### 外部内容加载

```typescript
// ✅ 推荐：限制外部内容加载
mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
  const parsedUrl = new URL(navigationUrl);
  
  // 只允许导航到应用自己的页面
  if (parsedUrl.origin !== 'file://') {
    event.preventDefault();
    console.warn('Navigation blocked:', navigationUrl);
  }
});

// 阻止新窗口打开
mainWindow.webContents.setWindowOpenHandler(({ url }) => {
  // 使用系统默认浏览器打开外部链接
  if (url.startsWith('http://') || url.startsWith('https://')) {
    shell.openExternal(url);
  }
  return { action: 'deny' };
});
```

---

## 文件系统

### 路径管理

```typescript
// ✅ 推荐：使用 Electron 提供的路径 API
import { app } from 'electron';
import path from 'node:path';

class PathService {
  // 用户数据目录
  static getUserDataPath(): string {
    return app.getPath('userData');
  }

  // 文档目录
  static getDocumentsPath(): string {
    return app.getPath('documents');
  }

  // 临时目录
  static getTempPath(): string {
    return app.getPath('temp');
  }

  // 应用数据目录
  static getAppDataPath(): string {
    return app.getPath('appData');
  }

  // 日志目录
  static getLogsPath(): string {
    return app.getPath('logs');
  }

  // 自定义配置文件路径
  static getConfigPath(filename: string): string {
    return path.join(this.getUserDataPath(), 'config', filename);
  }
}

// ❌ 避免：硬编码路径
const configPath = '/Users/username/.config/app/config.json'; // 不跨平台
```

### 文件操作

```typescript
// ✅ 推荐：异步文件操作
import fs from 'node:fs/promises';
import path from 'node:path';

class FileService {
  /**
   * 读取 JSON 文件
   */
  async readJSON<T>(filePath: string): Promise<T> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`File not found: ${filePath}`);
      }
      throw error;
    }
  }

  /**
   * 写入 JSON 文件
   */
  async writeJSON(filePath: string, data: unknown): Promise<void> {
    // 确保目录存在
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });

    // 写入文件
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, content, 'utf-8');
  }

  /**
   * 检查文件是否存在
   */
  async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 删除文件
   */
  async delete(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}
```

### 本地存储

```typescript
// ✅ 推荐：使用 electron-store
import Store from 'electron-store';

interface StoreSchema {
  theme: 'light' | 'dark';
  windowBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  lastOpenFile: string;
}

const store = new Store<StoreSchema>({
  defaults: {
    theme: 'light',
    windowBounds: {
      x: 0,
      y: 0,
      width: 1200,
      height: 800,
    },
    lastOpenFile: '',
  },
  // 加密敏感数据
  encryptionKey: 'your-encryption-key',
});

// 使用
const theme = store.get('theme');
store.set('theme', 'dark');
```

---

## 窗口管理

### 窗口创建

```typescript
// ✅ 推荐：完整的窗口配置
import { BrowserWindow, screen } from 'electron';

class WindowManager {
  private mainWindow: BrowserWindow | null = null;

  createMainWindow(): BrowserWindow {
    // 获取主显示器尺寸
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    // 从存储中恢复窗口位置和大小
    const bounds = store.get('windowBounds') || {
      width: Math.floor(width * 0.8),
      height: Math.floor(height * 0.8),
    };

    this.mainWindow = new BrowserWindow({
      ...bounds,
      minWidth: 900,
      minHeight: 600,
      
      // 窗口样式
      title: 'Fun Knowledge',
      backgroundColor: '#ffffff',
      
      // 显示配置
      show: false, // 先隐藏，ready-to-show 时再显示
      
      // 图标
      icon: path.join(__dirname, 'assets/icon.png'),
      
      // Web 配置
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    // 窗口准备好后再显示
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    // 保存窗口位置和大小
    this.mainWindow.on('close', () => {
      if (this.mainWindow) {
        store.set('windowBounds', this.mainWindow.getBounds());
      }
    });

    return this.mainWindow;
  }

  getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }
}

export const windowManager = new WindowManager();
```

### 窗口状态管理

```typescript
// ✅ 推荐：保存和恢复窗口状态
class WindowStateManager {
  /**
   * 保存窗口状态
   */
  saveState(window: BrowserWindow): void {
    const bounds = window.getBounds();
    const isMaximized = window.isMaximized();
    const isFullScreen = window.isFullScreen();

    store.set('windowState', {
      bounds,
      isMaximized,
      isFullScreen,
    });
  }

  /**
   * 恢复窗口状态
   */
  restoreState(window: BrowserWindow): void {
    const state = store.get('windowState');

    if (state) {
      // 恢复位置和大小
      window.setBounds(state.bounds);

      // 恢复最大化状态
      if (state.isMaximized) {
        window.maximize();
      }

      // 恢复全屏状态
      if (state.isFullScreen) {
        window.setFullScreen(true);
      }
    }
  }

  /**
   * 监听窗口状态变化
   */
  watchState(window: BrowserWindow): void {
    // 窗口移动、调整大小时保存状态
    const saveStateDebounced = debounce(() => {
      this.saveState(window);
    }, 500);

    window.on('resize', saveStateDebounced);
    window.on('move', saveStateDebounced);

    // 窗口关闭前保存状态
    window.on('close', () => {
      this.saveState(window);
    });
  }
}
```

### 多窗口管理

```typescript
// ✅ 推荐：管理多个窗口
class MultiWindowManager {
  private windows: Map<string, BrowserWindow> = new Map();

  createWindow(id: string, options: BrowserWindowConstructorOptions): BrowserWindow {
    const window = new BrowserWindow(options);
    
    this.windows.set(id, window);
    
    window.on('closed', () => {
      this.windows.delete(id);
    });

    return window;
  }

  getWindow(id: string): BrowserWindow | undefined {
    return this.windows.get(id);
  }

  getAllWindows(): BrowserWindow[] {
    return Array.from(this.windows.values());
  }

  closeWindow(id: string): void {
    const window = this.windows.get(id);
    if (window) {
      window.close();
    }
  }

  closeAllWindows(): void {
    this.windows.forEach(window => window.close());
    this.windows.clear();
  }
}
```

---

## 原生功能

### 菜单

```typescript
// ✅ 推荐：应用菜单
import { app, Menu, shell } from 'electron';

function createApplicationMenu(): Menu {
  const template: MenuItemConstructorOptions[] = [
    // macOS 特有的应用菜单
    ...(process.platform === 'darwin' ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    }] : []),

    // 文件菜单
    {
      label: '文件',
      submenu: [
        {
          label: '新建',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            // 处理新建
          },
        },
        {
          label: '打开',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            // 打开文件对话框
          },
        },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },

    // 编辑菜单
    {
      label: '编辑',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },

    // 视图菜单
    {
      label: '视图',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },

    // 帮助菜单
    {
      label: '帮助',
      submenu: [
        {
          label: '学习更多',
          click: async () => {
            await shell.openExternal('https://example.com');
          },
        },
      ],
    },
  ];

  return Menu.buildFromTemplate(template);
}

// 设置应用菜单
Menu.setApplicationMenu(createApplicationMenu());
```

### 对话框

```typescript
// ✅ 推荐：文件对话框
import { dialog, BrowserWindow } from 'electron';

class DialogService {
  /**
   * 显示打开文件对话框
   */
  async showOpenDialog(
    window: BrowserWindow,
    options: OpenDialogOptions = {}
  ): Promise<string[]> {
    const result = await dialog.showOpenDialog(window, {
      title: '选择文件',
      defaultPath: app.getPath('documents'),
      filters: [
        { name: 'Text Files', extensions: ['txt', 'md'] },
        { name: 'All Files', extensions: ['*'] },
      ],
      properties: ['openFile', 'multiSelections'],
      ...options,
    });

    return result.canceled ? [] : result.filePaths;
  }

  /**
   * 显示保存文件对话框
   */
  async showSaveDialog(
    window: BrowserWindow,
    options: SaveDialogOptions = {}
  ): Promise<string | undefined> {
    const result = await dialog.showSaveDialog(window, {
      title: '保存文件',
      defaultPath: path.join(app.getPath('documents'), 'untitled.txt'),
      filters: [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] },
      ],
      ...options,
    });

    return result.canceled ? undefined : result.filePath;
  }

  /**
   * 显示消息框
   */
  async showMessageBox(
    window: BrowserWindow,
    options: MessageBoxOptions
  ): Promise<number> {
    const result = await dialog.showMessageBox(window, options);
    return result.response;
  }

  /**
   * 显示错误对话框
   */
  showErrorBox(title: string, content: string): void {
    dialog.showErrorBox(title, content);
  }
}
```

### 通知

```typescript
// ✅ 推荐：系统通知
import { Notification } from 'electron';

class NotificationService {
  /**
   * 显示通知
   */
  show(title: string, body: string, options: NotificationOptions = {}): void {
    if (!Notification.isSupported()) {
      console.warn('Notifications are not supported');
      return;
    }

    const notification = new Notification({
      title,
      body,
      icon: path.join(__dirname, 'assets/icon.png'),
      ...options,
    });

    notification.on('click', () => {
      // 点击通知时的处理
      const mainWindow = windowManager.getMainWindow();
      if (mainWindow) {
        if (mainWindow.isMinimized()) {
          mainWindow.restore();
        }
        mainWindow.focus();
      }
    });

    notification.show();
  }
}
```

### 系统托盘

```typescript
// ✅ 推荐：系统托盘
import { Tray, Menu, nativeImage } from 'electron';

class TrayService {
  private tray: Tray | null = null;

  create(): void {
    const icon = nativeImage.createFromPath(
      path.join(__dirname, 'assets/tray-icon.png')
    );

    this.tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
      {
        label: '显示窗口',
        click: () => {
          const mainWindow = windowManager.getMainWindow();
          mainWindow?.show();
        },
      },
      {
        label: '隐藏窗口',
        click: () => {
          const mainWindow = windowManager.getMainWindow();
          mainWindow?.hide();
        },
      },
      { type: 'separator' },
      {
        label: '退出',
        click: () => {
          app.quit();
        },
      },
    ]);

    this.tray.setToolTip('Fun Knowledge');
    this.tray.setContextMenu(contextMenu);

    // 点击托盘图标
    this.tray.on('click', () => {
      const mainWindow = windowManager.getMainWindow();
      if (mainWindow) {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
      }
    });
  }

  destroy(): void {
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
    }
  }
}
```

---

## 性能优化

### 延迟加载

```typescript
// ✅ 推荐：延迟加载大型模块
// src/main.ts

let heavyModule: any = null;

ipcMain.handle('heavy:process', async () => {
  // 只在需要时加载
  if (!heavyModule) {
    heavyModule = await import('./heavy-module');
  }
  
  return heavyModule.process();
});
```

### 窗口性能

```typescript
// ✅ 推荐：优化窗口性能
const mainWindow = new BrowserWindow({
  // 使用硬件加速
  webPreferences: {
    enablePreferredSizeMode: true,
    
    // 启用 WebGL
    webgl: true,
    
    // 背景节流
    backgroundThrottling: true,
  },
  
  // 延迟显示，避免白屏
  show: false,
});

mainWindow.once('ready-to-show', () => {
  mainWindow.show();
});

// ✅ 避免频繁的 IPC 调用
// 使用节流/防抖
const debouncedSave = debounce((data) => {
  storageService.save(data);
}, 1000);
```

### 内存管理

```typescript
// ✅ 推荐：监控内存使用
app.on('ready', () => {
  // 定期检查内存使用
  setInterval(() => {
    const memoryUsage = process.memoryUsage();
    console.log('Memory usage:', {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
    });
  }, 60000); // 每分钟检查一次
});

// ✅ 清理不再使用的窗口
window.on('closed', () => {
  window = null;
  // 清理相关资源
});
```

---

## 打包与分发

### Electron Forge 配置

```javascript
// ✅ 推荐：forge.config.ts
import type { ForgeConfig } from '@electron-forge/shared-types';

const config: ForgeConfig = {
  packagerConfig: {
    name: 'Fun Knowledge',
    executableName: 'fun-knowledge',
    icon: './assets/icon',
    appBundleId: 'com.example.fun-knowledge',
    appCategoryType: 'public.app-category.productivity',
    
    // macOS 签名
    osxSign: {
      identity: 'Developer ID Application: Your Name',
    },
    osxNotarize: {
      appleId: process.env.APPLE_ID!,
      appleIdPassword: process.env.APPLE_PASSWORD!,
    },
  },
  
  makers: [
    // Windows
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'fun_knowledge',
        setupIcon: './assets/icon.ico',
        loadingGif: './assets/loading.gif',
      },
    },
    
    // macOS
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO',
        icon: './assets/icon.icns',
        background: './assets/dmg-background.png',
      },
    },
    
    // Linux
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './assets/icon.png',
          categories: ['Utility'],
        },
      },
    },
  ],
  
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        build: [
          {
            entry: 'src/main.ts',
            config: 'vite.main.config.ts',
          },
          {
            entry: 'src/preload.ts',
            config: 'vite.preload.config.ts',
          },
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'vite.renderer.config.ts',
          },
        ],
      },
    },
  ],
};

export default config;
```

### 自动更新

```typescript
// ✅ 推荐：使用 electron-updater
import { autoUpdater } from 'electron-updater';
import { app, dialog } from 'electron';

class UpdateService {
  init(): void {
    // 配置更新服务器
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'your-username',
      repo: 'your-repo',
    });

    // 检查更新
    autoUpdater.checkForUpdatesAndNotify();

    // 监听更新事件
    autoUpdater.on('update-available', (info) => {
      dialog.showMessageBox({
        type: 'info',
        title: '发现新版本',
        message: `发现新版本 ${info.version}，正在下载...`,
      });
    });

    autoUpdater.on('update-downloaded', (info) => {
      dialog.showMessageBox({
        type: 'info',
        title: '更新就绪',
        message: `新版本 ${info.version} 已下载，重启应用以更新`,
        buttons: ['稍后', '立即重启'],
      }).then((result) => {
        if (result.response === 1) {
          autoUpdater.quitAndInstall();
        }
      });
    });

    autoUpdater.on('error', (error) => {
      console.error('Update error:', error);
    });
  }

  checkForUpdates(): void {
    autoUpdater.checkForUpdates();
  }
}
```

---

## 调试与测试

### 开发工具

```typescript
// ✅ 推荐：开发环境配置
if (process.env.NODE_ENV === 'development') {
  // 自动打开 DevTools
  mainWindow.webContents.openDevTools();

  // 安装 React DevTools
  const { default: installExtension, REACT_DEVELOPER_TOOLS } = 
    require('electron-devtools-installer');
  
  app.whenReady().then(() => {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
  });
}
```

### 日志记录

```typescript
// ✅ 推荐：使用 electron-log
import log from 'electron-log';

// 配置日志
log.transports.file.level = 'info';
log.transports.file.maxSize = 5 * 1024 * 1024; // 5MB
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}';

// 使用
log.info('Application started');
log.error('Error occurred:', error);
log.warn('Warning:', message);
log.debug('Debug info:', data);

// 捕获未处理的错误
process.on('uncaughtException', (error) => {
  log.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason) => {
  log.error('Unhandled Rejection:', reason);
});
```

### 错误处理

```typescript
// ✅ 推荐：全局错误处理
class ErrorHandler {
  init(): void {
    // 主进程错误
    process.on('uncaughtException', (error) => {
      this.handleError('Uncaught Exception', error);
    });

    process.on('unhandledRejection', (reason) => {
      this.handleError('Unhandled Rejection', reason);
    });

    // 渲染进程错误
    app.on('render-process-gone', (event, webContents, details) => {
      this.handleCrash('Render Process Gone', details);
    });
  }

  private handleError(title: string, error: any): void {
    log.error(title, error);

    // 显示错误对话框
    dialog.showErrorBox(
      title,
      error instanceof Error ? error.message : String(error)
    );

    // 发送错误报告到服务器
    this.reportError(title, error);
  }

  private handleCrash(title: string, details: any): void {
    log.error(title, details);

    // 显示崩溃对话框
    dialog.showMessageBox({
      type: 'error',
      title: '应用崩溃',
      message: '应用遇到了一个错误',
      detail: JSON.stringify(details, null, 2),
      buttons: ['重启', '退出'],
    }).then((result) => {
      if (result.response === 0) {
        app.relaunch();
        app.quit();
      } else {
        app.quit();
      }
    });
  }

  private reportError(title: string, error: any): void {
    // 发送到错误追踪服务（如 Sentry）
    // ...
  }
}
```

---

## 最佳实践

### 1. 进程分离

```typescript
// ✅ 将业务逻辑放在主进程
// ✅ 将 UI 逻辑放在渲染进程
// ✅ 通过 IPC 通信

// 主进程 - 数据处理
class DataService {
  async processData(data: any): Promise<any> {
    // 复杂的数据处理逻辑
    return processed;
  }
}

// 渲染进程 - UI 展示
function DataDisplay() {
  const [data, setData] = useState(null);

  useEffect(() => {
    window.electronAPI.data.process(rawData).then(setData);
  }, []);

  return <div>{data}</div>;
}
```

### 2. 资源清理

```typescript
// ✅ 推荐：及时清理资源
app.on('before-quit', () => {
  // 保存应用状态
  saveApplicationState();

  // 关闭数据库连接
  database.close();

  // 清理临时文件
  cleanupTempFiles();

  // 注销 IPC 处理器
  unregisterAllHandlers();
});
```

### 3. 用户体验

```typescript
// ✅ 推荐：提升用户体验
const mainWindow = new BrowserWindow({
  // 使用原生窗口框架
  frame: true,
  
  // 平滑过渡
  show: false,
  backgroundColor: '#ffffff',
  
  // 记住窗口位置
  ...store.get('windowBounds'),
});

// 显示启动画面
const splashWindow = createSplashWindow();

mainWindow.once('ready-to-show', () => {
  splashWindow.close();
  mainWindow.show();
});
```

### 4. 安全检查清单

- [ ] `nodeIntegration: false`
- [ ] `contextIsolation: true`
- [ ] 使用 `contextBridge` 暴露 API
- [ ] 验证所有来自渲染进程的输入
- [ ] 限制 `webSecurity` 和导航
- [ ] 使用 CSP 策略
- [ ] 不在预加载脚本中暴露敏感 API
- [ ] 定期更新 Electron 版本

### 5. 性能检查清单

- [ ] 使用 `show: false` 和 `ready-to-show`
- [ ] 启用背景节流
- [ ] 延迟加载大型模块
- [ ] 优化 IPC 通信频率
- [ ] 监控内存使用
- [ ] 清理不再使用的资源

---

## 相关文档

- [React 组件规范](./React%20组件开发规范.md)
- [TypeScript 语言规范](./TypeScript%20语言规范.md)
- [架构设计](../3_架构设计/架构设计.md)
- [本地持久化](../3_架构设计/本地持久化.md)

---

## 参考资源

- [Electron 官方文档](https://www.electronjs.org/docs)
- [Electron Security Guidelines](https://www.electronjs.org/docs/latest/tutorial/security)
- [Electron Best Practices](https://www.electronjs.org/docs/latest/tutorial/security#best-practices)
- [Electron Forge](https://www.electronforge.io/)

