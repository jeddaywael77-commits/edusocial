import { Injectable, Logger } from '@nestjs/common';
import { ProviderFactory } from '../providers/provider.factory';
import { VectorStoreService, VectorDocument } from './vector-store.service';
import { ConfigService } from '@nestjs/config';

export interface ChunkedDocument {
  content: string;
  source: string;
  sourceType: VectorDocument['payload']['sourceType'];
  sourceId?: string;
  chunkIndex: number;
  totalChunks: number;
  metadata?: Record<string, any>;
}

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private readonly chunkSize: number;
  private readonly chunkOverlap: number;

  constructor(
    private readonly providerFactory: ProviderFactory,
    private readonly vectorStore: VectorStoreService,
    private readonly config: ConfigService,
  ) {
    this.chunkSize = this.config.get<number>('ai.ragChunkSize') || 1000;
    this.chunkOverlap = this.config.get<number>('ai.ragChunkOverlap') || 200;
  }

  chunkDocument(
    content: string,
    metadata: {
      source: string;
      sourceType: ChunkedDocument['sourceType'];
      sourceId?: string;
      metadata?: Record<string, any>;
    },
  ): ChunkedDocument[] {
    const chunks: ChunkedDocument[] = [];
    const sentences = content.split(/(?<=[.!?])\s+/);
    let currentChunk = '';
    let chunkIndex = 0;

    for (const sentence of sentences) {
      if (
        currentChunk.length + sentence.length > this.chunkSize &&
        currentChunk.length > 0
      ) {
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
        // Keep overlap
        const words = currentChunk.split(' ');
        const overlapWords = words.slice(-Math.floor(this.chunkOverlap / 5));
        currentChunk = overlapWords.join(' ') + ' ' + sentence;
      } else {
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

    // Update totalChunks
    for (const chunk of chunks) {
      chunk.totalChunks = chunks.length;
    }

    return chunks;
  }

  async embedAndStore(
    chunks: ChunkedDocument[],
    collection: string,
  ): Promise<void> {
    if (!chunks.length) return;

    const dimensions =
      this.config.get<number>('ai.embeddingDimensions') || 1536;
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

        const documents: VectorDocument[] = batch.map((chunk, idx) => ({
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
        this.logger.debug(
          `Embedded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)}`,
        );
      } catch (error) {
        this.logger.error(`Failed to embed batch starting at ${i}:`, error);
      }
    }
  }

  async searchSimilar(
    query: string,
    collection: string,
    options: {
      limit?: number;
      filter?: Record<string, any>;
    } = {},
  ): Promise<any[]> {
    const provider = this.providerFactory.getActiveProvider();
    const result = await provider.createEmbeddings({ input: query });

    return this.vectorStore.search(collection, result.embeddings[0], {
      limit: options.limit || 10,
      filter: options.filter,
    });
  }

  async deleteBySource(source: string, sourceType: string): Promise<void> {
    await this.vectorStore.deleteByFilter('documents', {
      source,
      sourceType,
    });
  }
}
