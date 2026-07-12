import type { AIProvider, ChatCompletionOptions, ChatCompletionResponse, StreamChunk, EmbeddingInput, EmbeddingResponse } from './ai-provider.interface';
export declare class OpenAIProvider implements AIProvider {
    readonly name = "openai";
    private readonly logger;
    private readonly client;
    private readonly defaultModel;
    private readonly embeddingModel;
    constructor(config: {
        apiKey: string;
        baseUrl: string;
        model: string;
        embeddingModel: string;
    });
    chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResponse>;
    chatCompletionStream(options: ChatCompletionOptions): AsyncGenerator<StreamChunk, void, unknown>;
    createEmbeddings(input: EmbeddingInput): Promise<EmbeddingResponse>;
    getModels(): Promise<string[]>;
    getTokenCount(text: string, _model?: string): Promise<number>;
}
