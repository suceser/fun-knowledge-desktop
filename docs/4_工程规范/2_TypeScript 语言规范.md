# TypeScript 语言规范

## 一 最佳实践

1. 优先使用类型推断，不要重复声明显而易见的类型
2. 禁止使用 `any`，必要时使用 `unknown` 或泛型
3. 使用 `const` 断言锁定字面量类型
4. 为公共 API 添加 JSDoc 注释（包括 `@param`、`@returns`、`@example`）
5. 类型文件按功能模块组织，使用 `index.ts` 统一导出
6. 复杂类型提取为单独的类型别名或接口
7. 免过度使用类型断言，应该让 TypeScript 推断

## 二 代码组织

1. ts 文件名的每个单词首字母必须大写，例如 ChatMessage.ts、UseApiHooks.ts/
2. 一个文件导出一个主要类型/接口，相关类型可放在同一文件
3. 类型定义文件放在 `models/` 目录
4. 共享类型放在项目根级别的 `models/` 目录
5. 组件 Props 类型与组件放在同一文件

## 三 语法规则

### 基本配置

1. 启用严格模式（`strict: true`），包括 `noImplicitAny`、`strictNullChecks` 等
2. 公共 API 使用显式类型注解，局部变量可使用类型推断
3. 禁止使用隐式 `any` 类型

### 类型定义

1. 基础类型直接声明：`boolean`、`number`、`string`、`null`、`undefined`
2. 数组使用 `type[]` 或 `Array<type>` 语法
3. 元组明确指定每个位置的类型：`[string, number]`
4. 对象类型声明可选属性使用 `?`（如 `email?: string`）
5. 使用联合类型表示多种可能（如 `'pending' | 'completed' | 'error'`）
6. 使用交叉类型组合多个类型（如 `User & Timestamped`） 
7. 使用字面量类型限定精确值（如 `type Theme = 'light' | 'dark'`）

### Interface vs Type

1. 使用 `interface` 定义对象形状和可扩展的类型 
2. 使用 `type` 定义联合类型、元组、函数类型等 
3. Props 接口统一使用 `interface` 定义 
4. 服务接口使用 `interface` 并定义所有方法签名

### 函数

1. 函数必须明确指定参数类型和返回类型 
2. 可选参数使用 `?`，默认参数直接赋值 
3. 剩余参数指定数组类型（如 `...numbers: number[]`） 
4. 使用函数重载处理不同参数类型的同名函数 
5. 异步函数返回类型使用 `Promise<T>`
6. 高阶函数明确指定函数参数和返回的函数类型

### 类

1. 类属性必须指定访问修饰符（`private`、`protected`、`public`） 
2. 只读属性使用 `readonly` 关键字 
3. 静态属性和方法使用 `static` 关键字 
4. 抽象类使用 `abstract` 关键字，抽象方法必须在子类实现

### 泛型

1. 泛型函数使用 `<T>` 声明类型参数 
2. 多个泛型参数使用不同字母（如 `<T, U>`） 
3. 使用泛型约束限制类型范围（如 `<T extends keyof User>`） 
4. 泛型接口和类在定义时指定类型参数

### 枚举

1. 优先使用字符串枚举而非数字枚举 
2. 常量枚举使用 `const enum`（编译时内联） 
3. 考虑使用联合类型 + 常量对象替代枚举（更灵活）

### 模块与导入

1. 使用具名导入（`import { User } from './model'`） 
2. 仅导入类型使用 `import type { User }`
3. 避免使用命名空间导入（`import * as`），除非必要 
4. 重新导出使用 `export * from './module'` 或 `export { Type }`

### 类型断言

1. 使用 `as` 语法进行类型断言（避免双重断言）
2. 使用 `as const` 创建常量断言（锁定字面量类型）
3. 使用 `typeof` 和 `instanceof` 进行类型守卫 
4. 自定义类型守卫使用 `value is Type` 语法 
5. 非空断言 `!` 仅在确定值不为 `null/undefined` 时使用

### 工具类型

1. 使用 `Partial<T>` 将所有属性变为可选 
2. 使用 `Required<T>` 将所有属性变为必需 
3. 使用 `Readonly<T>` 将所有属性变为只读 
4. 使用 `Pick<T, K>` 选择部分属性 
5. 使用 `Omit<T, K>` 排除部分属性 
6. 使用 `Record<K, V>` 创建键值对类型 
7. 使用 `ReturnType<typeof fn>` 获取函数返回类型 
8. 使用 `Parameters<typeof fn>` 获取函数参数类型

### null/undefined 处理

1. 使用可选链 `?.` 安全访问嵌套属性
2. 使用空值合并 `??` 提供默认值 
3. 使用类型守卫而非非空断言检查 `null/undefined`

## 四 禁止事项

1. 禁止使用 `any` 类型（除非与外部库交互且无法避免）
2. 禁止省略函数返回类型（公共 API 必须明确）
3. 禁止双重断言（`as any as Type`）
4. 禁止在严格模式下使用 `!` 非空断言（应使用类型守卫）
5. 禁止使用命名空间（`namespace`），使用 ES6 模块
6. 禁止忽略 TypeScript 错误（使用 `@ts-ignore` 或 `@ts-expect-error`）