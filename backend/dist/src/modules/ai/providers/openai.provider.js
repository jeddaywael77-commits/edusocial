"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = __importDefault(require("openai"));
class OpenAIProvider {
    name = 'openai';
    logger = new common_1.Logger(OpenAIProvider.name);
    client;
    defaultModel;
    embeddingModel;
    constructor(config) {
        this.client = new openai_1.default({
            apiKey: config.apiKey,
            baseURL: config.baseUrl,
        });
        this.defaultModel = config.model;
        this.embeddingModel = config.embeddingModel;
    }
    async chatCompletion(options) {
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
    async createEmbeddings(input) {
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
    async getModels() {
        const models = await this.client.models.list();
        return models.data.map((m) => m.id);
    }
    async getTokenCount(text, _model) {
        return Math.ceil(text.length / 4);
    }
}
exports.OpenAIProvider = OpenAIProvider;
//# sourceMappingURL=openai.provider.js.map