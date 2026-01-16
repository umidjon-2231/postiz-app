import { Injectable } from '@nestjs/common';

export interface AiConfig {
  provider: string;
  apiKey?: string;
  baseUrl?: string;
  chatModel: string;
  imageModel?: string;
  temperature: number;
  maxTokens?: number;
}

@Injectable()
export class AiConfigService {
  getConfig(): AiConfig {
    return {
      provider: process.env.AI_PROVIDER || 'openai',
      apiKey: this.getApiKey(),
      baseUrl: process.env.AI_BASE_URL,
      chatModel: process.env.AI_CHAT_MODEL || 'gpt-4.1',
      imageModel: process.env.AI_IMAGE_MODEL || 'dall-e-3',
      temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
      maxTokens: process.env.AI_MAX_TOKENS
        ? parseInt(process.env.AI_MAX_TOKENS)
        : undefined,
    };
  }

  private getApiKey(): string | undefined {
    // Check provider-specific env vars first, then fall back to generic AI_API_KEY
    const provider = process.env.AI_PROVIDER || 'openai';
    
    switch (provider.toLowerCase()) {
      case 'openai':
        return process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
      case 'anthropic':
        return process.env.ANTHROPIC_API_KEY || process.env.AI_API_KEY;
      case 'google':
        return process.env.GOOGLE_API_KEY || process.env.AI_API_KEY;
      case 'mistral':
        return process.env.MISTRAL_API_KEY || process.env.AI_API_KEY;
      case 'groq':
        return process.env.GROQ_API_KEY || process.env.AI_API_KEY;
      case 'cohere':
        return process.env.COHERE_API_KEY || process.env.AI_API_KEY;
      default:
        return process.env.AI_API_KEY;
    }
  }
}
