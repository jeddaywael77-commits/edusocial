"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroqProvider = void 0;
const openai_1 = __importDefault(require("openai"));
class GroqProvider {
    name = 'groq';
    client;
    defaultModel;
    constructor(config) {
        this.client = new openai_1.default({
            apiKey: config.apiKey,
            baseURL: config.baseUrl,
        });
        this.defaultModel = config.model;
    }
    async chatCompletion(options) {
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
    async *chatCompletionStream(options) {
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
    async createEmbeddings(_input) {
        throw new Error('Groq does not support embeddings. Use OpenAI or a dedicated embedding provider.');
    }
    async getModels() {
        return [this.defaultModel];
    }
    async getTokenCount(text) {
        return Math.ceil(text.length / 4);
    }
}
exports.GroqProvider = GroqProvider;
//# sourceMappingURL=groq.provider.js.map