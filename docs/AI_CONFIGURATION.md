# AI Model Configuration Guide

Postiz now supports configurable AI models through environment variables, allowing you to use different AI providers beyond OpenAI.

## Supported Providers

The following AI providers are supported through LangChain:

- **OpenAI** (default) - GPT-4, GPT-3.5, etc.
- **Anthropic** - Claude models
- **Google** - Gemini models  
- **Mistral** - Mistral AI models
- **Groq** - Fast inference models
- **Cohere** - Cohere models

## Configuration

Add the following environment variables to your `.env` file:

### Basic Configuration

```bash
# Choose your AI provider (default: openai)
AI_PROVIDER="openai"

# API key for the selected provider
AI_API_KEY="your-api-key-here"

# Model name for chat completions
AI_CHAT_MODEL="gpt-4.1"

# Model name for image generation (currently only DALL-E supported)
AI_IMAGE_MODEL="dall-e-3"

# Temperature for AI responses (0.0-1.0, default: 0.7)
AI_TEMPERATURE="0.7"
```

### Advanced Configuration

```bash
# Custom base URL for API endpoints (useful for OpenAI-compatible APIs)
AI_BASE_URL="https://api.example.com/v1"

# Maximum tokens for responses (optional)
AI_MAX_TOKENS="4096"
```

### Provider-Specific Examples

#### OpenAI (Default)
```bash
AI_PROVIDER="openai"
AI_API_KEY="sk-..."
AI_CHAT_MODEL="gpt-4.1"
AI_IMAGE_MODEL="dall-e-3"
```

#### Anthropic (Claude)
```bash
AI_PROVIDER="anthropic"
AI_API_KEY="sk-ant-..."
AI_CHAT_MODEL="claude-3-sonnet-20240229"
# Note: Image generation will fall back to DALL-E
```

#### Google (Gemini)
```bash
AI_PROVIDER="google"
AI_API_KEY="..."
AI_CHAT_MODEL="gemini-pro"
```

#### Mistral
```bash
AI_PROVIDER="mistral"
AI_API_KEY="..."
AI_CHAT_MODEL="mistral-large-latest"
```

#### Groq
```bash
AI_PROVIDER="groq"
AI_API_KEY="gsk_..."
AI_CHAT_MODEL="mixtral-8x7b-32768"
```

#### Cohere
```bash
AI_PROVIDER="cohere"
AI_API_KEY="..."
AI_CHAT_MODEL="command"
```

## Legacy Configuration

For backward compatibility, the `OPENAI_API_KEY` environment variable is still supported:

```bash
OPENAI_API_KEY="sk-..."
```

This will be used when `AI_PROVIDER` is not set or is set to "openai".

## Additional Requirements

Some providers require additional packages to be installed:

```bash
# For Anthropic
pnpm add @langchain/anthropic @ai-sdk/anthropic

# For Google
pnpm add @langchain/google-genai @ai-sdk/google

# For Mistral
pnpm add @langchain/mistralai @ai-sdk/mistral

# For Groq
pnpm add @langchain/groq

# For Cohere
pnpm add @langchain/cohere
```

If a provider package is not installed, the system will automatically fall back to OpenAI.

## Image Generation

Currently, only OpenAI's DALL-E is supported for image generation. When using a non-OpenAI provider for chat, image generation will continue to use DALL-E with either the `OPENAI_API_KEY` or `AI_API_KEY`.

## Troubleshooting

### Provider not working
1. Ensure the provider's package is installed
2. Verify your API key is correct
3. Check the model name matches the provider's available models
4. Review logs for any warning messages

### Falling back to OpenAI
If you see warnings about falling back to OpenAI, it means either:
- The provider's SDK package is not installed
- There was an error initializing the provider
- The provider is not recognized

## Examples

### Using OpenAI-Compatible Endpoints

Many services offer OpenAI-compatible APIs. Configure them like this:

```bash
AI_PROVIDER="openai"
AI_BASE_URL="https://your-endpoint.com/v1"
AI_API_KEY="your-key"
AI_CHAT_MODEL="your-model-name"
```

### Multiple Environment Setup

For different environments (dev/staging/prod), you can use different providers:

**Development:**
```bash
AI_PROVIDER="openai"
AI_CHAT_MODEL="gpt-3.5-turbo"  # Cheaper for testing
```

**Production:**
```bash
AI_PROVIDER="anthropic"
AI_CHAT_MODEL="claude-3-opus-20240229"  # Higher quality
```

## API Reference

The AI configuration is managed by the `AiConfigService` which reads from environment variables. All AI-related services (`AiModelFactory`, `AiImageModelFactory`) automatically use this configuration.

For developers extending the codebase, inject `AiModelFactory` or `AiImageModelFactory` to create AI models that respect the configuration:

```typescript
import { AiModelFactory } from '@gitroom/nestjs-libraries/ai/ai-model.factory';

constructor(private aiModelFactory: AiModelFactory) {}

const model = this.aiModelFactory.createChatModel({ temperature: 0.5 });
```
