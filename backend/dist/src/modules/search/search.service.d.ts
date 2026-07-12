import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Meilisearch } from 'meilisearch';
import { SearchIndexName } from './indexes/search-indexes';
export declare class SearchService implements OnModuleInit {
    private readonly config;
    private readonly logger;
    private client;
    private readonly indexPrefix;
    constructor(config: ConfigService);
    onModuleInit(): void;
    getClient(): Meilisearch;
    getIndexName(entityType: SearchIndexName): string;
    getIndex(entityType: SearchIndexName): import("meilisearch", { with: { "resolution-mode": "import" } }).Index<import("meilisearch", { with: { "resolution-mode": "import" } }).RecordAny>;
    initializeIndexes(): Promise<void>;
    search(query: string, options?: {
        indexes?: string[];
        limit?: number;
        offset?: number;
        filters?: Record<string, string | number | boolean>;
    }): Promise<Record<string, any>>;
    autocomplete(query: string, options?: {
        index?: string;
        limit?: number;
    }): Promise<any[]>;
    addDocuments(entityType: SearchIndexName, documents: any[]): Promise<void>;
    updateDocuments(entityType: SearchIndexName, documents: any[]): Promise<void>;
    deleteDocument(entityType: SearchIndexName, documentId: string): Promise<void>;
    deleteDocuments(entityType: SearchIndexName, documentIds: string[]): Promise<void>;
    clearIndex(entityType: SearchIndexName): Promise<void>;
    getIndexStats(): Promise<Record<string, any>>;
}
