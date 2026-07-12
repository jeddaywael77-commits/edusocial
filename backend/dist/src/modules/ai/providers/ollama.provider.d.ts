import type { AIProvider, ChatCompletionOptions, ChatCompletionResponse, StreamChunk, EmbeddingInput, EmbeddingResponse } from './ai-provider.interface';
export declare class OllamaProvider implements AIProvider {
    readonly name = "ollama";
    private readonly baseUrl;
    private readonly defaultModel;
    constructor(config: {
        baseUrl: string;
        model: string;
    });
    chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResponse>;
    chatCompletionStream(options: ChatCompletionOptions): AsyncGenerator<StreamChunk, void, unknown>;
    createEmbeddings(input: EmbeddingInput): Promise<EmbeddingResponse>;
    getModels(): Promise<string[]>;
    getTokenCount(text: string): Promise<number>;
}
