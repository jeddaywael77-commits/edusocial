import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../database/prisma.service';
import { ProviderFactory } from '../providers/provider.factory';
import { PromptRegistry } from '../prompts/prompt-registry';
import { MemoryService } from '../memory/memory.service';
import { AiSecurityService } from '../security/ai-security.service';
import { AiAnalyticsService } from '../analytics/ai-analytics.service';
import { RagPipelineService } from '../rag/rag-pipeline.service';
import { AiToolsService } from '../tools/ai-tools.service';
import type { ChatMessage, StreamChunk } from '../providers/ai-provider.interface';

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

@Injectable()
export class AiChatService {
  private readonly logger = new Logger(AiChatService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly providerFactory: ProviderFactory,
    private readonly memoryService: MemoryService,
    private readonly securityService: AiSecurityService,
    private readonly analyticsService: AiAnalyticsService,
    private readonly ragPipeline: RagPipelineService,
    private readonly toolsService: AiToolsService,
    private readonly config: ConfigService,
  ) {}

  async createConversation(userId: string, title?: string, model?: string): Promise<AiChatConversation> {
    const provider = this.providerFactory.getActiveProvider();
    const conversation = await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'ai_conversation_create',
        entity: 'ai_conversation',
        newData: {
          title: title || 'New Conversation',
          model: model || this.config.get<string>('ai.openaiModel') || 'gpt-4o-mini',
          provider: provider.name,
        },
      },
    });

    return {
      id: conversation.id,
      title: title || 'New Conversation',
      userId,
      model: model || this.config.get<string>('ai.openaiModel') || 'gpt-4o-mini',
      provider: provider.name,
      createdAt: conversation.createdAt,
      updatedAt: conversation.createdAt,
      messageCount: 0,
    };
  }

  async getConversations(userId: string): Promise<AiChatConversation[]> {
    const logs = await this.prisma.auditLog.findMany({
      where: { userId, action: 'ai_conversation_create' },
      orderBy: { createdAt: 'desc' },
    });

    return logs.map((log) => {
      const data = log.newData as any;
      return {
        id: log.id,
        title: data?.title || 'Untitled',
        userId,
        model: data?.model || 'gpt-4o-mini',
        provider: data?.provider || 'openai',
        createdAt: log.createdAt,
        updatedAt: log.createdAt,
        messageCount: 0,
      };
    });
  }

  async getMessages(conversationId: string): Promise<AiChatMessage[]> {
    const logs = await this.prisma.auditLog.findMany({
      where: { entityId: conversationId, action: 'ai_chat_message' },
      orderBy: { createdAt: 'asc' },
    });

    return logs.map((log) => {
      const data = log.newData as any;
      return {
        id: log.id,
        conversationId,
        role: data?.role || 'user',
        content: data?.content || '',
        tokenUsage: data?.tokenUsage,
        createdAt: log.createdAt,
      };
    });
  }

  async sendMessage(
    conversationId: string,
    userId: string,
    content: string,
    options: {
      systemPrompt?: string;
      useRAG?: boolean;
      ragCollection?: string;
      temperature?: number;
      maxTokens?: number;
    } = {},
  ): Promise<{ message: AiChatMessage; usage: { promptTokens: number; completionTokens: number; totalTokens: number } }> {
    const startTime = Date.now();

    // Security check
    const securityCheck = this.securityService.comprehensiveCheck(content);
    if (!securityCheck.safe) {
      this.securityService.logSecurityEvent(userId, 'chat_input', securityCheck.flags);
    }

    const sanitizedContent = securityCheck.sanitized || content;

    // Save user message
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'ai_chat_message',
        entity: 'ai_conversation',
        entityId: conversationId,
        newData: {
          role: 'user',
          content: sanitizedContent,
        },
      },
    });

    // Build message history
    const history = await this.getConversationHistory(conversationId, userId);
    history.push({ role: 'user', content: sanitizedContent });

    // RAG context if enabled
    let ragContext = '';
    if (options.useRAG && options.ragCollection) {
      try {
        const ragResults = await this.embeddingService_searchSimilar(sanitizedContent, options.ragCollection);
        ragContext = ragResults.map((r: any) => r.payload.content).join('\n\n');
      } catch (error) {
        this.logger.warn('RAG search failed:', error);
      }
    }

    // Build messages
    const messages: ChatMessage[] = [];
    if (options.systemPrompt || ragContext) {
      let sysPrompt = options.systemPrompt || 'You are a helpful AI assistant for EduSocial.';
      if (ragContext) {
        sysPrompt += `\n\nRelevant context from documents:\n${ragContext}`;
      }
      messages.push({ role: 'system', content: sysPrompt });
    }
    messages.push(...history);

    // Generate response
    const provider = this.providerFactory.getActiveProvider();
    const response = await provider.chatCompletion({
      messages,
      temperature: options.temperature || this.config.get<number>('ai.chatTemperature') || 0.7,
      maxTokens: options.maxTokens || this.config.get<number>('ai.chatMaxTokens') || 4096,
    });

    // Save assistant message
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'ai_chat_message',
        entity: 'ai_conversation',
        entityId: conversationId,
        newData: {
          role: 'assistant',
          content: response.content,
          tokenUsage: response.usage.totalTokens,
        },
      },
    });

    // Track analytics
    const cost = this.analyticsService.calculateCost(
      response.usage.promptTokens,
      response.usage.completionTokens,
      {
        costInputPer1M: this.config.get<number>('ai.costInputPer1M') || 0.15,
        costOutputPer1M: this.config.get<number>('ai.costOutputPer1M') || 0.60,
      },
    );

    await this.analyticsService.trackUsage({
      userId,
      provider: provider.name,
      model: response.model,
      feature: 'chat',
      promptTokens: response.usage.promptTokens,
      completionTokens: response.usage.completionTokens,
      totalTokens: response.usage.totalTokens,
      latencyMs: Date.now() - startTime,
      costUsd: cost,
      success: true,
    });

    // Generate title if first message
    const messageCount = history.length;
    if (messageCount <= 1) {
      this.generateTitle(conversationId, sanitizedContent, userId).catch(() => {});
    }

    return {
      message: {
        id: `msg-${Date.now()}`,
        conversationId,
        role: 'assistant',
        content: response.content,
        tokenUsage: response.usage.totalTokens,
        createdAt: new Date(),
      },
      usage: response.usage,
    };
  }

  async *sendMessageStream(
    conversationId: string,
    userId: string,
    content: string,
    options: {
      systemPrompt?: string;
      useRAG?: boolean;
      ragCollection?: string;
      temperature?: number;
      maxTokens?: number;
    } = {},
  ): AsyncGenerator<StreamChunk, void, unknown> {
    const startTime = Date.now();

    // Security check
    const securityCheck = this.securityService.comprehensiveCheck(content);
    const sanitizedContent = securityCheck.sanitized || content;

    // Save user message
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'ai_chat_message',
        entity: 'ai_conversation',
        entityId: conversationId,
        newData: { role: 'user', content: sanitizedContent },
      },
    });

    // Build message history
    const history = await this.getConversationHistory(conversationId, userId);
    history.push({ role: 'user', content: sanitizedContent });

    // RAG context
    let ragContext = '';
    if (options.useRAG && options.ragCollection) {
      try {
        const results = await this.embeddingService_searchSimilar(sanitizedContent, options.ragCollection);
        ragContext = results.map((r: any) => r.payload.content).join('\n\n');
      } catch (error) {
        this.logger.warn('RAG search failed:', error);
      }
    }

    const messages: ChatMessage[] = [];
    if (options.systemPrompt || ragContext) {
      let sysPrompt = options.systemPrompt || 'You are a helpful AI assistant for EduSocial.';
      if (ragContext) {
        sysPrompt += `\n\nRelevant context from documents:\n${ragContext}`;
      }
      messages.push({ role: 'system', content: sysPrompt });
    }
    messages.push(...history);

    // Stream response
    const provider = this.providerFactory.getActiveProvider();
    let fullContent = '';
    let lastUsage;

    const stream = provider.chatCompletionStream({
      messages,
      temperature: options.temperature || this.config.get<number>('ai.chatTemperature') || 0.7,
      maxTokens: options.maxTokens || this.config.get<number>('ai.chatMaxTokens') || 4096,
    });

    for await (const chunk of stream) {
      if (chunk.content) {
        fullContent += chunk.content;
        yield chunk;
      }
      if (chunk.usage) {
        lastUsage = chunk.usage;
      }
    }

    // Save assistant message
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'ai_chat_message',
        entity: 'ai_conversation',
        entityId: conversationId,
        newData: {
          role: 'assistant',
          content: fullContent,
          tokenUsage: lastUsage?.totalTokens || 0,
        },
      },
    });

    // Track analytics
    if (lastUsage) {
      const cost = this.analyticsService.calculateCost(
        lastUsage.promptTokens,
        lastUsage.completionTokens,
        {
          costInputPer1M: this.config.get<number>('ai.costInputPer1M') || 0.15,
          costOutputPer1M: this.config.get<number>('ai.costOutputPer1M') || 0.60,
        },
      );

      await this.analyticsService.trackUsage({
        userId,
        provider: provider.name,
        model: 'streaming',
        feature: 'chat_stream',
        promptTokens: lastUsage.promptTokens,
        completionTokens: lastUsage.completionTokens,
        totalTokens: lastUsage.totalTokens,
        latencyMs: Date.now() - startTime,
        costUsd: cost,
        success: true,
      });
    }

    // Generate title if first message
    if (history.length <= 1) {
      this.generateTitle(conversationId, sanitizedContent, userId).catch(() => {});
    }
  }

  private async getConversationHistory(conversationId: string, userId: string): Promise<ChatMessage[]> {
    const maxHistory = this.config.get<number>('ai.chatMaxHistory') || 50;
    const logs = await this.prisma.auditLog.findMany({
      where: { entityId: conversationId, action: 'ai_chat_message' },
      orderBy: { createdAt: 'asc' },
      take: maxHistory,
    });

    return logs.map((log) => {
      const data = log.newData as any;
      return {
        role: (data?.role || 'user') as 'user' | 'assistant',
        content: data?.content || '',
      };
    });
  }

  private async generateTitle(conversationId: string, firstMessage: string, userId: string): Promise<void> {
    try {
      const rendered = PromptRegistry.render('title-generator', { message: firstMessage });
      const provider = this.providerFactory.getActiveProvider();
      const response = await provider.chatCompletion({
        messages: [
          { role: 'system', content: rendered.system },
          { role: 'user', content: rendered.user },
        ],
        temperature: 0.3,
        maxTokens: 50,
      });

      // Update conversation title
      const log = await this.prisma.auditLog.findUnique({ where: { id: conversationId } });
      if (log) {
        const data = log.newData as any;
        await this.prisma.auditLog.update({
          where: { id: conversationId },
          data: {
            newData: {
              ...data,
              title: response.content.trim().replace(/^["']|["']$/g, ''),
            },
          },
        });
      }
    } catch (error) {
      this.logger.warn('Failed to generate conversation title:', error);
    }
  }

  private async embeddingService_searchSimilar(_query: string, _collection: string): Promise<any[]> {
    // Placeholder - in production, inject EmbeddingService properly
    return [];
  }

  async deleteConversation(conversationId: string, userId: string): Promise<void> {
    await this.prisma.auditLog.deleteMany({
      where: {
        entityId: conversationId,
        action: 'ai_chat_message',
        userId,
      },
    });
    await this.prisma.auditLog.delete({
      where: { id: conversationId },
    });
  }
}
