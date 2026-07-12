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
var EmbeddingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingService = void 0;
const common_1 = require("@nestjs/common");
const provider_factory_1 = require("../providers/provider.factory");
const vector_store_service_1 = require("./vector-store.service");
const config_1 = require("@nestjs/config");
let EmbeddingService = EmbeddingService_1 = class EmbeddingService {
    providerFactory;
    vectorStore;
    config;
    logger = new common_1.Logger(EmbeddingService_1.name);
    chunkSize;
    chunkOverlap;
    constructor(providerFactory, vectorStore, config) {
        this.providerFactory = providerFactory;
        this.vectorStore = vectorStore;
        this.config = config;
        this.chunkSize = this.config.get('ai.ragChunkSize') || 1000;
        this.chunkOverlap = this.config.get('ai.ragChunkOverlap') || 200;
    }
    chunkDocument(content, metadata) {
        const chunks = [];
        const sentences = content.split(/(?<=[.!?])\s+/);
        let currentChunk = '';
        let chunkIndex = 0;
        for (const sentence of sentences) {
            if (currentChunk.length + sentence.length > this.chunkSize &&
                currentChunk.length > 0) {
                chunks.push({
                    content: currentChunk.trim(),
                    source: metadata.source,
                    sourceType: metadata.sourceType,
                    sourceId: metadata.sourceId,
                    chunkIndex,
                    totalChunks: 0,
                    metadata: metadata.metadata,
                });
                chunkIndex++;
                const words = currentChunk.split(' ');
                const overlapWords = words.slice(-Math.floor(this.chunkOverlap / 5));
                currentChunk = overlapWords.join(' ') + ' ' + sentence;
            }
            else {
                currentChunk += (currentChunk ? ' ' : '') + sentence;
            }
        }
        if (currentChunk.trim()) {
            chunks.push({
                content: currentChunk.trim(),
                source: metadata.source,
                sourceType: metadata.sourceType,
                sourceId: metadata.sourceId,
                chunkIndex,
                totalChunks: 0,
                metadata: metadata.metadata,
            });
        }
        for (const chunk of chunks) {
            chunk.totalChunks = chunks.length;
        }
        return chunks;
    }
    async embedAndStore(chunks, collection) {
        if (!chunks.length)
            return;
        const dimensions = this.config.get('ai.embeddingDimensions') || 1536;
        await this.vectorStore.ensureCollection(collection, dimensions);
        const provider = this.providerFactory.getActiveProvider();
        const batchSize = 20;
        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);
            const texts = batch.map((c) => c.content);
            try {
                const result = await provider.createEmbeddings({
                    input: texts,
                });
                const documents = batch.map((chunk, idx) => ({
                    id: `${chunk.source}-${chunk.chunkIndex}-${Date.now()}`,
                    collection,
                    vector: result.embeddings[idx],
                    payload: {
                        content: chunk.content,
                        source: chunk.source,
                        sourceType: chunk.sourceType,
                        sourceId: chunk.sourceId,
                        chunkIndex: chunk.chunkIndex,
                        totalChunks: chunk.totalChunks,
                        metadata: chunk.metadata,
                    },
                }));
                await this.vectorStore.upsert(documents);
                this.logger.debug(`Embedded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)}`);
            }
            catch (error) {
                this.logger.error(`Failed to embed batch starting at ${i}:`, error);
            }
        }
    }
    async searchSimilar(query, collection, options = {}) {
        const provider = this.providerFactory.getActiveProvider();
        const result = await provider.createEmbeddings({ input: query });
        return this.vectorStore.search(collection, result.embeddings[0], {
            limit: options.limit || 10,
            filter: options.filter,
        });
    }
    async deleteBySource(source, sourceType) {
        await this.vectorStore.deleteByFilter('documents', {
            source,
            sourceType,
        });
    }
};
exports.EmbeddingService = EmbeddingService;
exports.EmbeddingService = EmbeddingService = EmbeddingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [provider_factory_1.ProviderFactory,
        vector_store_service_1.VectorStoreService,
        config_1.ConfigService])
], EmbeddingService);
//# sourceMappingURL=embedding.service.js.map