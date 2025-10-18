# TypeScript 语言规范

本文档定义了项目中 TypeScript 代码的编写规范和最佳实践。

## 目录

- [基本原则](#基本原则)
- [类型定义](#类型定义)
- [接口与类型别名](#接口与类型别名)
- [函数](#函数)
- [类](#类)
- [泛型](#泛型)
- [枚举](#枚举)
- [模块与导入](#模块与导入)
- [类型断言](#类型断言)
- [最佳实践](#最佳实践)

---

## 基本原则

### 严格模式

项目应启用 TypeScript 严格模式：

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### 显式类型注解

```tsx
// ✅ 推荐：显式类型注解（公共 API）
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ 可以：类型推断（局部变量）
const count = 10; // TypeScript 推断为 number
const name = 'Alice'; // 推断为 string

// ❌ 避免：隐式 any
function process(data) { // 错误：参数隐式具有 'any' 类型
  return data.value;
}
```

---

## 类型定义

### 基础类型

```tsx
// 基础类型
let isDone: boolean = false;
let count: number = 10;
let name: string = 'Alice';
let nothing: null = null;
let notDefined: undefined = undefined;

// 数组
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ['a', 'b', 'c'];

// 元组
let tuple: [string, number] = ['hello', 10];

// 对象
let user: {
  name: string;
  age: number;
  email?: string; // 可选属性
} = {
  name: 'Alice',
  age: 25,
};
```

### 联合类型

```tsx
// ✅ 使用联合类型表示多种可能
type Status = 'pending' | 'processing' | 'completed' | 'error';

let currentStatus: Status = 'pending';

// ✅ 联合类型的类型守卫
function handleValue(value: string | number) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}
```

### 交叉类型

```tsx
// ✅ 使用交叉类型组合多个类型
interface Timestamped {
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
}

type TimestampedUser = User & Timestamped;

const user: TimestampedUser = {
  id: '1',
  name: 'Alice',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-02',
};
```

### 字面量类型

```tsx
// ✅ 使用字面量类型限定精确值
type Theme = 'light' | 'dark' | 'auto';
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// ✅ 数字字面量
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

// ✅ 混合字面量
type Config = {
  mode: 'development' | 'production';
  port: 3000 | 8080;
};
```

---

## 接口与类型别名

### Interface vs Type

```tsx
// ✅ 使用 interface 定义对象形状（可扩展）
interface User {
  id: string;
  name: string;
  email: string;
}

// 接口可以扩展
interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// ✅ 使用 type 定义联合类型、元组等
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

type Point = [number, number];

type Callback = (value: string) => void;
```

### 接口定义

```tsx
// ✅ Props 接口
interface ButtonProps {
  // 必需属性
  label: string;
  
  // 可选属性
  disabled?: boolean;
  
  // 只读属性
  readonly id: string;
  
  // 回调函数
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  
  // 索引签名
  [key: string]: any;
}

// ✅ 配置接口
interface AppConfig {
  apiUrl: string;
  apiKey: string;
  timeout: number;
  retries: number;
}

// ✅ 服务接口
interface UserService {
  getUser(id: string): Promise<User>;
  createUser(data: Omit<User, 'id'>): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}
```

### 类型别名

```tsx
// ✅ 基础类型别名
type ID = string | number;
type Timestamp = string;
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

// ✅ 函数类型
type EventHandler = (event: Event) => void;
type AsyncFunction<T> = () => Promise<T>;
type Predicate<T> = (value: T) => boolean;

// ✅ 工具类型的组合
type RequiredUser = Required<User>;
type PartialUser = Partial<User>;
type UserWithoutEmail = Omit<User, 'email'>;
type UserIdAndName = Pick<User, 'id' | 'name'>;
```

---

## 函数

### 函数类型定义

```tsx
// ✅ 完整的函数类型注解
function add(a: number, b: number): number {
  return a + b;
}

// ✅ 箭头函数
const multiply = (a: number, b: number): number => a * b;

// ✅ 可选参数
function greet(name: string, greeting?: string): string {
  return `${greeting || 'Hello'}, ${name}!`;
}

// ✅ 默认参数
function createUser(name: string, role: string = 'user'): User {
  return { id: generateId(), name, role };
}

// ✅ 剩余参数
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}
```

### 函数重载

```tsx
// ✅ 函数重载
function formatValue(value: string): string;
function formatValue(value: number): string;
function formatValue(value: boolean): string;
function formatValue(value: string | number | boolean): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  return value ? 'Yes' : 'No';
}
```

### 异步函数

```tsx
// ✅ async/await 类型
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

// ✅ 使用泛型的异步函数
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json() as T;
}

// 使用
const user = await fetchData<User>('/api/users/1');
```

### 高阶函数

```tsx
// ✅ 返回函数的函数
function createMultiplier(factor: number): (value: number) => number {
  return (value: number) => value * factor;
}

const double = createMultiplier(2);
console.log(double(5)); // 10

// ✅ 接受函数作为参数
function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number
): Promise<T> {
  return fn().catch((error) => {
    if (maxAttempts <= 1) throw error;
    return retry(fn, maxAttempts - 1);
  });
}
```

---

## 类

### 类定义

```tsx
// ✅ 类的完整定义
class UserService {
  // 私有属性
  private apiUrl: string;
  
  // 受保护属性
  protected apiKey: string;
  
  // 公共属性
  public timeout: number;
  
  // 只读属性
  readonly version: string = '1.0.0';
  
  // 静态属性
  static instance: UserService;
  
  // 构造函数
  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.timeout = 5000;
  }
  
  // 方法
  async getUser(id: string): Promise<User> {
    const response = await fetch(`${this.apiUrl}/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });
    return response.json();
  }
  
  // 静态方法
  static getInstance(apiUrl: string, apiKey: string): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService(apiUrl, apiKey);
    }
    return UserService.instance;
  }
}
```

### 抽象类

```tsx
// ✅ 抽象类
abstract class Shape {
  abstract getArea(): number;
  abstract getPerimeter(): number;
  
  describe(): string {
    return `Area: ${this.getArea()}, Perimeter: ${this.getPerimeter()}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }
  
  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
  
  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}
```

---

## 泛型

### 泛型函数

```tsx
// ✅ 基础泛型函数
function identity<T>(value: T): T {
  return value;
}

const num = identity(42); // number
const str = identity('hello'); // string

// ✅ 多个泛型参数
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const result = pair('age', 25); // [string, number]

// ✅ 泛型约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Alice', age: 25 };
const name = getProperty(user, 'name'); // string
```

### 泛型接口

```tsx
// ✅ 泛型接口
interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface ApiResponse<T> {
  status: number;
  result: Result<T>;
  timestamp: string;
}

// 使用
const userResponse: ApiResponse<User> = {
  status: 200,
  result: {
    success: true,
    data: { id: '1', name: 'Alice' },
  },
  timestamp: '2024-01-01T00:00:00Z',
};
```

### 泛型类

```tsx
// ✅ 泛型类
class Queue<T> {
  private items: T[] = [];
  
  enqueue(item: T): void {
    this.items.push(item);
  }
  
  dequeue(): T | undefined {
    return this.items.shift();
  }
  
  peek(): T | undefined {
    return this.items[0];
  }
  
  get size(): number {
    return this.items.length;
  }
}

const numberQueue = new Queue<number>();
numberQueue.enqueue(1);
numberQueue.enqueue(2);
```

---

## 枚举

### 数字枚举

```tsx
// ✅ 数字枚举
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}

let dir: Direction = Direction.Up;
```

### 字符串枚举

```tsx
// ✅ 字符串枚举（推荐）
enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

function log(level: LogLevel, message: string): void {
  console.log(`[${level}] ${message}`);
}

log(LogLevel.INFO, 'Application started');
```

### 常量枚举

```tsx
// ✅ 常量枚举（编译时内联）
const enum HttpStatus {
  OK = 200,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalServerError = 500,
}

// 使用时会被内联为字面量值
const status = HttpStatus.OK; // 编译为 const status = 200;
```

### 联合类型替代枚举

```tsx
// ✅ 使用联合类型（更灵活）
type Status = 'pending' | 'processing' | 'completed' | 'error';

// 配合常量对象
const StatusValues = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  ERROR: 'error',
} as const;

type Status = typeof StatusValues[keyof typeof StatusValues];
```

---

## 模块与导入

### 导入语句

```tsx
// ✅ 具名导入
import { User, UserService } from './types';

// ✅ 默认导入
import React from 'react';

// ✅ 命名空间导入
import * as utils from './utils';

// ✅ 导入类型（类型导入）
import type { User } from './types';

// ✅ 混合导入
import React, { useState, useEffect } from 'react';

// ✅ 副作用导入
import './styles.css';
```

### 导出语句

```tsx
// ✅ 具名导出
export interface User {
  id: string;
  name: string;
}

export function createUser(name: string): User {
  return { id: generateId(), name };
}

// ✅ 默认导出
export default class UserService {
  // ...
}

// ✅ 重新导出
export { User } from './types/User';
export * from './utils';
```

---

## 类型断言

### as 断言

```tsx
// ✅ 类型断言（当你比 TypeScript 更了解类型时）
const input = document.getElementById('input') as HTMLInputElement;
input.value = 'Hello';

// ✅ 常量断言
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} as const;

// config.apiUrl 的类型是 'https://api.example.com' 而不是 string

// ❌ 避免：双重断言
const value = (data as any) as string; // 不推荐
```

### 类型守卫

```tsx
// ✅ typeof 类型守卫
function process(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}

// ✅ instanceof 类型守卫
function handleError(error: Error | string) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
}

// ✅ 自定义类型守卫
interface User {
  type: 'user';
  name: string;
}

interface Admin {
  type: 'admin';
  name: string;
  permissions: string[];
}

function isAdmin(user: User | Admin): user is Admin {
  return user.type === 'admin';
}

function greet(user: User | Admin) {
  if (isAdmin(user)) {
    console.log(`Admin: ${user.name}, Permissions: ${user.permissions.join(', ')}`);
  } else {
    console.log(`User: ${user.name}`);
  }
}
```

### 非空断言

```tsx
// ✅ 非空断言（当你确定值不为 null/undefined）
function getValue(): string | null {
  return 'value';
}

const value = getValue();
console.log(value!.toUpperCase()); // 使用 ! 断言非空

// ⚠️ 注意：应该优先使用类型守卫
if (value !== null) {
  console.log(value.toUpperCase());
}
```

---

## 最佳实践

### 1. 优先使用类型推断

```tsx
// ✅ 推荐：让 TypeScript 推断
const count = 10;
const name = 'Alice';
const items = [1, 2, 3];

// ❌ 不必要：显式注解简单类型
const count: number = 10;
const name: string = 'Alice';
```

### 2. 避免使用 any

```tsx
// ❌ 避免
function process(data: any) {
  return data.value;
}

// ✅ 使用具体类型
function process(data: { value: string }) {
  return data.value;
}

// ✅ 或使用泛型
function process<T extends { value: string }>(data: T) {
  return data.value;
}

// ✅ 或使用 unknown（类型安全的 any）
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data');
}
```

### 3. 使用工具类型

```tsx
// ✅ Partial - 所有属性可选
type PartialUser = Partial<User>;

// ✅ Required - 所有属性必需
type RequiredUser = Required<User>;

// ✅ Readonly - 所有属性只读
type ReadonlyUser = Readonly<User>;

// ✅ Pick - 选择部分属性
type UserBasicInfo = Pick<User, 'id' | 'name'>;

// ✅ Omit - 排除部分属性
type UserWithoutEmail = Omit<User, 'email'>;

// ✅ Record - 创建键值对类型
type UserMap = Record<string, User>;

// ✅ ReturnType - 获取函数返回类型
type Result = ReturnType<typeof fetchUser>;

// ✅ Parameters - 获取函数参数类型
type Params = Parameters<typeof createUser>;
```

### 4. 使用 const 断言

```tsx
// ✅ const 断言锁定类型
const routes = [
  { path: '/', component: 'Home' },
  { path: '/about', component: 'About' },
] as const;

// routes[0].path 的类型是 '/' 而不是 string

// ✅ 用于枚举值
const STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

type Status = typeof STATUS[keyof typeof STATUS];
// 'pending' | 'success' | 'error'
```

### 5. 正确处理 null/undefined

```tsx
// ✅ 使用可选链
const email = user?.profile?.email;

// ✅ 使用空值合并
const name = user.name ?? 'Anonymous';

// ✅ 类型守卫
if (user !== null && user !== undefined) {
  console.log(user.name);
}

// ✅ 非空断言（确定时）
function getUser(): User | null {
  return { id: '1', name: 'Alice' };
}

const user = getUser()!; // 确定不为 null
```

### 6. 文档注释

```tsx
/**
 * 用户服务类
 * 
 * @example
 * ```ts
 * const service = new UserService('https://api.example.com', 'key');
 * const user = await service.getUser('123');
 * ```
 */
export class UserService {
  /**
   * 获取用户信息
   * 
   * @param id - 用户 ID
   * @returns Promise 包含用户对象
   * @throws {Error} 当用户不存在时抛出错误
   */
  async getUser(id: string): Promise<User> {
    // ...
  }
}
```

### 7. 类型组织

```tsx
// ✅ 推荐的类型文件结构
// types/User.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CreateUserData {
  name: string;
  email: string;
}

export type UpdateUserData = Partial<CreateUserData>;

// types/index.ts
export * from './User';
export * from './Post';
export * from './Comment';
```

---

## 相关文档

- [React 组件规范](./React%20组件规范.md)
- [架构设计](../3_架构设计/架构设计.md)

