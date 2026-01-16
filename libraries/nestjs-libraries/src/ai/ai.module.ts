import { Global, Module } from '@nestjs/common';
import { AiConfigService } from './ai-config.service';
import { AiModelFactory } from './ai-model.factory';
import { AiImageModelFactory } from './ai-image-model.factory';

@Global()
@Module({
  providers: [AiConfigService, AiModelFactory, AiImageModelFactory],
  exports: [AiConfigService, AiModelFactory, AiImageModelFactory],
})
export class AiModule {}
