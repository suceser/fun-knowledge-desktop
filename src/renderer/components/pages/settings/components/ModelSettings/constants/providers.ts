/**
 * 预置的模型服务商配置
 */

import { ProviderConfig } from '../types';

export const initialProviders: ProviderConfig[] = [
  {
    id: 'modelscope',
    name: 'ModelScope 魔搭',
    icon: 'modelscope',
    enabled: true,
    apiKey: '',
    apiUrl: 'https://api-inference.modelscope.cn/v1/',
    description: '魔搭社区 v1 版本',
    models: [
      {
        id: 'qwen2.5-72b-instruct',
        name: 'Qwen/Qwen2.5-72B-Instruct',
        displayName: 'Qwen2.5-72B-Instruct',
        status: 'available',
        maxTokens: 8192,
        supportStream: true,
      },
      {
        id: 'qwen2.5-vl-72b-instruct',
        name: 'Qwen/Qwen2.5-VL-72B-Instruct',
        displayName: 'Qwen2.5-VL-72B-Instruct',
        status: 'available',
        maxTokens: 8192,
        supportStream: true,
      },
      {
        id: 'qwen2.5-coder-32b-instruct',
        name: 'Qwen/Qwen2.5-Coder-32B-Instruct',
        displayName: 'Qwen2.5-Coder-32B-Instruct',
        status: 'available',
        maxTokens: 8192,
        supportStream: true,
      },
    ],
  },
  {
    id: 'deepseek',
    name: '深度求索',
    icon: 'deepseek',
    enabled: false,
    apiKey: '',
    apiUrl: 'https://api.deepseek.com/v1/',
    models: [
      {
        id: 'deepseek-r1',
        name: 'deepseek-ai/DeepSeek-R1',
        displayName: 'DeepSeek-R1',
        status: 'available',
        supportStream: true,
      },
      {
        id: 'deepseek-v3',
        name: 'deepseek-ai/DeepSeek-V3',
        displayName: 'DeepSeek-V3',
        status: 'available',
        supportStream: true,
      },
    ],
  },
  // ... 其他服务商配置
];

