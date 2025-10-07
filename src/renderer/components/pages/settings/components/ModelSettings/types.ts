export interface ModelInfo {
  id: string;
  name: string;
  displayName: string;
  status: 'available' | 'unavailable';
  maxTokens?: number;
  supportStream?: boolean;
  costPer1kTokens?: number;
  isCustom?: boolean;
}

export interface ProviderConfig {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  apiKey: string;
  apiUrl: string;
  models: ModelInfo[];
  description?: string;
}

export interface ApiTestResult {
  success: boolean;
  error?: string;
  model?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

