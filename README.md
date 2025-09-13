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

趣知桌面版是一个现代化的桌面知识管理应用程序，采用精美的深色主题和流畅的交互设计。应用基于成熟的 Electron React Boilerplate 架构构建，提供完整的知识管理工作流，包括知识问答、图谱可视化、数字图书管理和学习数据等功能。

### 🛠️ 核心技术栈

- **🖥️ 桌面框架**: Electron 35.0.2 - 跨平台桌面应用开发
- **⚛️ 前端框架**: React 19.0.0 - 现代化用户界面库  
- **📝 开发语言**: TypeScript 5.8.2 - 类型安全的JavaScript超集
- **🎨 UI 组件库**: Ant Design 5.27.1 - 企业级UI设计语言
- **📊 数据可视化**: @ant-design/charts 2.6.2 - 图表和可视化组件
- **📦 构建工具**: Webpack 5.98.0 - 模块打包和构建系统
- **🎨 样式处理**: CSS Variables + CSS Modules - 现代主题系统
- **🔍 代码质量**: ESLint + Prettier - 代码规范和格式化
- **🧪 测试框架**: Jest + Testing Library - 单元测试和组件测试

## 🚀 功能特性

### 🎯 核心功能模块
- ✅ **我的首页** - 个性化仪表盘，快速访问常用功能
- ✅ **知识问答** - 智能问答系统，快速获取知识解答  
- ✅ **知识图谱** - 可视化知识关系网络，构建知识体系
- ✅ **知识库** - 数字图书管理，支持多格式阅读
- ✅ **学习数据** - 学习数据可视化，优化知识管理策略

### 🎨 界面设计特色
- ✅ **深色主题** - 护眼的深色界面，支持长时间使用
- ✅ **毛玻璃效果** - 现代化的视觉设计，层次分明
- ✅ **流畅动画** - 精心设计的过渡动画，提升交互体验
- ✅ **响应式布局** - 支持不同窗口尺寸的自适应显示
- ✅ **青绿色主题** - 基于 #38b2ac 的完整色彩系统

### 🔧 交互功能
- ✅ **可折叠侧边栏** - 灵活的布局控制，最大化内容区域
- ✅ **智能导航** - 直观的Tab式导航，支持快速切换
- ✅ **悬停反馈** - 丰富的视觉反馈，提升操作确认感
- ✅ **懒加载组件** - 按需加载页面组件，优化启动性能

### 🛠️ 开发特性
- ✅ **模块化架构** - 清晰的组件分层和目录结构
- ✅ **TypeScript严格模式** - 完整的类型安全保障
- ✅ **组件化开发** - 可复用的UI组件和业务组件
- ✅ **主题系统** - 基于CSS Variables的可扩展主题
- ✅ **代码分割** - 智能的代码分割和懒加载优化

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
├── src/                          # 源代码目录
│   ├── main/                    # 主进程代码
│   │   ├── main.ts              # 应用主入口
│   │   ├── menu.ts              # 菜单配置
│   │   ├── preload.ts           # 预加载脚本
│   │   └── util.ts              # 工具函数
│   └── renderer/                # 渲染进程代码
│       ├── components/          # React组件
│       │   ├── Layout/          # 布局组件
│       │   │   ├── MainLayout.tsx
│       │   │   └── MainLayout.css
│       │   ├── Sidebar/         # 侧边栏组件
│       │   │   ├── Sidebar.tsx
│       │   │   └── Sidebar.css
│       │   ├── Content/         # 内容区域组件
│       │   │   ├── ContentArea.tsx
│       │   │   └── ContentArea.css
│       │   └── Pages/           # 页面组件
│       │       ├── Home/        # 我的首页
│       │       ├── QnA/         # 知识问答
│       │       ├── KnowledgeGraph/ # 知识图谱
│       │       ├── Library/     # 知识库
│       │       └── Analytics/   # 学习数据
│       ├── styles/              # 全局样式
│       │   └── theme.css        # 主题系统
│       ├── App.tsx              # React应用根组件
│       ├── App.css              # 全局样式覆盖
│       ├── index.tsx            # 渲染进程入口
│       └── index.ejs            # HTML模板
├── assets/                      # 静态资源
│   ├── icon.png                # 应用图标
│   └── icons/                  # 多尺寸图标
├── design/                      # 设计文档
│   ├── 产品设计.md              # 产品设计规范
│   ├── 架构设计.md              # 技术架构文档
│   └── 交互设计.md              # UI交互设计规范
├── .erb/                       # 构建配置
├── release/                    # 构建输出
├── package.json               # 项目配置
└── tsconfig.json             # TypeScript配置
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
- **App.tsx**: React应用的根组件，配置Antd主题和全局Provider
- **MainLayout**: 主要布局组件，管理侧边栏和内容区域
- **Sidebar**: 可折叠侧边栏，包含导航、头像和功能按钮
- **ContentArea**: 内容区域，支持懒加载和页面切换
- **Pages**: 各功能页面组件，采用模块化设计

#### 组件架构设计
- **函数式组件**: 全面采用React Hooks模式
- **TypeScript接口**: 严格的Props类型定义
- **CSS模块化**: 组件级样式隔离
- **主题系统**: 基于CSS Variables的统一主题管理

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
    "appId": "com.funknowledge.desktop",
    "directories": {
      "output": "release/build"
    },
    "files": [
      "dist",
      "node_modules", 
      "package.json"
    ],
    "mac": {
      "target": ["arm64", "x64"]
    },
    "win": {
      "target": ["nsis"]
    },
    "linux": {
      "target": ["AppImage"]
    }
  }
}
```

### 🎨 主题配置

项目采用了完整的设计系统，支持：

- **色彩系统**: 基于青绿色(#38b2ac)的完整调色板
- **深色主题**: 护眼的深色界面设计
- **毛玻璃效果**: backdrop-filter实现的现代视觉效果
- **动画系统**: 流畅的过渡和交互动画
- **响应式设计**: 支持不同窗口尺寸的自适应

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
