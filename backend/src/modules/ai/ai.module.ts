import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AiController } from './ai.controller';
import { ProviderFactory } from './providers/provider.factory';
import { AiChatService } from './chat/ai-chat.service';
import { AiFeaturesService } from './ai-features.service';
import { AiSecurityService } from './security/ai-security.service';
import { AiAnalyticsService } from './analytics/ai-analytics.service';
import { MemoryService } from './memory/memory.service';
import { EmbeddingService } from './embeddings/embedding.service';
import { VectorStoreService } from './embeddings/vector-store.service';
import { RagPipelineService } from './rag/rag-pipeline.service';
import { DocumentProcessor } from './rag/document-processor.service';
import { AiToolsService } from './tools/ai-tools.service';
import { AiProcessingProcessor } from './queues/ai-processing.processor';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'ai-processing',
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { age: 3600, count: 100 },
        removeOnFail: { age: 86400 },
      },
    }),
  ],
  controllers: [AiController],
  providers: [
    ProviderFactory,
    AiChatService,
    AiFeaturesService,
    AiSecurityService,
    AiAnalyticsService,
    MemoryService,
    EmbeddingService,
    VectorStoreService,
    RagPipelineService,
    DocumentProcessor,
    AiToolsService,
    AiProcessingProcessor,
  ],
  exports: [
    AiChatService,
    AiFeaturesService,
    EmbeddingService,
    RagPipelineService,
    AiToolsService,
    ProviderFactory,
  ],
})
export class AiModule {}
