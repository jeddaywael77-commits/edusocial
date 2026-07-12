import OpenAI from 'openai';
import type {
  AIProvider,
  ChatCompletionOptions,
  ChatCompletionResponse,
  StreamChunk,
  EmbeddingInput,
  EmbeddingResponse,
} from './ai-provider.interface';

export class GroqProvider implements AIProvider {
  readonly name = 'groq';
  private readonly client: OpenAI;
  private readonly defaultModel: string;

  constructor(config: {
    apiKey: string;
    baseUrl: string;
    model: string;
  }) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl,
    });
    this.defaultModel = config.model;
  }

  async chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResponse> {
    const response = await this.client.chat.completions.create({
      model: options.model || this.defaultModel,
      messages: options.messages,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      top_p: options.topP,
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

  async createEmbeddings(_input: EmbeddingInput): Promise<EmbeddingResponse> {
    throw new Error('Groq does not support embeddings. Use OpenAI or a dedicated embedding provider.');
  }

  async getModels(): Promise<string[]> {
    return [this.defaultModel];
  }

  async getTokenCount(text: string): Promise<number> {
    return Math.ceil(text.length / 4);
  }
}
