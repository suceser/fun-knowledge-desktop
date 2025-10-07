# React 组件重构最佳实践

## 📋 目录

1. [何时需要重构](#何时需要重构)
2. [重构策略](#重构策略)
3. [实战案例：ModelSettings 重构](#实战案例)
4. [最佳实践总结](#最佳实践总结)

---

## 🚨 何时需要重构

### 判断标准

当组件出现以下情况时，建议进行重构：

| 指标 | 临界值 | 说明 |
|-----|-------|------|
| 文件行数 | > 300 行 | 单个文件过长，难以维护 |
| 组件层级 | > 3 层嵌套 | JSX 结构过深，可读性差 |
| 状态数量 | > 8 个 useState | 状态管理混乱 |
| 函数数量 | > 15 个函数 | 逻辑分散，职责不清 |
| 依赖数量 | > 10 个 import | 耦合度高 |
| 重复代码 | > 3 次相同逻辑 | 违反 DRY 原则 |

### 代码异味 (Code Smells)

```typescript
// ❌ 坏的例子
function HugeComponent() {
  // 20+ useState
  const [data1, setData1] = useState();
  const [data2, setData2] = useState();
  // ...
  
  // 50+ 函数
  const handleClick1 = () => {};
  const handleClick2 = () => {};
  // ...
  
  // 500+ 行 JSX
  return (
    <div>
      {/* 深度嵌套的 JSX */}
    </div>
  );
}
```

---

## 🛠 重构策略

### 策略 1️⃣：拆分子组件 (Component Extraction)

#### 原则
- **单一职责**：一个组件只做一件事
- **可复用性**：提取通用组件
- **清晰边界**：明确的 props 接口

#### 示例

**重构前** (300 行组件):
```typescript
function ProductPage() {
  return (
    <div>
      {/* 100 行头部 */}
      <header>...</header>
      
      {/* 150 行产品列表 */}
      <div className="products">...</div>
      
      {/* 50 行页脚 */}
      <footer>...</footer>
    </div>
  );
}
```

**重构后** (3 个小组件):
```typescript
// components/Header.tsx (30 行)
function Header({ title, logo }) {
  return <header>...</header>;
}

// components/ProductList.tsx (50 行)
function ProductList({ products, onSelect }) {
  return <div>...</div>;
}

// components/Footer.tsx (20 行)
function Footer({ links }) {
  return <footer>...</footer>;
}

// ProductPage.tsx (30 行)
function ProductPage() {
  return (
    <div>
      <Header title="商品" logo="logo.png" />
      <ProductList products={products} onSelect={handleSelect} />
      <Footer links={footerLinks} />
    </div>
  );
}
```

#### 拆分原则

1. **按功能拆分**
   ```
   UserProfile → Avatar + UserInfo + UserActions
   ```

2. **按布局拆分**
   ```
   Dashboard → Sidebar + MainContent + TopBar
   ```

3. **按数据流拆分**
   ```
   Form → FormInput + FormValidation + FormSubmit
   ```

---

### 策略 2️⃣：提取自定义 Hooks (Custom Hooks)

#### 原则
- **逻辑复用**：跨组件共享状态逻辑
- **关注点分离**：UI 与业务逻辑分离
- **可测试性**：独立测试逻辑

#### 示例

**重构前**:
```typescript
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetchUsers()
      .then(data => setUsers(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);
  
  // ... 更多逻辑
}
```

**重构后**:
```typescript
// hooks/useUsers.ts
function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetchUsers()
      .then(data => setUsers(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);
  
  return { users, loading, error };
}

// UserList.tsx
function UserList() {
  const { users, loading, error } = useUsers();
  
  // 只关注 UI
  return <div>...</div>;
}
```

#### 常见自定义 Hooks

| Hook 类型 | 用途 | 示例 |
|----------|------|------|
| useData | 数据获取 | `useUsers()`, `useProducts()` |
| useForm | 表单管理 | `useFormValidation()` |
| useModal | 弹窗管理 | `useModal()` |
| useAsync | 异步操作 | `useAsyncOperation()` |
| useLocalStorage | 本地存储 | `useLocalStorage('key')` |

---

### 策略 3️⃣：提取业务逻辑 (Service Layer)

#### 原则
- **业务逻辑集中**：统一管理
- **易于测试**：纯函数，无副作用
- **可维护性**：逻辑修改不影响 UI

#### 示例

**重构前**:
```typescript
function LoginForm() {
  const handleLogin = async () => {
    // 组件内部直接写业务逻辑
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    // ... 复杂的错误处理
  };
}
```

**重构后**:
```typescript
// services/authService.ts
export async function login(username: string, password: string) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  
  if (!response.ok) {
    throw new Error('登录失败');
  }
  
  return response.json();
}

// LoginForm.tsx
function LoginForm() {
  const handleLogin = async () => {
    try {
      const user = await login(username, password);
      // 处理成功
    } catch (error) {
      // 处理错误
    }
  };
}
```

---

### 策略 4️⃣：类型定义独立 (Type Definitions)

#### 原则
- **类型复用**：跨文件共享类型
- **清晰接口**：明确数据结构
- **类型安全**：避免运行时错误

#### 示例

**重构前**:
```typescript
// UserList.tsx
interface User {
  id: number;
  name: string;
}

// UserProfile.tsx
interface User {  // 重复定义！
  id: number;
  name: string;
}
```

**重构后**:
```typescript
// types/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserProfile extends User {
  avatar: string;
  bio: string;
}

// UserList.tsx
import { User } from '@/types/user';

// UserProfile.tsx
import { UserProfile } from '@/types/user';
```

---

### 策略 5️⃣：常量配置独立 (Constants)

#### 原则
- **配置集中**：便于修改
- **避免魔法数字**：增加可读性
- **环境配置**：区分开发/生产

#### 示例

**重构前**:
```typescript
function ProductList() {
  const PAGE_SIZE = 20;  // 散落各处
  const API_URL = 'https://api.example.com';  // 硬编码
}
```

**重构后**:
```typescript
// constants/config.ts
export const PAGINATION = {
  PAGE_SIZE: 20,
  MAX_PAGES: 100,
} as const;

export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  USERS: '/api/users',
} as const;

// ProductList.tsx
import { PAGINATION, API_ENDPOINTS } from '@/constants/config';
```

---

## 🎯 实战案例：ModelSettings 重构

### 重构前的问题

| 问题 | 影响 |
|-----|------|
| 1115 行单文件 | 难以阅读和维护 |
| 20+ useState | 状态管理混乱 |
| 50+ 函数定义 | 职责不清晰 |
| 业务逻辑与 UI 混合 | 难以测试 |
| 类型定义分散 | 重复代码 |

### 重构方案

```
ModelSettings.tsx (1115 行)
    ↓
    ↓ 重构
    ↓
┌─────────────────────────────────────┐
│ 组件层 (Components)                  │
├─────────────────────────────────────┤
│ ├─ index.tsx (100 行)               │
│ ├─ ProviderList.tsx (80 行)         │
│ ├─ ApiKeySection.tsx (60 行)        │
│ ├─ ModelList.tsx (50 行)            │
│ └─ modals/                          │
│     └─ SelectModelModal.tsx (70 行) │
├─────────────────────────────────────┤
│ 逻辑层 (Hooks)                       │
├─────────────────────────────────────┤
│ ├─ useProviders.ts (80 行)          │
│ └─ useApiKeyTest.ts (100 行)        │
├─────────────────────────────────────┤
│ 服务层 (Services)                    │
├─────────────────────────────────────┤
│ └─ apiKeyService.ts (120 行)        │
├─────────────────────────────────────┤
│ 类型层 (Types)                       │
├─────────────────────────────────────┤
│ └─ types/index.ts (40 行)           │
├─────────────────────────────────────┤
│ 配置层 (Constants)                   │
├─────────────────────────────────────┤
│ └─ constants/providers.ts (200 行)  │
└─────────────────────────────────────┘
```

### 目录结构

```
ModelSettings/
├── index.tsx                      # 主组件 (100 行)
├── ProviderList.tsx               # 服务商列表 (80 行)
├── ApiKeySection.tsx              # API Key 配置 (60 行)
├── ModelList.tsx                  # 模型列表 (50 行)
├── modals/
│   ├── SelectModelModal.tsx       # 选择模型对话框 (70 行)
│   └── AddModelModal.tsx          # 添加模型对话框 (80 行)
├── hooks/
│   ├── useProviders.ts            # 服务商管理 Hook (80 行)
│   └── useApiKeyTest.ts           # API 测试 Hook (100 行)
├── services/
│   └── apiKeyService.ts           # API 测试服务 (120 行)
├── types/
│   └── index.ts                   # 类型定义 (40 行)
├── constants/
│   └── providers.ts               # 服务商配置 (200 行)
└── ModelSettings.css              # 样式文件
```

### 重构效果对比

| 指标 | 重构前 | 重构后 | 改善 |
|-----|-------|-------|------|
| 单文件行数 | 1115 | ~100 | ✅ -91% |
| 文件数量 | 1 | 11 | ⚠️ +1000% |
| 可维护性 | ⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ 大幅提升 |
| 可测试性 | ⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ 大幅提升 |
| 可复用性 | ⭐⭐ | ⭐⭐⭐⭐ | ✅ 提升 |

---

## ✅ 最佳实践总结

### 1. 组件设计原则

#### SOLID 原则在 React 中的应用

- **S - 单一职责**：一个组件只负责一个功能
- **O - 开闭原则**：通过 props 扩展，不修改组件内部
- **L - 里氏替换**：子组件可以替换父组件
- **I - 接口隔离**：props 接口最小化
- **D - 依赖倒置**：依赖抽象（接口）而非具体实现

#### 组件大小建议

```
📏 组件大小指南
├─ 微型组件: < 50 行      (Button, Input)
├─ 小型组件: 50-150 行     (Card, Form)
├─ 中型组件: 150-300 行    (Table, Modal)
└─ 大型组件: > 300 行      ⚠️ 需要拆分！
```

---

### 2. 状态管理层次

```
层级 1: Local State (useState)
  └─ 仅当前组件使用

层级 2: Custom Hooks
  └─ 多个组件复用逻辑

层级 3: Context API
  └─ 全局状态，避免 prop drilling

层级 4: 状态管理库 (Redux/Zustand)
  └─ 复杂应用，多层级状态
```

---

### 3. 文件组织结构

#### 推荐结构

```
src/
├── components/          # 通用组件
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── Button.css
│   └── Input/
├── pages/              # 页面组件
│   └── Settings/
│       ├── ModelSettings/
│       │   ├── index.tsx
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── services/
│       │   └── types/
├── hooks/              # 全局 Hooks
├── services/           # API 服务
├── utils/              # 工具函数
├── types/              # 全局类型
└── constants/          # 全局常量
```

---

### 4. 命名规范

| 类型 | 命名规范 | 示例 |
|-----|---------|------|
| 组件 | PascalCase | `UserProfile.tsx` |
| Hooks | use + 功能 | `useAuth.ts` |
| 服务 | 功能 + Service | `authService.ts` |
| 类型 | PascalCase | `User`, `ApiResponse` |
| 常量 | UPPER_SNAKE_CASE | `API_TIMEOUT` |
| 工具函数 | camelCase | `formatDate` |

---

### 5. Props 设计原则

#### ✅ 好的 Props 设计

```typescript
interface UserCardProps {
  // 明确的类型
  user: User;
  
  // 可选的配置
  showAvatar?: boolean;
  
  // 事件回调
  onUserClick?: (user: User) => void;
  
  // 自定义渲染
  renderActions?: (user: User) => React.ReactNode;
}
```

#### ❌ 不好的 Props 设计

```typescript
interface BadProps {
  // ❌ 过于宽泛
  data: any;
  
  // ❌ 参数过多
  prop1: string;
  prop2: number;
  // ... 20+ props
  
  // ❌ 不明确的命名
  flag: boolean;
}
```

---

### 6. 性能优化

#### 优化检查清单

- [ ] 使用 `React.memo` 避免不必要的渲染
- [ ] 使用 `useMemo` 缓存计算结果
- [ ] 使用 `useCallback` 缓存函数引用
- [ ] 懒加载大型组件 (`React.lazy`)
- [ ] 虚拟滚动长列表
- [ ] 防抖/节流频繁操作

#### 示例

```typescript
// ✅ 性能优化
const UserList = React.memo(({ users }) => {
  // 缓存过滤结果
  const filteredUsers = useMemo(
    () => users.filter(u => u.active),
    [users]
  );
  
  // 缓存回调函数
  const handleClick = useCallback(
    (user) => console.log(user),
    []
  );
  
  return <div>...</div>;
});
```

---

### 7. 测试策略

#### 测试金字塔

```
        /\
       /  \  E2E Tests (10%)
      /----\
     / 集成  \  Integration Tests (30%)
    /--------\
   /   单元    \  Unit Tests (60%)
  /____________\
```

#### 测试重点

1. **组件测试**：渲染、交互、props
2. **Hook 测试**：状态变化、副作用
3. **Service 测试**：API 调用、错误处理
4. **工具函数测试**：边界条件、异常

---

## 🎓 学习资源

### 推荐阅读

1. [React 官方文档](https://react.dev)
2. [Patterns.dev](https://www.patterns.dev)
3. [Kent C. Dodds Blog](https://kentcdodds.com/blog)
4. [Tao of React](https://alexkondov.com/tao-of-react/)

### 视频教程

- [React Best Practices 2024](https://www.youtube.com)
- [Clean Code React](https://www.youtube.com)

---

## 📝 重构检查清单

### 开始重构前

- [ ] 确保有完整的测试覆盖
- [ ] 备份当前代码
- [ ] 明确重构目标
- [ ] 评估工作量和风险

### 重构过程中

- [ ] 小步迭代，频繁提交
- [ ] 保持功能不变
- [ ] 持续运行测试
- [ ] 及时文档更新

### 重构完成后

- [ ] 所有测试通过
- [ ] 代码审查
- [ ] 性能对比
- [ ] 更新文档

---

## 🚀 总结

### 核心要点

1. ✅ **组件要小**：单一职责，易于维护
2. ✅ **逻辑分离**：Hooks 和 Services 分离业务逻辑
3. ✅ **类型安全**：TypeScript 类型定义独立
4. ✅ **可测试性**：每个单元都可独立测试
5. ✅ **可复用性**：提取通用组件和逻辑

### 重构不是银弹

- ⚠️ 不要过度工程化
- ⚠️ 评估重构成本和收益
- ⚠️ 保持代码简单明了
- ⚠️ 根据项目规模选择策略

---

**记住**：好的代码是逐步演进的，不是一蹴而就的。从小处着手，持续改进！🎯

