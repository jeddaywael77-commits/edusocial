"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ProviderFactory_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderFactory = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_provider_1 = require("./openai.provider");
const groq_provider_1 = require("./groq.provider");
const ollama_provider_1 = require("./ollama.provider");
const gemini_provider_1 = require("./gemini.provider");
let ProviderFactory = ProviderFactory_1 = class ProviderFactory {
    config;
    logger = new common_1.Logger(ProviderFactory_1.name);
    providers = new Map();
    activeProvider;
    constructor(config) {
        this.config = config;
        this.initializeProviders();
        this.activeProvider = this.getProvider(this.config.get('ai.provider') || 'openai');
        this.logger.log(`Active AI provider: ${this.activeProvider.name}`);
    }
    initializeProviders() {
        const openaiKey = this.config.get('ai.openaiApiKey');
        if (openaiKey) {
            this.providers.set('openai', new openai_provider_1.OpenAIProvider({
                apiKey: openaiKey,
                baseUrl: this.config.get('ai.openaiBaseUrl') ||
                    'https://api.openai.com/v1',
                model: this.config.get('ai.openaiModel') || 'gpt-4o-mini',
                embeddingModel: this.config.get('ai.embeddingModel') ||
                    'text-embedding-3-small',
            }));
        }
        const groqKey = this.config.get('ai.groqApiKey');
        if (groqKey) {
            this.providers.set('groq', new groq_provider_1.GroqProvider({
                apiKey: groqKey,
                baseUrl: this.config.get('ai.groqBaseUrl') ||
                    'https://api.groq.com/openai/v1',
                model: this.config.get('ai.groqModel') ||
                    'llama-3.3-70b-versatile',
            }));
        }
        this.providers.set('ollama', new ollama_provider_1.OllamaProvider({
            baseUrl: this.config.get('ai.ollamaBaseUrl') ||
                'http://localhost:11434',
            model: this.config.get('ai.ollamaModel') || 'llama3.1',
        }));
        const geminiKey = this.config.get('ai.geminiApiKey');
        if (geminiKey) {
            this.providers.set('gemini', new gemini_provider_1.GeminiProvider({
                apiKey: geminiKey,
                model: this.config.get('ai.geminiModel') || 'gemini-2.0-flash',
            }));
        }
        this.logger.log(`Initialized providers: ${[...this.providers.keys()].join(', ')}`);
    }
    getProvider(name) {
        const providerName = name || this.config.get('ai.provider') || 'openai';
        const provider = this.providers.get(providerName);
        if (!provider) {
            throw new Error(`AI provider "${providerName}" not available. Available: ${[...this.providers.keys()].join(', ')}`);
        }
        return provider;
    }
    getActiveProvider() {
        return this.activeProvider;
    }
    setActiveProvider(name) {
        this.activeProvider = this.getProvider(name);
        this.logger.log(`Active AI provider changed to: ${name}`);
    }
    getAvailableProviders() {
        return [...this.providers.keys()];
    }
};
exports.ProviderFactory = ProviderFactory;
exports.ProviderFactory = ProviderFactory = ProviderFactory_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ProviderFactory);
//# sourceMappingURL=provider.factory.js.map