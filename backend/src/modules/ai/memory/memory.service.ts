import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class MemoryService {
  private readonly logger = new Logger(MemoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async addMemory(userId: string, entry: Omit<MemoryEntry, 'id' | 'createdAt'>): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'ai_memory_add',
          entity: 'ai_memory',
          newData: {
            type: entry.type,
            content: entry.content,
            conversationId: entry.conversationId,
            metadata: entry.metadata || {},
          },
        },
      });
    } catch (error) {
      this.logger.warn(`Failed to add memory for user ${userId}:`, error);
    }
  }

  async getMemory(userId: string, options: {
    type?: string;
    conversationId?: string;
    limit?: number;
  } = {}): Promise<MemoryEntry[]> {
    const { type, conversationId, limit = 20 } = options;

    try {
      const logs = await this.prisma.auditLog.findMany({
        where: {
          userId,
          action: 'ai_memory_add',
          ...(conversationId ? { entityId: conversationId } : {}),
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      return logs
        .map((log) => {
          const data = log.newData as any;
          if (type && data?.type !== type) return null;
          return {
            id: log.id,
            userId: log.userId,
            conversationId: data?.conversationId,
            type: data?.type || 'fact',
            content: data?.content || '',
            metadata: data?.metadata,
            createdAt: log.createdAt,
          };
        })
        .filter(Boolean) as MemoryEntry[];
    } catch (error) {
      this.logger.warn(`Failed to get memory for user ${userId}:`, error);
      return [];
    }
  }

  async getConversationContext(conversationId: string, maxTokens: number = 4000): Promise<string> {
    try {
      const messages = await this.prisma.auditLog.findMany({
        where: {
          entityId: conversationId,
          action: 'ai_chat_message',
        },
        orderBy: { createdAt: 'asc' },
        take: 50,
      });

      let totalTokens = 0;
      const contextParts: string[] = [];

      for (const msg of messages.reverse()) {
        const data = msg.newData as any;
        const part = `${data?.role || 'user'}: ${data?.content || ''}`;
        const estimatedTokens = Math.ceil(part.length / 4);

        if (totalTokens + estimatedTokens > maxTokens) break;
        contextParts.unshift(part);
        totalTokens += estimatedTokens;
      }

      return contextParts.join('\n');
    } catch (error) {
      this.logger.warn(`Failed to get conversation context:`, error);
      return '';
    }
  }

  async getUserPreferences(userId: string): Promise<Record<string, any>> {
    const memories = await this.getMemory(userId, { type: 'preference', limit: 50 });
    const preferences: Record<string, any> = {};
    for (const mem of memories) {
      try {
        const parsed = JSON.parse(mem.content);
        Object.assign(preferences, parsed);
      } catch {
        preferences[mem.metadata?.key || 'general'] = mem.content;
      }
    }
    return preferences;
  }

  async summarizeConversation(conversationId: string): Promise<string> {
    const messages = await this.prisma.auditLog.findMany({
      where: {
        entityId: conversationId,
        action: 'ai_chat_message',
      },
      orderBy: { createdAt: 'asc' },
    });

    const content = messages
      .map((m) => {
        const data = m.newData as any;
        return `${data?.role || 'user'}: ${data?.content || ''}`;
      })
      .join('\n');

    return content.slice(0, 2000);
  }
}
