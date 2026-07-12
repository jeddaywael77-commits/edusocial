"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
const generative_ai_1 = require("@google/generative-ai");
class GeminiProvider {
    name = 'gemini';
    client;
    defaultModel;
    constructor(config) {
        this.client = new generative_ai_1.GoogleGenerativeAI(config.apiKey);
        this.defaultModel = config.model;
    }
    convertMessages(messages) {
        return messages
            .filter((m) => m.role !== 'system')
            .map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
        }));
    }
    getSystemInstruction(messages) {
        const systemMsg = messages.find((m) => m.role === 'system');
        return systemMsg?.content;
    }
    async chatCompletion(options) {
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
    async *chatCompletionStream(options) {
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
    async createEmbeddings(input) {
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
    async getModels() {
        return [
            this.defaultModel,
            'gemini-2.0-flash',
            'gemini-1.5-pro',
            'gemini-1.5-flash',
        ];
    }
    async getTokenCount(text) {
        return Math.ceil(text.length / 4);
    }
}
exports.GeminiProvider = GeminiProvider;
//# sourceMappingURL=gemini.provider.js.map