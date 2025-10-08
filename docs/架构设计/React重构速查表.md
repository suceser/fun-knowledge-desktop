# React 重构速查表 ⚡

> 快速参考指南 - 当你的 TSX 文件逻辑过多时

---

## 🎯 快速判断

```
文件行数 > 300?        → 需要重构
状态数量 > 8?         → 提取 Hooks
函数数量 > 15?        → 拆分组件
重复代码 > 3?         → 抽象复用
```

---

## 🔧 5 大重构策略

### 1️⃣ 拆分子组件

```typescript
// ❌ 之前：一个大组件 (500 行)
function BigComponent() {
  return (
    <div>
      {/* 100 行代码 */}
      {/* 200 行代码 */}
      {/* 200 行代码 */}
    </div>
  );
}

// ✅ 之后：3 个小组件 (每个 ~50 行)
function Header() { /* ... */ }
function Content() { /* ... */ }
function Footer() { /* ... */ }

function Page() {
  return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}
```

---

### 2️⃣ 提取自定义 Hooks

```typescript
// ❌ 之前：逻辑混在组件中
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);
  
  // ...
}

// ✅ 之后：逻辑提取到 Hook
function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);
  
  return { users, loading };
}

function UserList() {
  const { users, loading } = useUsers();
  return <div>...</div>;
}
```

---

### 3️⃣ 提取业务逻辑到 Service

```typescript
// ❌ 之前：业务逻辑在组件中
function Login() {
  const handleLogin = async () => {
    const response = await fetch('/api/login', { /* ... */ });
    // 复杂的处理逻辑
  };
}

// ✅ 之后：逻辑移到 Service
// services/authService.ts
export async function login(username, password) {
  const response = await fetch('/api/login', { /* ... */ });
  return response.json();
}

// Login.tsx
function Login() {
  const handleLogin = () => login(username, password);
}
```

---

### 4️⃣ 类型定义独立

```typescript
// ❌ 之前：类型分散在各个文件
// UserList.tsx
interface User { id: number; name: string; }

// UserProfile.tsx
interface User { id: number; name: string; }  // 重复！

// ✅ 之后：统一类型定义
// types/user.ts
export interface User {
  id: number;
  name: string;
}

// 其他文件导入
import { User } from '@/types/user';
```

---

### 5️⃣ 常量配置独立

```typescript
// ❌ 之前：魔法数字散落各处
function ProductList() {
  const pageSize = 20;  // 硬编码
  const apiUrl = 'https://api.example.com';  // 硬编码
}

// ✅ 之后：集中管理常量
// constants/config.ts
export const PAGINATION = { PAGE_SIZE: 20 } as const;
export const API_URL = 'https://api.example.com';

// ProductList.tsx
import { PAGINATION, API_URL } from '@/constants/config';
```

---

## 📁 标准目录结构

```
ComponentName/
├── index.tsx              # 主组件
├── SubComponent1.tsx      # 子组件
├── SubComponent2.tsx      # 子组件
├── hooks/
│   └── useCustomHook.ts   # 自定义 Hooks
├── services/
│   └── apiService.ts      # 业务逻辑
├── types/
│   └── index.ts           # 类型定义
├── constants/
│   └── config.ts          # 常量配置
└── ComponentName.css      # 样式
```

---

## 🎨 命名规范速查

| 类型 | 规范 | 示例 |
|-----|------|------|
| 组件 | PascalCase | `UserProfile` |
| Hooks | use + 功能 | `useAuth` |
| 服务 | 功能 + Service | `authService` |
| 类型 | PascalCase | `User` |
| 常量 | UPPER_SNAKE | `API_URL` |
| 函数 | camelCase | `formatDate` |

---

## ⚡ 性能优化速查

```typescript
// 1. 避免重复渲染
const Component = React.memo(({ data }) => <div>{data}</div>);

// 2. 缓存计算结果
const result = useMemo(() => expensiveCalc(data), [data]);

// 3. 缓存函数引用
const handleClick = useCallback(() => {}, []);

// 4. 懒加载组件
const HeavyComponent = React.lazy(() => import('./Heavy'));
```

---

## 🧪 测试优先级

```
1. 关键业务逻辑 (必须)     ⭐⭐⭐⭐⭐
2. 用户交互流程 (重要)     ⭐⭐⭐⭐
3. 边界条件 (需要)         ⭐⭐⭐
4. UI 渲染 (可选)          ⭐⭐
```

---

## 📋 重构检查清单

### 开始前
- [ ] 确保有测试覆盖
- [ ] 备份当前代码
- [ ] 明确重构目标

### 进行中
- [ ] 小步迭代
- [ ] 功能保持不变
- [ ] 持续运行测试

### 完成后
- [ ] 所有测试通过
- [ ] 代码审查
- [ ] 更新文档

---

## 🚨 常见反模式

### ❌ 避免这些

```typescript
// 1. 过深的嵌套
<div>
  <div>
    <div>
      <div>  {/* 太深了！*/}
      
// 2. 过多的 props
<Component prop1 prop2 prop3 ... prop20 />  {/* 太多了！*/}

// 3. 巨型函数
function handle() {
  // 200 行代码...  {/* 太长了！*/}
}

// 4. any 类型
const data: any = ...;  {/* 不安全！*/}
```

---

## 💡 何时重构

### ✅ 好的时机
- 添加新功能前
- 修复 bug 后
- 代码审查时
- 重复代码出现 3 次时

### ❌ 不好的时机
- 临近发布日期
- 没有测试覆盖
- 不理解业务逻辑
- 为了重构而重构

---

## 🎯 黄金规则

```
1️⃣ 一个文件 < 300 行
2️⃣ 一个组件 < 150 行
3️⃣ 一个函数 < 50 行
4️⃣ 一个 Hook < 100 行
5️⃣ Props 数量 < 7 个
```

---

## 🔗 快速链接

- [完整重构指南](./React组件重构最佳实践.md)
- [React 官方文档](https://react.dev)
- [TypeScript 手册](https://www.typescriptlang.org)

---

**记住**：代码质量 > 代码数量 🎯

---

## 📞 需要帮助？

遇到问题时问自己：

1. 这个组件做了几件事？ → **拆分组件**
2. 这段逻辑能复用吗？ → **提取 Hooks**
3. 这是业务逻辑吗？ → **移到 Service**
4. 这个类型重复了吗？ → **独立类型文件**
5. 这个值写死了吗？ → **提取到常量**

---

**保存此速查表，随时参考！** 📖✨

