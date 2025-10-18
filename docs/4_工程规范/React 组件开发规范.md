# React 组件规范

本文档定义了项目中 React 组件的编写规范和最佳实践。

## 目录

- [文件结构](#文件结构)
- [命名规范](#命名规范)
- [组件结构](#组件结构)
- [类型定义](#类型定义)
- [Hooks 使用](#hooks-使用)
- [样式处理](#样式处理)
- [性能优化](#性能优化)
- [代码示例](#代码示例)

---

## 文件结构

### 组件目录结构

```
components/
  ├── ComponentName/
  │   ├── index.tsx              # 组件主文件
  │   ├── ComponentName.css      # 组件样式
  │   ├── Types.ts               # 类型定义（如果复杂）
  │   ├── hooks/                 # 自定义 Hooks（如果需要）
  │   │   └── useComponentLogic.ts
  │   ├── components/            # 子组件
  │   │   ├── SubComponent1.tsx
  │   │   └── SubComponent2.tsx
  │   └── utils/                 # 工具函数（如果需要）
  │       └── helpers.ts
```

### 简单组件

简单组件可以使用单文件结构：

```
components/
  ├── Button.tsx
  ├── Button.css
```

---

## 命名规范

### 组件命名

- **文件名**：使用 PascalCase，例如 `ChatArea.tsx`、`SystemPrompt.tsx`
- **组件名**：与文件名保持一致
- **CSS 文件**：与组件文件同名，使用 `.css` 后缀

```tsx
// ✅ 正确
// ChatArea.tsx
const ChatArea: React.FC = () => { ... }

// ❌ 错误
// chatArea.tsx
const chatArea = () => { ... }
```

### 变量和函数命名

- **状态变量**：使用 camelCase，语义明确
- **事件处理函数**：使用 `handle` 前缀
- **布尔变量**：使用 `is`、`has`、`should` 等前缀
- **常量**：使用 UPPER_SNAKE_CASE

```tsx
// ✅ 正确
const [inputValue, setInputValue] = useState('');
const [isSending, setIsSending] = useState(false);
const handleSend = () => { ... };
const MAX_MESSAGE_LENGTH = 1000;

// ❌ 错误
const [value, setValue] = useState('');
const [sending, setSending] = useState(false);
const send = () => { ... };
```

---

## 组件结构

### 标准组件模板

```tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useCustomHook } from '../../hooks/useCustomHook';
import './ComponentName.css';

// 1. 接口定义
interface ComponentNameProps {
  title: string;
  onSubmit?: (value: string) => void;
  disabled?: boolean;
}

// 2. 常量定义
const MAX_LENGTH = 100;
const DEFAULT_PLACEHOLDER = '请输入内容';

// 3. 组件定义
const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  onSubmit,
  disabled = false,
}) => {
  // 3.1 自定义 Hooks
  const { data, loading } = useCustomHook();
  
  // 3.2 状态定义
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  
  // 3.3 引用定义
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 3.4 计算值（使用 useMemo）
  const charCount = useMemo(() => value.length, [value]);
  
  // 3.5 副作用
  useEffect(() => {
    setIsValid(value.length > 0 && value.length <= MAX_LENGTH);
  }, [value]);
  
  // 3.6 事件处理函数
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);
  
  const handleSubmit = useCallback(() => {
    if (isValid) {
      onSubmit?.(value);
      setValue('');
    }
  }, [isValid, value, onSubmit]);
  
  // 3.7 辅助函数
  const formatValue = (val: string) => {
    return val.trim();
  };
  
  // 3.8 条件渲染
  if (loading) {
    return <div>加载中...</div>;
  }
  
  // 3.9 主渲染
  return (
    <div className="component-name">
      <h3>{title}</h3>
      <Input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        placeholder={DEFAULT_PLACEHOLDER}
        disabled={disabled}
        maxLength={MAX_LENGTH}
      />
      <div className="char-count">{charCount}/{MAX_LENGTH}</div>
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={handleSubmit}
        disabled={!isValid || disabled}
      >
        提交
      </Button>
    </div>
  );
};

// 4. 导出
export default ComponentName;
```

### 组件结构顺序

组件内部按以下顺序组织代码：

1. **导入语句**
   - React 相关
   - 第三方库
   - 项目内部模块
   - 样式文件

2. **类型定义**
   - Props 接口
   - 其他类型定义

3. **常量定义**

4. **组件定义**
   - 自定义 Hooks
   - 状态（useState）
   - 引用（useRef）
   - 计算值（useMemo）
   - 副作用（useEffect）
   - 事件处理函数（useCallback）
   - 辅助函数
   - 条件渲染
   - 主渲染（return）

5. **导出语句**

---

## 类型定义

### Props 类型

```tsx
// ✅ 正确：使用 interface 定义 Props
interface ChatAreaProps {
  // 必需属性
  assistantId: string;
  
  // 可选属性（使用 ?）
  maxMessages?: number;
  
  // 回调函数
  onMessageSent?: (message: string) => void;
  onError?: (error: Error) => void;
  
  // 联合类型
  theme?: 'light' | 'dark';
  
  // 子元素
  children?: React.ReactNode;
}

const ChatArea: React.FC<ChatAreaProps> = (props) => {
  // ...
};
```

### 事件处理类型

```tsx
// ✅ 使用明确的事件类型
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};

const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};
```

### 组件类型声明

```tsx
// ✅ 函数组件
const Component: React.FC<Props> = (props) => { ... };

// ✅ 带泛型的组件
const GenericComponent = <T,>(props: { items: T[] }) => { ... };

// ✅ 带 ref 的组件
const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return <input ref={ref} {...props} />;
  }
);
```

---

## Hooks 使用

### useState

```tsx
// ✅ 明确的初始值和类型
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<string[]>([]);

// ✅ 使用函数式更新
setCount(prev => prev + 1);
setItems(prev => [...prev, newItem]);

// ❌ 避免直接修改状态
items.push(newItem); // 错误！
setItems(items); // 不会触发重新渲染
```

### useEffect

```tsx
// ✅ 明确依赖项
useEffect(() => {
  fetchData();
}, [id]); // 依赖 id

// ✅ 清理副作用
useEffect(() => {
  const timer = setTimeout(() => {
    console.log('Delayed action');
  }, 1000);
  
  return () => {
    clearTimeout(timer); // 清理
  };
}, []);

// ❌ 避免遗漏依赖项
useEffect(() => {
  console.log(value); // 使用了 value
}, []); // 但没有声明依赖
```

### useCallback

```tsx
// ✅ 缓存事件处理函数
const handleClick = useCallback(() => {
  onItemClick(item.id);
}, [item.id, onItemClick]);

// ✅ 传递给子组件的函数
const handleDelete = useCallback((id: string) => {
  setItems(prev => prev.filter(item => item.id !== id));
}, []);

<ChildComponent onDelete={handleDelete} />
```

### useMemo

```tsx
// ✅ 缓存昂贵的计算
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// ✅ 缓存复杂对象
const config = useMemo(() => ({
  apiUrl: modelConfig.apiUrl,
  apiKey: modelConfig.apiKey,
  model: modelConfig.modelName,
}), [modelConfig]);

// ❌ 不要过度使用
const simpleValue = useMemo(() => a + b, [a, b]); // 不必要
```

### useRef

```tsx
// ✅ DOM 引用
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  inputRef.current?.focus();
}, []);

// ✅ 保存可变值（不触发重新渲染）
const timerRef = useRef<NodeJS.Timeout>();

timerRef.current = setTimeout(() => {
  // ...
}, 1000);
```

### 自定义 Hook

```tsx
// ✅ 自定义 Hook 命名以 use 开头
function useModelConfig() {
  const [config, setConfig] = useState<ModelConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadConfig();
  }, []);
  
  const loadConfig = async () => {
    try {
      setLoading(true);
      const data = await fetchConfig();
      setConfig(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return { config, loading, error, reload: loadConfig };
}

// 使用
const { config, loading, error } = useModelConfig();
```

---

## 样式处理

### CSS Modules 命名

```tsx
// ✅ 使用 kebab-case
.chat-area { }
.message-list { }
.send-btn { }

// ❌ 避免驼峰命名
.chatArea { }
.messageList { }
```

### 类名组合

```tsx
// ✅ 使用模板字符串动态类名
<div className={`message-item ${message.role}`}>
<div className={`button ${isActive ? 'active' : ''}`}>

// ✅ 使用 classnames 库（复杂情况）
import classNames from 'classnames';

<div className={classNames(
  'message-item',
  message.role,
  { 'is-sending': isSending }
)}>
```

### 内联样式

```tsx
// ✅ 用于动态样式
<div style={{ 
  width: `${progress}%`,
  backgroundColor: theme.color 
}}>

// ❌ 避免大量使用内联样式
<div style={{
  padding: '10px',
  margin: '20px',
  backgroundColor: '#fff',
  // ... 很多样式
}}>
```

---

## 性能优化

### 避免不必要的重新渲染

```tsx
// ✅ 使用 React.memo
const ExpensiveComponent = React.memo<Props>(({ data }) => {
  // 复杂渲染逻辑
  return <div>{/* ... */}</div>;
});

// ✅ 使用 useCallback 缓存回调
const ParentComponent = () => {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  
  return <ChildComponent onClick={handleClick} />;
};
```

### 列表渲染优化

```tsx
// ✅ 使用稳定的 key
{messages.map((message) => (
  <MessageItem 
    key={message.id}  // 使用唯一 ID
    message={message} 
  />
))}

// ❌ 避免使用索引作为 key（列表会变化时）
{items.map((item, index) => (
  <Item key={index} item={item} /> // 可能导致问题
))}
```

### 条件渲染优化

```tsx
// ✅ 提前返回
if (loading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorMessage error={error} />;
}

return <MainContent data={data} />;

// ✅ 使用短路运算符
{isLoggedIn && <UserProfile />}
{error && <ErrorBanner message={error} />}

// ✅ 使用三元运算符
{isEditing ? <EditForm /> : <DisplayView />}
```

### 懒加载

```tsx
// ✅ 路由级别懒加载
const ChatPage = React.lazy(() => import('./components/chat/ChatPage'));
const SettingsPage = React.lazy(() => import('./components/settings/SettingsPage'));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/chat" element={<ChatPage />} />
    <Route path="/settings" element={<SettingsPage />} />
  </Routes>
</Suspense>
```

---

## 代码示例

### 完整示例：ChatArea 组件

```tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input, Button, Empty, message } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import { useChatContext } from '../contexts/ChatContext';
import { useModelConfig } from '../hooks/UseModelConfig';
import { chatCompletion, ChatMessage } from '../services/AIService';
import './ChatArea.css';

const { TextArea } = Input;

/**
 * 聊天区域组件
 * 
 * 功能：
 * - 显示聊天消息列表
 * - 发送用户消息
 * - 调用 AI API 获取回复
 * - 自动滚动到最新消息
 */
const ChatArea: React.FC = () => {
  // Hooks
  const { currentAssistant, currentMessages, addMessage } = useChatContext();
  const { modelConfig, error: modelError } = useModelConfig();
  
  // State
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // Refs
  const messageListRef = useRef<HTMLDivElement>(null);
  
  // Effects
  useEffect(() => {
    // 自动滚动到底部
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [currentMessages]);
  
  // Event Handlers
  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || !currentAssistant || isSending) return;
    
    if (!modelConfig) {
      message.error(modelError || '未配置模型');
      return;
    }
    
    setIsSending(true);
    const userMessage = inputValue.trim();
    setInputValue('');
    
    // 添加用户消息
    addMessage({
      role: 'user',
      content: userMessage,
    });
    
    try {
      // 构建消息历史
      const messages: ChatMessage[] = [];
      
      if (currentAssistant.systemPrompt) {
        messages.push({
          role: 'system',
          content: currentAssistant.systemPrompt,
        });
      }
      
      // 添加最近 10 条消息作为上下文
      const recentMessages = currentMessages.slice(-10);
      messages.push(...recentMessages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })));
      
      messages.push({
        role: 'user',
        content: userMessage,
      });
      
      // 调用 AI API
      const result = await chatCompletion({
        apiUrl: modelConfig.apiUrl,
        apiKey: modelConfig.apiKey,
        model: modelConfig.modelName,
        messages,
        temperature: 0.7,
        maxTokens: 2000,
      });
      
      if (result.success && result.content) {
        addMessage({
          role: 'assistant',
          content: result.content,
          model: modelConfig.modelDisplayName,
          tokens: result.usage?.totalTokens?.toString(),
        });
      } else {
        message.error(result.error || '生成回复失败');
      }
    } catch (error) {
      console.error('Error calling AI API:', error);
      message.error('调用 AI 服务失败');
    } finally {
      setIsSending(false);
    }
  }, [inputValue, currentAssistant, isSending, modelConfig, modelError, currentMessages, addMessage]);
  
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);
  
  // Render
  if (!currentAssistant) {
    return (
      <div className="chat-area">
        <Empty description="请选择一个助手开始对话" />
      </div>
    );
  }
  
  return (
    <div className="chat-area">
      <div className="message-list" ref={messageListRef}>
        {currentMessages.length === 0 ? (
          <Empty description="开始新的对话吧" />
        ) : (
          currentMessages.map((msg) => (
            <div key={msg.id} className={`message-item ${msg.role}`}>
              <div className="message-content">
                <div className="message-text">{msg.content}</div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="input-area">
        <TextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息..."
          autoSize={{ minRows: 1, maxRows: 6 }}
          disabled={isSending}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={isSending}
          disabled={!inputValue.trim()}
        >
          发送
        </Button>
      </div>
    </div>
  );
};

export default ChatArea;
```

---

## 最佳实践总结

### ✅ 应该做的

1. **使用 TypeScript**：为所有组件和函数添加类型
2. **Props 解构**：在函数参数中解构 props
3. **useCallback/useMemo**：优化性能，避免不必要的重新渲染
4. **提前返回**：处理加载和错误状态
5. **命名清晰**：使用语义化的变量和函数名
6. **注释文档**：为复杂组件添加 JSDoc 注释
7. **错误处理**：使用 try-catch 处理异步操作
8. **可访问性**：添加 aria-label 等属性

### ❌ 不应该做的

1. **避免内联定义**：不在 render 中定义函数或对象
2. **避免深层嵌套**：拆分复杂组件
3. **避免魔法数字**：使用常量定义
4. **避免直接修改状态**：使用 setState 或 reducer
5. **避免遗漏依赖**：useEffect 依赖数组要完整
6. **避免过度优化**：不是所有组件都需要 memo
7. **避免滥用 useEffect**：能在事件处理中完成的不用 effect
8. **避免复杂的条件逻辑**：提取为函数或自定义 Hook

---

## 相关文档

- [TypeScript 语言规范](./TypeScript%20语言规范.md)
- [架构设计](../3_架构设计/架构设计.md)

