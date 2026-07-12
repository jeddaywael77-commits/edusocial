import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { EmbeddingService } from '../embeddings/embedding.service';
import { AiAnalyticsService } from '../analytics/ai-analytics.service';
import { DocumentProcessor } from '../rag/document-processor.service';

@Processor('ai-processing', {
  concurrency: 3,
})
export class AiProcessingProcessor extends WorkerHost {
  private readonly logger = new Logger(AiProcessingProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingService: EmbeddingService,
    private readonly analyticsService: AiAnalyticsService,
    private readonly documentProcessor: DocumentProcessor,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
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

  private async indexDocument(job: Job): Promise<void> {
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
    } catch (error) {
      this.logger.error(`Document indexing failed: ${filename}`, error);
      throw error;
    }
  }

  private async batchIndex(job: Job): Promise<void> {
    const { documents, userId } = job.data;
    this.logger.log(`Batch indexing ${documents.length} documents`);

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      await this.indexDocument({
        data: { ...doc, userId },
        updateProgress: async (p: number) => {
          await job.updateProgress(Math.round((i / documents.length) * 100 + p / documents.length));
        },
      } as any);
    }
  }

  private async aggregateAnalytics(job: Job): Promise<void> {
    const { userId, days } = job.data;
    this.logger.log(`Aggregating analytics for user ${userId}`);
    const stats = await this.analyticsService.getUserStats(userId, days);
    await job.updateProgress(100);
    return stats as any;
  }
}
