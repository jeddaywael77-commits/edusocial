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
export declare class EmbeddingService {
    private readonly providerFactory;
    private readonly vectorStore;
    private readonly config;
    private readonly logger;
    private readonly chunkSize;
    private readonly chunkOverlap;
    constructor(providerFactory: ProviderFactory, vectorStore: VectorStoreService, config: ConfigService);
    chunkDocument(content: string, metadata: {
        source: string;
        sourceType: ChunkedDocument['sourceType'];
        sourceId?: string;
        metadata?: Record<string, any>;
    }): ChunkedDocument[];
    embedAndStore(chunks: ChunkedDocument[], collection: string): Promise<void>;
    searchSimilar(query: string, collection: string, options?: {
        limit?: number;
        filter?: Record<string, any>;
    }): Promise<any[]>;
    deleteBySource(source: string, sourceType: string): Promise<void>;
}
