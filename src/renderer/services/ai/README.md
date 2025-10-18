# AI 服务模块

本目录包含与大模型 API 交互的所有功能模块。

## 目录结构

```
ai/
├── Index.ts              # 统一导出接口
├── Types.ts              # 类型定义
├── ChatCompletion.ts     # 聊天补全核心功能
├── UrlUtils.ts           # URL 处理工具
├── RequestBuilder.ts     # 请求构建器
├── RrrorHandler.ts       # 错误处理器
├── StreamHandler.ts      # 流式响应处理
├── ResponseHandler.ts    # 非流式响应处理
└── README.md            # 本文档
```

## 模块说明

### 1. Types.ts
定义所有 AI 服务相关的类型：
- `ChatMessage` - 聊天消息接口
- `ChatCompletionOptions` - 聊天补全选项
- `ChatCompletionResult` - 聊天补全结果
- `TokenUsage` - Token 使用情况
- `ApiResponse` - API 响应数据结构

### 2. ChatCompletion.ts
核心功能模块，提供 `chatCompletion` 函数：
- 调用大模型 API
- 支持流式和非流式响应
- 统一的错误处理

### 3. UrlUtils.ts
URL 处理工具：
- `normalizeApiUrl` - 标准化 API URL
- `buildChatEndpoint` - 构建聊天端点
- `prepareEndpointUrl` - 准备完整的端点 URL

### 4. RequestBuilder.ts
请求构建工具：
- `buildRequestBody` - 构建请求体
- `buildRequestHeaders` - 构建请求头

### 5. RrrorHandler.ts
错误处理工具：
- `getErrorMessageByStatus` - 根据状态码获取错误消息
- `extractErrorMessage` - 从响应中提取错误消息
- `handleApiError` - 处理 API 错误
- `handleNetworkError` - 处理网络错误

### 6. StreamHandler.ts
流式响应处理：
- `handleStreamResponse` - 处理 SSE (Server-Sent Events) 流式响应
- 支持实时接收和处理流式内容

### 7. ResponseHandler.ts
非流式响应处理：
- `handleNormalResponse` - 处理标准 JSON 响应
- 提取内容和 Token 使用情况

### 8. Index.ts
统一导出接口，对外暴露所有公共 API。

## 使用示例

### 基本用法

```typescript
import { chatCompletion } from '@/services/ai';

const result = await chatCompletion({
  apiUrl: 'https://api.example.com/v1',
  apiKey: 'your-api-key',
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' }
  ],
  temperature: 0.7,
  maxTokens: 2000,
});

if (result.success) {
  console.log('AI 回复:', result.content);
  console.log('Token 使用:', result.usage);
} else {
  console.error('错误:', result.error);
}
```

### 流式响应

```typescript
import { chatCompletion } from '@/services/ai';

const result = await chatCompletion({
  apiUrl: 'https://api.example.com/v1',
  apiKey: 'your-api-key',
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'user', content: 'Tell me a story.' }
  ],
  stream: true,
  onStream: (chunk) => {
    // 实时接收流式内容
    console.log('接收到内容:', chunk);
  },
});

if (result.success) {
  console.log('完整内容:', result.content);
}
```

### 在 React 组件中使用

```typescript
import React, { useState } from 'react';
import { chatCompletion, ChatMessage } from '@/services/ai';

function ChatComponent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content: string) => {
    setLoading(true);

    // 添加用户消息
    const userMessage: ChatMessage = { role: 'user', content };
    setMessages([...messages, userMessage]);

    // 调用 AI
    const result = await chatCompletion({
      apiUrl: 'https://api.example.com/v1',
      apiKey: 'your-api-key',
      model: 'gpt-3.5-turbo',
      messages: [...messages, userMessage],
    });

    setLoading(false);

    if (result.success) {
      // 添加 AI 回复
      const aiMessage: ChatMessage = { 
        role: 'assistant', 
        content: result.content 
      };
      setMessages([...messages, userMessage, aiMessage]);
    } else {
      console.error('AI 调用失败:', result.error);
    }
  };

  return (
    <div>
      {/* 渲染消息列表 */}
      {messages.map((msg, idx) => (
        <div key={idx}>{msg.content}</div>
      ))}
      {/* 输入框 */}
    </div>
  );
}
```

## 设计原则

### 1. 单一职责
每个模块只负责一个特定的功能：
- URL 处理只在 `UrlUtils.ts`
- 错误处理只在 `RrrorHandler.ts`
- 流式响应只在 `StreamHandler.ts`

### 2. 可测试性
所有函数都是纯函数或具有明确的输入输出，便于单元测试。

### 3. 可扩展性
模块化设计使得添加新功能变得简单：
- 添加新的 API 端点：在 `UrlUtils.ts` 中添加
- 添加新的错误类型：在 `RrrorHandler.ts` 中添加
- 支持新的响应格式：在 `ResponseHandler.ts` 中添加

### 4. 类型安全
所有接口和函数都有明确的 TypeScript 类型定义。

## 错误处理

模块提供统一的错误处理机制：

```typescript
// 所有错误都通过 ChatCompletionResult 返回
interface ChatCompletionResult {
  success: boolean;
  content?: string;
  error?: string;  // 如果失败，error 字段包含错误信息
  usage?: TokenUsage;
}
```

常见错误类型：
- `401` - API 密钥无效或已过期
- `403` - 无权访问该模型或 API
- `404` - 模型不存在或 API 地址错误
- `429` - 请求过于频繁
- `500` - 服务器内部错误
- 网络错误 - 网络连接失败

## 性能优化

### 1. 流式响应
对于长文本生成，使用流式响应可以：
- 提升用户体验（实时显示）
- 降低首字响应时间
- 减少内存占用

### 2. 请求优化
- 合理设置 `maxTokens` 限制
- 使用适当的 `temperature` 值
- 只发送必要的消息历史

## 注意事项

1. **API 密钥安全**：不要在代码中硬编码 API 密钥
2. **错误处理**：始终检查 `result.success` 再使用结果
3. **上下文长度**：注意消息历史不要超过模型的上下文限制
4. **流式响应**：使用流式响应时要处理好 UI 更新

## 相关文档

- [TypeScript 语言规范](../../../../docs/4_工程规范/TypeScript%20语言规范.md)
- [React 组件开发规范](../../../../docs/4_工程规范/React%20组件开发规范.md)

