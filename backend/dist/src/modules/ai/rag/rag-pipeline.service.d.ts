import { ConfigService } from '@nestjs/config';
import { ProviderFactory } from '../providers/provider.factory';
import { EmbeddingService } from '../embeddings/embedding.service';
import { VectorStoreService } from '../embeddings/vector-store.service';
import { DocumentProcessor } from './document-processor.service';
import type { ProcessedDocument } from './document-processor.service';
export interface RAGResult {
    answer: string;
    sources: {
        content: string;
        source: string;
        sourceType: string;
        score: number;
    }[];
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    latencyMs: number;
}
export declare class RagPipelineService {
    private readonly providerFactory;
    private readonly embeddingService;
    private readonly vectorStore;
    private readonly documentProcessor;
    private readonly config;
    private readonly logger;
    private readonly topK;
    private readonly rerankTopK;
    private readonly maxContextLength;
    constructor(providerFactory: ProviderFactory, embeddingService: EmbeddingService, vectorStore: VectorStoreService, documentProcessor: DocumentProcessor, config: ConfigService);
    indexDocument(buffer: Buffer, mimeType: string, filename: string, collection: string, metadata?: {
        sourceId?: string;
        sourceType?: 'pdf' | 'docx' | 'txt' | 'md' | 'pptx' | 'image' | 'lesson' | 'assignment';
    }): Promise<{
        chunks: number;
        document: ProcessedDocument;
    }>;
    query(question: string, collection: string, options?: {
        topK?: number;
        filter?: Record<string, any>;
        systemPrompt?: string;
        stream?: boolean;
    }): Promise<RAGResult | AsyncGenerator<{
        content: string;
        done: boolean;
        sources?: RAGResult['sources'];
    }, void, unknown>>;
    private streamResponse;
}
