import { Logger } from '@nestjs/common';
import OpenAI from 'openai';
import type {
  AIProvider,
  ChatCompletionOptions,
  ChatCompletionResponse,
  StreamChunk,
  EmbeddingInput,
  EmbeddingResponse,
} from './ai-provider.interface';

export class OpenAIProvider implements AIProvider {
  readonly name = 'openai';
  private readonly logger = new Logger(OpenAIProvider.name);
  private readonly client: OpenAI;
  private readonly defaultModel: string;
  private readonly embeddingModel: string;

  constructor(config: {
    apiKey: string;
    baseUrl: string;
    model: string;
    embeddingModel: string;
  }) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl,
    });
    this.defaultModel = config.model;
    this.embeddingModel = config.embeddingModel;
  }

  async chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResponse> {
    const response = await this.client.chat.completions.create({
      model: options.model || this.defaultModel,
      messages: options.messages,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      top_p: options.topP,
      frequency_penalty: options.frequencyPenalty,
      presence_penalty: options.presencePenalty,
      stop: options.stop,
    });

    const choice = response.choices[0];
    return {
      content: choice.message?.content || '',
      model: response.model,
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
      finishReason: choice.finish_reason || 'stop',
    };
  }

  async *chatCompletionStream(
    options: ChatCompletionOptions,
  ): AsyncGenerator<StreamChunk, void, unknown> {
    const stream = await this.client.chat.completions.create({
      model: options.model || this.defaultModel,
      messages: options.messages,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      top_p: options.topP,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;
      const finishReason = chunk.choices[0]?.finish_reason;
      yield {
        content: delta?.content || '',
        finishReason: finishReason || undefined,
        usage: chunk.usage
          ? {
              promptTokens: chunk.usage.prompt_tokens,
              completionTokens: chunk.usage.completion_tokens,
              totalTokens: chunk.usage.total_tokens,
            }
          : undefined,
      };
    }
  }

  async createEmbeddings(input: EmbeddingInput): Promise<EmbeddingResponse> {
    const response = await this.client.embeddings.create({
      model: input.model || this.embeddingModel,
      input: input.input,
    });

    return {
      embeddings: response.data.map((e) => e.embedding),
      model: response.model,
      usage: {
        promptTokens: response.usage.prompt_tokens,
        totalTokens: response.usage.total_tokens,
      },
    };
  }

  async getModels(): Promise<string[]> {
    const models = await this.client.models.list();
    return models.data.map((m) => m.id);
  }

  async getTokenCount(text: string, _model?: string): Promise<number> {
    // Simple approximation: ~4 chars per token for English
    return Math.ceil(text.length / 4);
  }
}
