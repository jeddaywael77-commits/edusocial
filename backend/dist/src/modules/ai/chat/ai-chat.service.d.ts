import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../database/prisma.service';
import { ProviderFactory } from '../providers/provider.factory';
import { MemoryService } from '../memory/memory.service';
import { AiSecurityService } from '../security/ai-security.service';
import { AiAnalyticsService } from '../analytics/ai-analytics.service';
import { RagPipelineService } from '../rag/rag-pipeline.service';
import { AiToolsService } from '../tools/ai-tools.service';
import type { StreamChunk } from '../providers/ai-provider.interface';
export interface AiChatConversation {
    id: string;
    title: string;
    userId: string;
    model: string;
    provider: string;
    createdAt: Date;
    updatedAt: Date;
    messageCount: number;
}
export interface AiChatMessage {
    id: string;
    conversationId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    tokenUsage?: number;
    createdAt: Date;
}
export declare class AiChatService {
    private readonly prisma;
    private readonly providerFactory;
    private readonly memoryService;
    private readonly securityService;
    private readonly analyticsService;
    private readonly ragPipeline;
    private readonly toolsService;
    private readonly config;
    private readonly logger;
    constructor(prisma: PrismaService, providerFactory: ProviderFactory, memoryService: MemoryService, securityService: AiSecurityService, analyticsService: AiAnalyticsService, ragPipeline: RagPipelineService, toolsService: AiToolsService, config: ConfigService);
    createConversation(userId: string, title?: string, model?: string): Promise<AiChatConversation>;
    getConversations(userId: string): Promise<AiChatConversation[]>;
    getMessages(conversationId: string): Promise<AiChatMessage[]>;
    sendMessage(conversationId: string, userId: string, content: string, options?: {
        systemPrompt?: string;
        useRAG?: boolean;
        ragCollection?: string;
        temperature?: number;
        maxTokens?: number;
    }): Promise<{
        message: AiChatMessage;
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    }>;
    sendMessageStream(conversationId: string, userId: string, content: string, options?: {
        systemPrompt?: string;
        useRAG?: boolean;
        ragCollection?: string;
        temperature?: number;
        maxTokens?: number;
    }): AsyncGenerator<StreamChunk, void, unknown>;
    private getConversationHistory;
    private generateTitle;
    private embeddingService_searchSimilar;
    deleteConversation(conversationId: string, userId: string): Promise<void>;
}
