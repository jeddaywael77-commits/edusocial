import { PrismaService } from '../../../database/prisma.service';
export interface MemoryEntry {
    id: string;
    userId: string;
    conversationId?: string;
    type: 'conversation' | 'preference' | 'fact' | 'summary';
    content: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}
export declare class MemoryService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    addMemory(userId: string, entry: Omit<MemoryEntry, 'id' | 'createdAt'>): Promise<void>;
    getMemory(userId: string, options?: {
        type?: string;
        conversationId?: string;
        limit?: number;
    }): Promise<MemoryEntry[]>;
    getConversationContext(conversationId: string, maxTokens?: number): Promise<string>;
    getUserPreferences(userId: string): Promise<Record<string, any>>;
    summarizeConversation(conversationId: string): Promise<string>;
}
