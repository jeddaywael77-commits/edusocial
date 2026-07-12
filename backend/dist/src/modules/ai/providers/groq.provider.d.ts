import type { AIProvider, ChatCompletionOptions, ChatCompletionResponse, StreamChunk, EmbeddingInput, EmbeddingResponse } from './ai-provider.interface';
export declare class GroqProvider implements AIProvider {
    readonly name = "groq";
    private readonly client;
    private readonly defaultModel;
    constructor(config: {
        apiKey: string;
        baseUrl: string;
        model: string;
    });
    chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResponse>;
    chatCompletionStream(options: ChatCompletionOptions): AsyncGenerator<StreamChunk, void, unknown>;
    createEmbeddings(_input: EmbeddingInput): Promise<EmbeddingResponse>;
    getModels(): Promise<string[]>;
    getTokenCount(text: string): Promise<number>;
}
