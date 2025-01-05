export type ModelProvider = "openai" | "google" | "anthropic" | "custom";

export interface ModelOption {
  id: string;
  name: string;
  provider: ModelProvider;
  maxTokens: number;
}

export interface ChatConfig {
  baseUrl?: string;
  apiKey: string;
  provider?: ModelProvider;
  model?: string;
  maxLength?: number;
  minLength?: number;
  language?: Language;
}

export type Language = "en" | "zh";

export interface ChatInput {
  keywords: string[];
  style: string;
  scene: string;
  name: string;
  maxLength: number;
  minLength: number;
  language: Language;
}

export interface ChatResponse {
  content: string;
  error?: string;
} 