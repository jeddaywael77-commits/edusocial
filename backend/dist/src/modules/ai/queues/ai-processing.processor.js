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
var AiProcessingProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProcessingProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
const embedding_service_1 = require("../embeddings/embedding.service");
const ai_analytics_service_1 = require("../analytics/ai-analytics.service");
const document_processor_service_1 = require("../rag/document-processor.service");
let AiProcessingProcessor = AiProcessingProcessor_1 = class AiProcessingProcessor extends bullmq_1.WorkerHost {
    prisma;
    embeddingService;
    analyticsService;
    documentProcessor;
    logger = new common_1.Logger(AiProcessingProcessor_1.name);
    constructor(prisma, embeddingService, analyticsService, documentProcessor) {
        super();
        this.prisma = prisma;
        this.embeddingService = embeddingService;
        this.analyticsService = analyticsService;
        this.documentProcessor = documentProcessor;
    }
    async process(job) {
        switch (job.name) {
            case 'index-document':
                return this.indexDocument(job);
            case 'batch-index':
                return this.batchIndex(job);
            case 'aggregate-analytics':
                return this.aggregateAnalytics(job);
            default:
                this.logger.warn(`Unknown AI job: ${job.name}`);
        }
    }
    async indexDocument(job) {
        const { userId, mimeType, filename, bufferBase64, collection } = job.data;
        this.logger.log(`Indexing document: ${filename}`);
        try {
            const buffer = Buffer.from(bufferBase64, 'base64');
            const doc = await this.documentProcessor.processBuffer(buffer, mimeType, filename);
            const chunks = this.embeddingService.chunkDocument(doc.content, {
                source: filename,
                sourceType: mimeType.includes('pdf') ? 'pdf' : 'txt',
            });
            await this.embeddingService.embedAndStore(chunks, collection || `user_${userId}`);
            await job.updateProgress(100);
            this.logger.log(`Document indexed: ${filename} (${chunks.length} chunks)`);
        }
        catch (error) {
            this.logger.error(`Document indexing failed: ${filename}`, error);
            throw error;
        }
    }
    async batchIndex(job) {
        const { documents, userId } = job.data;
        this.logger.log(`Batch indexing ${documents.length} documents`);
        for (let i = 0; i < documents.length; i++) {
            const doc = documents[i];
            await this.indexDocument({
                data: { ...doc, userId },
                updateProgress: async (p) => {
                    await job.updateProgress(Math.round((i / documents.length) * 100 + p / documents.length));
                },
            });
        }
    }
    async aggregateAnalytics(job) {
        const { userId, days } = job.data;
        this.logger.log(`Aggregating analytics for user ${userId}`);
        const stats = await this.analyticsService.getUserStats(userId, days);
        await job.updateProgress(100);
        return stats;
    }
};
exports.AiProcessingProcessor = AiProcessingProcessor;
exports.AiProcessingProcessor = AiProcessingProcessor = AiProcessingProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('ai-processing', {
        concurrency: 3,
    }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        embedding_service_1.EmbeddingService,
        ai_analytics_service_1.AiAnalyticsService,
        document_processor_service_1.DocumentProcessor])
], AiProcessingProcessor);
//# sourceMappingURL=ai-processing.processor.js.map