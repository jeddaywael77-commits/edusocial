import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { EmbeddingService } from '../embeddings/embedding.service';
import { AiAnalyticsService } from '../analytics/ai-analytics.service';
import { DocumentProcessor } from '../rag/document-processor.service';
export declare class AiProcessingProcessor extends WorkerHost {
    private readonly prisma;
    private readonly embeddingService;
    private readonly analyticsService;
    private readonly documentProcessor;
    private readonly logger;
    constructor(prisma: PrismaService, embeddingService: EmbeddingService, analyticsService: AiAnalyticsService, documentProcessor: DocumentProcessor);
    process(job: Job<any, any, string>): Promise<any>;
    private indexDocument;
    private batchIndex;
    private aggregateAnalytics;
}
