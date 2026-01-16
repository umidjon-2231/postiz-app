import { Injectable } from '@nestjs/common';
import { AiConfigService } from './ai-config.service';
import { ChatOpenAI } from '@langchain/openai';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';

@Injectable()
export class AiModelFactory {
  constructor(private _aiConfigService: AiConfigService) {}

  createChatModel(overrideConfig?: {
    temperature?: number;
    model?: string;
  }): BaseChatModel {
    const config = this._aiConfigService.getConfig();
    const provider = config.provider.toLowerCase();

    const modelConfig = {
      apiKey: config.apiKey || 'sk-proj-',
      model: overrideConfig?.model || config.chatModel,
      temperature: overrideConfig?.temperature ?? config.temperature,
      ...(config.maxTokens ? { maxTokens: config.maxTokens } : {}),
      ...(config.baseUrl ? { configuration: { baseURL: config.baseUrl } } : {}),
    };

    switch (provider) {
      case 'openai':
        return new ChatOpenAI(modelConfig);

      case 'anthropic':
        try {
          // Dynamic import to avoid requiring the package if not used
          const { ChatAnthropic } = require('@langchain/anthropic');
          return new ChatAnthropic({
            ...modelConfig,
            anthropicApiKey: config.apiKey,
          });
        } catch (error) {
          throw new Error(
            'Anthropic support requires @langchain/anthropic package. Install it with: pnpm add @langchain/anthropic'
          );
        }

      case 'google':
        try {
          const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
          return new ChatGoogleGenerativeAI({
            ...modelConfig,
            apiKey: config.apiKey,
          });
        } catch (error) {
          throw new Error(
            'Google support requires @langchain/google-genai package. Install it with: pnpm add @langchain/google-genai'
          );
        }

      case 'mistral':
        try {
          const { ChatMistralAI } = require('@langchain/mistralai');
          return new ChatMistralAI({
            ...modelConfig,
            apiKey: config.apiKey,
          });
        } catch (error) {
          throw new Error(
            'Mistral support requires @langchain/mistralai package. Install it with: pnpm add @langchain/mistralai'
          );
        }

      case 'groq':
        try {
          const { ChatGroq } = require('@langchain/groq');
          return new ChatGroq({
            ...modelConfig,
            apiKey: config.apiKey,
          });
        } catch (error) {
          throw new Error(
            'Groq support requires @langchain/groq package. Install it with: pnpm add @langchain/groq'
          );
        }

      case 'cohere':
        try {
          const { ChatCohere } = require('@langchain/cohere');
          return new ChatCohere({
            ...modelConfig,
            apiKey: config.apiKey,
          });
        } catch (error) {
          throw new Error(
            'Cohere support requires @langchain/cohere package. Install it with: pnpm add @langchain/cohere'
          );
        }

      default:
        // Default to OpenAI for unknown providers
        console.warn(
          `Unknown AI provider: ${provider}. Falling back to OpenAI.`
        );
        return new ChatOpenAI(modelConfig);
    }
  }
}
