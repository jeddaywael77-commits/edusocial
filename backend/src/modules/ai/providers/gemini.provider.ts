import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  AIProvider,
  ChatCompletionOptions,
  ChatCompletionResponse,
  StreamChunk,
  EmbeddingInput,
  EmbeddingResponse,
} from './ai-provider.interface';

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini';
  private readonly client: GoogleGenerativeAI;
  private readonly defaultModel: string;

  constructor(config: { apiKey: string; model: string }) {
    this.client = new GoogleGenerativeAI(config.apiKey);
    this.defaultModel = config.model;
  }

  private convertMessages(
    messages: ChatMessage[],
  ): { role: string; parts: { text: string }[] }[] {
    return messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));
  }

  private getSystemInstruction(messages: ChatMessage[]): string | undefined {
    const systemMsg = messages.find((m) => m.role === 'system');
    return systemMsg?.content;
  }

  async chatCompletion(
    options: ChatCompletionOptions,
  ): Promise<ChatCompletionResponse> {
    const model = this.client.getGenerativeModel({
      model: options.model || this.defaultModel,
      systemInstruction: this.getSystemInstruction(options.messages),
    });

    const chat = model.startChat({
      history: this.convertMessages(options.messages.slice(0, -1)),
      generationConfig: {
        temperature: options.temperature,
        maxOutputTokens: options.maxTokens,
        topP: options.topP,
      },
    });

    const lastMessage = options.messages[options.messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;

    return {
      content: response.text(),
      model: options.model || this.defaultModel,
      usage: {
        promptTokens: response.usageMetadata?.promptTokenCount || 0,
        completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: response.usageMetadata?.totalTokenCount || 0,
      },
      finishReason: response.candidates?.[0]?.finishReason || 'STOP',
    };
  }

  async *chatCompletionStream(
    options: ChatCompletionOptions,
  ): AsyncGenerator<StreamChunk, void, unknown> {
    const model = this.client.getGenerativeModel({
      model: options.model || this.defaultModel,
      systemInstruction: this.getSystemInstruction(options.messages),
    });

    const chat = model.startChat({
      history: this.convertMessages(options.messages.slice(0, -1)),
      generationConfig: {
        temperature: options.temperature,
        maxOutputTokens: options.maxTokens,
        topP: options.topP,
      },
    });

    const lastMessage = options.messages[options.messages.length - 1];
    const result = await chat.sendMessageStream(lastMessage.content);

    for await (const chunk of result.stream) {
      yield {
        content: chunk.text(),
        finishReason: undefined,
      };
    }

    const finalResult = await result.response;
    yield {
      content: '',
      finishReason: finalResult.candidates?.[0]?.finishReason || 'STOP',
      usage: {
        promptTokens: finalResult.usageMetadata?.promptTokenCount || 0,
        completionTokens: finalResult.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: finalResult.usageMetadata?.totalTokenCount || 0,
      },
    };
  }

  async createEmbeddings(input: EmbeddingInput): Promise<EmbeddingResponse> {
    const model = this.client.getGenerativeModel({
      model: input.model || 'text-embedding-004',
    });

    const inputs = Array.isArray(input.input) ? input.input : [input.input];
    const result = await model.embedContent(inputs[0]);

    return {
      embeddings: [result.embedding.values],
      model: input.model || 'text-embedding-004',
      usage: {
        promptTokens: inputs.join('').length,
        totalTokens: inputs.join('').length,
      },
    };
  }

  async getModels(): Promise<string[]> {
    return [
      this.defaultModel,
      'gemini-2.0-flash',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
    ];
  }

  async getTokenCount(text: string): Promise<number> {
    return Math.ceil(text.length / 4);
  }
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
