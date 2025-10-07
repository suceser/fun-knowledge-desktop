# 趣知桌面版

一个基于 Electron + Vite + TypeScript 构建的跨平台桌面应用。

## 项目简介

趣知桌面版（fun-knowledge-desktop）是一个现代化的 Electron 桌面应用程序，使用最新的前端技术栈构建。

## 技术栈

- **Electron** - 构建跨平台桌面应用
- **Vite** - 快速的前端构建工具
- **TypeScript** - 类型安全的 JavaScript 超集
- **Electron Forge** - Electron 应用的完整工具链

## 功能特性

- ✨ 使用 Vite 实现快速热重载开发
- 🔧 完整的 TypeScript 支持
- 📦 开箱即用的打包配置
- 🎯 支持 Windows、macOS 和 Linux 平台

## 环境要求

- Node.js >= 16.x
- npm >= 7.x

## 安装

```bash
# 克隆项目
git clone <repository-url>

# 进入项目目录
cd fun-knowledge-desktop

# 安装依赖
npm install
```

## 开发

```bash
# 启动开发模式（带热重载）
npm start
```

这将启动 Vite 开发服务器并打开 Electron 窗口。修改代码后会自动重载。

## 构建

```bash
# 打包应用（不创建安装包）
npm run package

# 创建分发包
npm run make
```

打包后的文件将位于 `out` 目录。

## 代码检查

```bash
# 运行 ESLint 检查
npm run lint
```

## 项目结构

```
fun-knowledge-desktop/
├── src/
│   ├── main.ts          # Electron 主进程
│   ├── preload.ts       # 预加载脚本
│   ├── renderer.ts      # 渲染进程
│   └── index.css        # 样式文件
├── index.html           # 应用入口 HTML
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript 配置
├── forge.config.ts      # Electron Forge 配置
├── vite.main.config.ts     # Vite 主进程配置
├── vite.preload.config.ts  # Vite 预加载配置
└── vite.renderer.config.ts # Vite 渲染进程配置
```

## 支持的打包格式

- **Windows**: Squirrel (`.exe`)
- **macOS**: ZIP (`.zip`)
- **Linux**: DEB (`.deb`) 和 RPM (`.rpm`)

## 发布

```bash
# 发布应用
npm run publish
```

## 作者

**苏策**  
Email: suceser@gmail.com

## 许可证

[MIT](LICENSE)

## 参考资源

- [Electron 官方文档](https://www.electronjs.org/docs)
- [Vite 官方文档](https://vitejs.dev/)
- [Electron Forge 文档](https://www.electronforge.io/)

