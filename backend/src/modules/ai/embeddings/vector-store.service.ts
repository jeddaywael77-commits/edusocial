import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QdrantClient } from '@qdrant/js-client-rest';
import type { AIProvider } from '../providers/ai-provider.interface';

export interface VectorDocument {
  id: string;
  collection: string;
  vector: number[];
  payload: {
    content: string;
    source: string;
    sourceType: 'pdf' | 'docx' | 'txt' | 'md' | 'pptx' | 'image' | 'lesson' | 'assignment';
    sourceId?: string;
    chunkIndex: number;
    totalChunks: number;
    metadata?: Record<string, any>;
  };
}

export interface SearchResult {
  id: string;
  score: number;
  payload: VectorDocument['payload'];
}

@Injectable()
export class VectorStoreService {
  private readonly logger = new Logger(VectorStoreService.name);
  private client: QdrantClient;
  private readonly collectionPrefix: string;

  constructor(private readonly config: ConfigService) {
    const qdrantUrl = this.config.get<string>('ai.qdrantUrl') || 'http://localhost:6333';
    const qdrantApiKey = this.config.get<string>('ai.qdrantApiKey');
    this.collectionPrefix = this.config.get<string>('ai.qdrantCollectionPrefix') || 'edusocial_';

    this.client = new QdrantClient({
      url: qdrantUrl,
      apiKey: qdrantApiKey || undefined,
    });

    this.logger.log(`Qdrant client initialized: ${qdrantUrl}`);
  }

  getCollectionName(name: string): string {
    return `${this.collectionPrefix}${name}`;
  }

  async ensureCollection(name: string, dimensions: number): Promise<void> {
    const collectionName = this.getCollectionName(name);
    try {
      await this.client.getCollection(collectionName);
    } catch {
      await this.client.createCollection(collectionName, {
        vectors: {
          size: dimensions,
          distance: 'Cosine',
        },
        optimizers_config: {
          indexing_threshold: 20000,
        },
      });
      this.logger.log(`Created Qdrant collection: ${collectionName}`);
    }
  }

  async upsert(documents: VectorDocument[]): Promise<void> {
    const grouped = new Map<string, VectorDocument[]>();
    for (const doc of documents) {
      const key = doc.collection;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(doc);
    }

    for (const [collection, docs] of grouped) {
      const collectionName = this.getCollectionName(collection);
      await this.client.upsert(collectionName, {
        points: docs.map((doc) => ({
          id: doc.id,
          vector: doc.vector,
          payload: doc.payload,
        })),
      });
      this.logger.debug(`Upserted ${docs.length} documents into ${collectionName}`);
    }
  }

  async search(
    collection: string,
    vector: number[],
    options: {
      limit?: number;
      filter?: Record<string, any>;
      scoreThreshold?: number;
    } = {},
  ): Promise<SearchResult[]> {
    const collectionName = this.getCollectionName(collection);
    const { limit = 10, filter, scoreThreshold = 0.5 } = options;

    const results = await this.client.search(collectionName, {
      vector,
      limit,
      filter: filter ? this.buildFilter(filter) : undefined,
      score_threshold: scoreThreshold,
      with_payload: true,
    });

    return results.map((r) => ({
      id: String(r.id),
      score: r.score,
      payload: r.payload as VectorDocument['payload'],
    }));
  }

  async deleteByIds(collection: string, ids: string[]): Promise<void> {
    const collectionName = this.getCollectionName(collection);
    await this.client.delete(collectionName, {
      points: ids,
    });
  }

  async deleteByFilter(collection: string, filter: Record<string, any>): Promise<void> {
    const collectionName = this.getCollectionName(collection);
    await this.client.delete(collectionName, {
      filter: this.buildFilter(filter),
    });
  }

  async getCollectionInfo(collection: string): Promise<{
    pointsCount: number;
    status: string;
  }> {
    const collectionName = this.getCollectionName(collection);
    try {
      const info = await this.client.getCollection(collectionName);
      return {
        pointsCount: info.points_count || 0,
        status: info.status || 'unknown',
      };
    } catch {
      return { pointsCount: 0, status: 'not_found' };
    }
  }

  private buildFilter(filter: Record<string, any>): any {
    const must: any[] = [];
    for (const [key, value] of Object.entries(filter)) {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        must.push({
          key,
          match: { value },
        });
      }
    }
    return { must };
  }
}
