import type {
  AIProvider,
  ChatCompletionOptions,
  ChatCompletionResponse,
  StreamChunk,
  EmbeddingInput,
  EmbeddingResponse,
} from './ai-provider.interface';

export class OllamaProvider implements AIProvider {
  readonly name = 'ollama';
  private readonly baseUrl: string;
  private readonly defaultModel: string;

  constructor(config: {
    baseUrl: string;
    model: string;
  }) {
    this.baseUrl = config.baseUrl;
    this.defaultModel = config.model;
  }

  async chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResponse> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options.model || this.defaultModel,
        messages: options.messages,
        options: {
          temperature: options.temperature,
          num_predict: options.maxTokens,
          top_p: options.topP,
        },
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.message?.content || '',
      model: data.model || this.defaultModel,
      usage: {
        promptTokens: data.prompt_eval_count || 0,
        completionTokens: data.eval_count || 0,
        totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
      },
      finishReason: 'stop',
    };
  }

  async *chatCompletionStream(
    options: ChatCompletionOptions,
  ): AsyncGenerator<StreamChunk, void, unknown> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options.model || this.defaultModel,
        messages: options.messages,
        options: {
          temperature: options.temperature,
          num_predict: options.maxTokens,
          top_p: options.topP,
        },
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const data = JSON.parse(line);
          yield {
            content: data.message?.content || '',
            finishReason: data.done ? 'stop' : undefined,
            usage: data.done
              ? {
                  promptTokens: data.prompt_eval_count || 0,
                  completionTokens: data.eval_count || 0,
                  totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
                }
              : undefined,
          };
        } catch {
          // skip malformed lines
        }
      }
    }
  }

  async createEmbeddings(input: EmbeddingInput): Promise<EmbeddingResponse> {
    const inputs = Array.isArray(input.input) ? input.input : [input.input];
    const embeddings: number[][] = [];

    for (const text of inputs) {
      const response = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: input.model || this.defaultModel,
          prompt: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama embedding error: ${response.statusText}`);
      }

      const data = await response.json();
      embeddings.push(data.embedding);
    }

    return {
      embeddings,
      model: input.model || this.defaultModel,
      usage: {
        promptTokens: inputs.join('').length,
        totalTokens: inputs.join('').length,
      },
    };
  }

  async getModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) return [this.defaultModel];
      const data = await response.json();
      return data.models?.map((m: any) => m.name) || [this.defaultModel];
    } catch {
      return [this.defaultModel];
    }
  }

  async getTokenCount(text: string): Promise<number> {
    return Math.ceil(text.length / 4);
  }
}
