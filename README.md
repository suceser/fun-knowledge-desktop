# 趣知桌面版

<div align="center">
  <img src="assets/icon.png" alt="趣知桌面版" width="200">
  
  <h1>🎓 趣知桌面版</h1>
  <p>一个基于 Electron + React + TypeScript 构建的现代桌面知识管理应用</p>

  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue)](https://www.typescriptlang.org/)
  [![Electron](https://img.shields.io/badge/Electron-35.0.2-9feaf9)](https://www.electronjs.org/)
  [![React](https://img.shields.io/badge/React-19.0.0-61dafb)](https://reactjs.org/)
</div>

## ✨ 项目概览

趣知桌面版是一个现代化的桌面应用程序，基于成熟的 Electron React Boilerplate 架构构建。项目采用了最新的前端技术栈，为知识管理和学习提供了强大的桌面端解决方案。

### 🛠️ 核心技术栈

- **🖥️ 桌面框架**: Electron 35.0.2 - 跨平台桌面应用开发
- **⚛️ 前端框架**: React 19.0.0 - 现代化用户界面库
- **📝 开发语言**: TypeScript 5.8.2 - 类型安全的JavaScript超集
- **📦 构建工具**: Webpack 5.98.0 - 模块打包和构建系统
- **🎨 样式处理**: Sass + CSS Modules - 现代CSS解决方案
- **🔍 代码质量**: ESLint + Prettier - 代码规范和格式化
- **🧪 测试框架**: Jest + Testing Library - 单元测试和组件测试

## 🚀 功能特性

### 核心功能
- ✅ **跨平台支持** - 支持 Windows、macOS 和 Linux
- ✅ **现代化UI** - 基于React构建的响应式用户界面
- ✅ **类型安全** - 完整的TypeScript类型定义
- ✅ **热重载开发** - 开发时自动刷新，提升开发效率
- ✅ **自动更新** - 内置应用自动更新机制
- ✅ **安全通信** - 通过IPC实现主进程与渲染进程安全通信

### 开发特性
- ✅ **模块化架构** - 清晰的项目结构和模块化设计
- ✅ **开发工具集成** - 内置React DevTools支持
- ✅ **源码映射** - 便于调试的源码映射
- ✅ **代码分割** - 智能的代码分割和懒加载
- ✅ **性能优化** - 内置性能优化和打包优化

## 📋 系统要求

### 开发环境
- **Node.js**: >= 14.x (推荐使用最新LTS版本)
- **npm**: >= 7.x
- **操作系统**: Windows 10+, macOS 10.15+, 或 Linux

### 运行环境
- **Windows**: Windows 10 或更高版本
- **macOS**: macOS 10.15 (Catalina) 或更高版本
- **Linux**: Ubuntu 18.04+, Fedora 32+, 或其他现代Linux发行版

## 🔧 安装指南

### 1. 克隆项目
```bash
git clone https://github.com/your-username/fun-knowledge-desktop.git
cd fun-knowledge-desktop
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发环境
```bash
npm start
```

应用将在开发模式下启动，支持热重载功能。

## 🏗️ 开发指南

### 项目结构
```
fun-knowledge-desktop/
├── src/                    # 源代码目录
│   ├── main/              # 主进程代码
│   │   ├── main.ts        # 应用主入口
│   │   ├── menu.ts        # 菜单配置
│   │   ├── preload.ts     # 预加载脚本
│   │   └── util.ts        # 工具函数
│   └── renderer/          # 渲染进程代码
│       ├── App.tsx        # React应用根组件
│       ├── App.css        # 全局样式
│       ├── index.tsx      # 渲染进程入口
│       └── index.ejs      # HTML模板
├── assets/                # 静态资源
│   ├── icon.png          # 应用图标
│   └── icons/            # 多尺寸图标
├── .erb/                 # 构建配置
│   ├── configs/          # Webpack配置
│   ├── scripts/          # 构建脚本
│   └── dll/             # 动态链接库
├── release/              # 构建输出
├── package.json          # 项目配置
└── tsconfig.json        # TypeScript配置
```

### 开发命令

```bash
# 启动开发环境
npm start

# 构建生产版本
npm run build

# 代码检查
npm run lint

# 自动修复代码格式
npm run lint:fix

# 运行测试
npm test

# 打包应用
npm run package
```

### 架构设计

#### 主进程 (Main Process)
- **main.ts**: 应用程序的主入口点，负责创建和管理应用窗口
- **menu.ts**: 定义应用菜单结构，支持macOS和其他平台
- **preload.ts**: 预加载脚本，提供安全的IPC通信接口

#### 渲染进程 (Renderer Process)
- **App.tsx**: React应用的根组件
- **路由管理**: 使用React Router进行页面路由管理
- **组件架构**: 采用函数式组件和Hooks模式

#### 进程间通信 (IPC)
```typescript
// 主进程监听
ipcMain.on('channel-name', (event, data) => {
  // 处理逻辑
  event.reply('channel-name', response);
});

// 渲染进程发送
window.electron.ipcRenderer.sendMessage('channel-name', data);
```

## 📦 构建和部署

### 本地构建
```bash
# 构建所有平台
npm run build

# 打包当前平台
npm run package
```

### 构建配置
项目支持构建多平台应用：

- **Windows**: 生成 NSIS 安装包 (.exe)
- **macOS**: 生成 DMG 磁盘映像 (.dmg) 和 App Bundle
- **Linux**: 生成 AppImage (.AppImage)

### 发布配置
```json
{
  "build": {
    "productName": "趣知桌面版",
    "appId": "com.yourcompany.fun-knowledge",
    "directories": {
      "output": "release/build"
    }
  }
}
```

## 🧪 测试

### 运行测试
```bash
# 运行所有测试
npm test

# 运行测试并监听变化
npm test -- --watch

# 生成覆盖率报告
npm test -- --coverage
```

### 测试结构
- **单元测试**: 测试单个组件和函数
- **集成测试**: 测试组件间的交互
- **E2E测试**: 端到端的应用测试

## 🔧 配置说明

### TypeScript 配置
项目使用严格的TypeScript配置：
- 启用严格模式检查
- 支持最新的ES特性
- 完整的类型检查和推断

### Webpack 配置
- **开发环境**: 支持热重载、源码映射
- **生产环境**: 代码压缩、优化打包
- **DLL配置**: 分离第三方库提升构建速度

### ESLint 配置
- 基于Airbnb规范
- TypeScript支持
- React Hooks规则
- 自动修复功能

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献
1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

### 开发规范
- 遵循现有的代码风格
- 添加必要的测试
- 更新相关文档
- 确保所有测试通过

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙋‍♂️ 支持

如果你在使用过程中遇到问题，可以通过以下方式获得帮助：

- 📖 查看项目文档
- 🐛 提交 Issue
- 💬 参与讨论

## 📚 相关资源

- [Electron 官方文档](https://www.electronjs.org/docs)
- [React 官方文档](https://reactjs.org/docs)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs)
- [Electron React Boilerplate](https://electron-react-boilerplate.js.org/)

---

<div align="center">
  <p>由 ❤️ 驱动开发</p>
  <p>如果这个项目对你有帮助，请考虑给它一个 ⭐</p>
</div>