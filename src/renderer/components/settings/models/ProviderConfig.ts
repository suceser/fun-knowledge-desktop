export interface ProviderConfig {
    id: string;
    name: string;
    type: 'openai' | 'anthropic' | 'azure' | 'gemini' | 'custom';
    apiKey?: string;
    apiUrl?: string;
    enabled: boolean;
    models: string[];
}