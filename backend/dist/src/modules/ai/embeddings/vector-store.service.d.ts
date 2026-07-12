import { ConfigService } from '@nestjs/config';
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
export declare class VectorStoreService {
    private readonly config;
    private readonly logger;
    private client;
    private readonly collectionPrefix;
    constructor(config: ConfigService);
    getCollectionName(name: string): string;
    ensureCollection(name: string, dimensions: number): Promise<void>;
    upsert(documents: VectorDocument[]): Promise<void>;
    search(collection: string, vector: number[], options?: {
        limit?: number;
        filter?: Record<string, any>;
        scoreThreshold?: number;
    }): Promise<SearchResult[]>;
    deleteByIds(collection: string, ids: string[]): Promise<void>;
    deleteByFilter(collection: string, filter: Record<string, any>): Promise<void>;
    getCollectionInfo(collection: string): Promise<{
        pointsCount: number;
        status: string;
    }>;
    private buildFilter;
}
