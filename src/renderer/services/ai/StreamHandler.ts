/**
 * 流式响应处理器
 */

import { ChatCompletionResult } from './Types';

/**
 * 解析 SSE (Server-Sent Events) 数据行
 * 
 * @param line - SSE 数据行
 * @returns 解析出的内容，如果无法解析则返回空字符串
 */
function parseSSELine(line: string): string {
  if (!line.startsWith('data: ')) {
    return '';
  }

  const data = line.slice(6);
  
  // 流结束标记
  if (data === '[DONE]') {
    return '';
  }

  try {
    const parsed = JSON.parse(data);
    return parsed.choices?.[0]?.delta?.content || '';
  } catch (e) {
    // 忽略解析错误
    return '';
  }
}

/**
 * 处理流式响应
 * 
 * @param response - HTTP 响应对象
 * @param onStream - 接收流式内容的回调函数
 * @returns 完整的响应结果
 */
export async function handleStreamResponse(
  response: Response,
  onStream?: (text: string) => void
): Promise<ChatCompletionResult> {
  if (!response.body) {
    return {
      success: false,
      error: '响应体为空',
    };
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }

      // 解码数据块
      const chunk = decoder.decode(value);
      
      // 按行分割
      const lines = chunk.split('\n').filter((line) => line.trim() !== '');

      // 处理每一行
      for (const line of lines) {
        const content = parseSSELine(line);
        
        if (content) {
          fullContent += content;
          onStream?.(content);
        }
      }
    }

    return {
      success: true,
      content: fullContent,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '流式响应处理失败',
    };
  } finally {
    reader.releaseLock();
  }
}

