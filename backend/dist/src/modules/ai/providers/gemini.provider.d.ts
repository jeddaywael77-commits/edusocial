import type { AIProvider, ChatCompletionOptions, ChatCompletionResponse, StreamChunk, EmbeddingInput, EmbeddingResponse } from './ai-provider.interface';
export declare class GeminiProvider implements AIProvider {
    readonly name = "gemini";
    private readonly client;
    private readonly defaultModel;
    constructor(config: {
        apiKey: string;
        model: string;
    });
    private convertMessages;
    private getSystemInstruction;
    chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResponse>;
    chatCompletionStream(options: ChatCompletionOptions): AsyncGenerator<StreamChunk, void, unknown>;
    createEmbeddings(input: EmbeddingInput): Promise<EmbeddingResponse>;
    getModels(): Promise<string[]>;
    getTokenCount(text: string): Promise<number>;
}
