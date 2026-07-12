export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}

export interface ChatCompletionOptions {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
  stream?: boolean;
}

export interface ChatCompletionResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: string;
}

export interface StreamChunk {
  content: string;
  finishReason?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface EmbeddingInput {
  input: string | string[];
  model?: string;
}

export interface EmbeddingResponse {
  embeddings: number[][];
  model: string;
  usage: {
    promptTokens: number;
    totalTokens: number;
  };
}

export interface AIProvider {
  readonly name: string;

  chatCompletion(
    options: ChatCompletionOptions,
  ): Promise<ChatCompletionResponse>;
  chatCompletionStream(
    options: ChatCompletionOptions,
  ): AsyncGenerator<StreamChunk, void, unknown>;
  createEmbeddings(input: EmbeddingInput): Promise<EmbeddingResponse>;
  getModels(): Promise<string[]>;
  getTokenCount(text: string, model?: string): Promise<number>;
}
