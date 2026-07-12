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
var RagPipelineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RagPipelineService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const provider_factory_1 = require("../providers/provider.factory");
const embedding_service_1 = require("../embeddings/embedding.service");
const vector_store_service_1 = require("../embeddings/vector-store.service");
const document_processor_service_1 = require("./document-processor.service");
let RagPipelineService = RagPipelineService_1 = class RagPipelineService {
    providerFactory;
    embeddingService;
    vectorStore;
    documentProcessor;
    config;
    logger = new common_1.Logger(RagPipelineService_1.name);
    topK;
    rerankTopK;
    maxContextLength;
    constructor(providerFactory, embeddingService, vectorStore, documentProcessor, config) {
        this.providerFactory = providerFactory;
        this.embeddingService = embeddingService;
        this.vectorStore = vectorStore;
        this.documentProcessor = documentProcessor;
        this.config = config;
        this.topK = this.config.get('ai.ragTopK') || 10;
        this.rerankTopK = this.config.get('ai.ragRerankTopK') || 5;
        this.maxContextLength =
            this.config.get('ai.ragMaxContextLength') || 8000;
    }
    async indexDocument(buffer, mimeType, filename, collection, metadata) {
        const document = await this.documentProcessor.processBuffer(buffer, mimeType, filename);
        const chunks = this.embeddingService.chunkDocument(document.content, {
            source: filename,
            sourceType: metadata?.sourceType || (mimeType.includes('pdf') ? 'pdf' : 'txt'),
            sourceId: metadata?.sourceId,
            metadata: {
                title: document.title,
                pageCount: document.metadata.pageCount,
            },
        });
        await this.embeddingService.embedAndStore(chunks, collection);
        this.logger.log(`Indexed ${chunks.length} chunks from "${filename}" into ${collection}`);
        return { chunks: chunks.length, document };
    }
    async query(question, collection, options = {}) {
        const startTime = Date.now();
        const topK = options.topK || this.topK;
        const searchResults = await this.embeddingService.searchSimilar(question, collection, {
            limit: topK,
            filter: options.filter,
        });
        const reranked = searchResults
            .filter((r) => r.score > 0.5)
            .slice(0, this.rerankTopK);
        let context = '';
        const sources = [];
        for (const result of reranked) {
            const addition = `\n\n[Source: ${result.payload.source}]\n${result.payload.content}`;
            if (context.length + addition.length > this.maxContextLength)
                break;
            context += addition;
            sources.push({
                content: result.payload.content,
                source: result.payload.source,
                sourceType: result.payload.sourceType,
                score: result.score,
            });
        }
        const provider = this.providerFactory.getActiveProvider();
        const systemMsg = options.systemPrompt ||
            `You are a helpful AI assistant for EduSocial. Use the provided context to answer questions accurately. If the context doesn't contain enough information, say so. Always cite your sources.`;
        const messages = [
            { role: 'system', content: systemMsg },
            {
                role: 'user',
                content: `Context:\n${context}\n\nQuestion: ${question}`,
            },
        ];
        if (options.stream) {
            return this.streamResponse(provider, messages, sources, startTime);
        }
        const response = await provider.chatCompletion({
            messages,
            temperature: this.config.get('ai.chatTemperature') || 0.7,
            maxTokens: this.config.get('ai.chatMaxTokens') || 4096,
        });
        return {
            answer: response.content,
            sources,
            usage: response.usage,
            latencyMs: Date.now() - startTime,
        };
    }
    async *streamResponse(provider, messages, sources, startTime) {
        const stream = provider.chatCompletionStream({
            messages,
            temperature: this.config.get('ai.chatTemperature') || 0.7,
            maxTokens: this.config.get('ai.chatMaxTokens') || 4096,
        });
        let lastChunk;
        for await (const chunk of stream) {
            if (chunk.content) {
                yield { content: chunk.content, done: false };
            }
            if (chunk.finishReason) {
                lastChunk = chunk;
            }
        }
        yield {
            content: '',
            done: true,
            sources,
        };
    }
};
exports.RagPipelineService = RagPipelineService;
exports.RagPipelineService = RagPipelineService = RagPipelineService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [provider_factory_1.ProviderFactory,
        embedding_service_1.EmbeddingService,
        vector_store_service_1.VectorStoreService,
        document_processor_service_1.DocumentProcessor,
        config_1.ConfigService])
], RagPipelineService);
//# sourceMappingURL=rag-pipeline.service.js.map