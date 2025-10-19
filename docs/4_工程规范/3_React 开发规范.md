# React 组件开发规范

## 一 文件与命名

1. 组件文件名使用 PascalCase（如 `ChatArea.tsx`），CSS 文件同名
2. 简单组件使用单文件，复杂组件使用目录结构（包含 `index.tsx`、类型、hooks、子组件等）
3. 状态变量使用 camelCase，事件处理函数使用 `handle` 前缀
4. 布尔变量使用 `is`、`has`、`should` 等前缀
5. 常量使用 UPPER_SNAKE_CASE 命名

## 二 组件结构

1. 导入顺序：React → 第三方库 → 项目模块 → 样式文件 
2. 组件内部顺序：Props 接口 → 常量 → 组件函数（Hooks → State → Refs → Memo → Effects → 事件处理 → 辅助函数 → 渲染） 
3. 使用 `interface` 定义 Props，可选属性用 `?` 标记 
4. 回调函数 Props 以 `on` 开头（如 `onSubmit`、`onClick`）

## 三 Hooks 使用

1. 为状态变量提供明确的类型（如 `useState<User | null>(null)`） 
2. 使用函数式更新状态（如 `setCount(prev => prev + 1)`） 
3. 不要直接修改状态对象或数组
4. `useEffect` 必须明确声明依赖项，避免遗漏 
5. 使用 `useEffect` 返回清理函数处理定时器、订阅等 
6. 使用 `useCallback` 缓存传递给子组件的函数 
7. 使用 `useMemo` 缓存昂贵的计算结果，但不要过度使用 
8. 使用 `useRef` 保存 DOM 引用和不触发重渲染的可变值 
9. 自定义 Hook 必须以 `use` 开头

## 四 事件处理

1. 为事件处理函数使用明确的类型（如 `React.MouseEvent<HTMLButtonElement>`） 
2. 键盘事件检查 `e.key` 和 `e.shiftKey` 组合 
3. 在表单提交和链接点击时使用 `e.preventDefault()`

## 五 样式处理

1. CSS 类名使用 kebab-case（如 `chat-area`、`message-list`） 
2. 使用模板字符串或 `classnames` 库组合动态类名 
3. 内联样式仅用于动态值，避免大量静态样式

## 六 性能优化

1. 使用 `React.memo` 包装不需要频繁更新的组件 
2. 列表渲染使用稳定的唯一 ID 作为 `key`，避免使用索引 
3. 提前返回处理加载和错误状态，避免深层嵌套 
4. 使用 `React.lazy` 和 `Suspense` 实现路由级懒加载 
5. 避免在 render 中定义函数和对象（使用 `useCallback` 和 `useMemo`）

## 七 类型安全

1. 所有组件必须有明确的 TypeScript 类型 
2. 函数组件使用 `React.FC<Props>` 类型 
3. 带 `ref` 的组件使用 `React.forwardRef`
4. 事件处理函数必须指定完整的事件类型

## 八 代码质量

1. 为复杂组件添加 JSDoc 注释说明功能 
2. 使用 `try-catch` 处理异步操作中的错误 
3. 提取复杂逻辑为自定义 Hook 或工具函数 
4. 避免魔法数字，使用命名常量 
5. 保持组件职责单一，复杂组件应拆分 
6. 添加 `aria-label` 等可访问性属性

## 九 禁止事项

1. 禁止使用隐式 `any` 类型
2. 禁止在 `useEffect` 中遗漏依赖项 
3. 禁止过度使用性能优化（如不必要的 `memo`） 
4. 禁止滥用 `useEffect`（能在事件处理中完成的不用 effect） 
5. 禁止深层组件嵌套（超过 3-4 层应考虑拆分）

