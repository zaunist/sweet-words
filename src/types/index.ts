export type ModelProvider = 'openai' | 'anthropic' | 'google';

export interface ModelOption {
  id: string;
  name: string;
  provider: ModelProvider;
  maxTokens: number;
}

export interface ChatConfig {
  baseUrl: string;
  apiKey: string;
  maxLength: number;
  minLength: number;
  language: string;
  model: string;
  provider: ModelProvider;
}

export type Language = 'zh' | 'en';

export interface ChatInput {
  keywords: string[];
  style: string;
  scene: string;
  name: string;
  language: Language;
}

export interface ChatResponse {
  content: string;
  error?: string;
} 