import { Injectable } from '@nestjs/common';
import { AiConfigService } from './ai-config.service';
import { DallEAPIWrapper } from '@langchain/openai';

@Injectable()
export class AiImageModelFactory {
  constructor(private _aiConfigService: AiConfigService) {}

  createImageModel(): DallEAPIWrapper {
    const config = this._aiConfigService.getConfig();
    const provider = config.provider.toLowerCase();

    // Currently only OpenAI DALL-E is supported for image generation
    // Other providers can be added as they become available in LangChain
    if (provider !== 'openai') {
      console.warn(
        `Image generation is currently only supported with OpenAI. Using OpenAI DALL-E for image generation.`
      );
    }

    return new DallEAPIWrapper({
      apiKey: config.apiKey || process.env.OPENAI_API_KEY || 'sk-proj-',
      model: config.imageModel || 'dall-e-3',
    });
  }
}
