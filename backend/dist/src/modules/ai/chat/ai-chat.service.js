"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AiChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiChatService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../../database/prisma.service");
const provider_factory_1 = require("../providers/provider.factory");
const prompt_registry_1 = require("../prompts/prompt-registry");
const memory_service_1 = require("../memory/memory.service");
const ai_security_service_1 = require("../security/ai-security.service");
const ai_analytics_service_1 = require("../analytics/ai-analytics.service");
const rag_pipeline_service_1 = require("../rag/rag-pipeline.service");
const ai_tools_service_1 = require("../tools/ai-tools.service");
let AiChatService = AiChatService_1 = class AiChatService {
    prisma;
    providerFactory;
    memoryService;
    securityService;
    analyticsService;
    ragPipeline;
    toolsService;
    config;
    logger = new common_1.Logger(AiChatService_1.name);
    constructor(prisma, providerFactory, memoryService, securityService, analyticsService, ragPipeline, toolsService, config) {
        this.prisma = prisma;
        this.providerFactory = providerFactory;
        this.memoryService = memoryService;
        this.securityService = securityService;
        this.analyticsService = analyticsService;
        this.ragPipeline = ragPipeline;
        this.toolsService = toolsService;
        this.config = config;
    }
    async createConversation(userId, title, model) {
        const provider = this.providerFactory.getActiveProvider();
        const conversation = await this.prisma.auditLog.create({
            data: {
                userId,
                action: 'ai_conversation_create',
                entity: 'ai_conversation',
                newData: {
                    title: title || 'New Conversation',
                    model: model || this.config.get('ai.openaiModel') || 'gpt-4o-mini',
                    provider: provider.name,
                },
            },
        });
        return {
            id: conversation.id,
            title: title || 'New Conversation',
            userId,
            model: model || this.config.get('ai.openaiModel') || 'gpt-4o-mini',
            provider: provider.name,
            createdAt: conversation.createdAt,
            updatedAt: conversation.createdAt,
            messageCount: 0,
        };
    }
    async getConversations(userId) {
        const logs = await this.prisma.auditLog.findMany({
            where: { userId, action: 'ai_conversation_create' },
            orderBy: { createdAt: 'desc' },
        });
        return logs.map((log) => {
            const data = log.newData;
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
    async getMessages(conversationId) {
        const logs = await this.prisma.auditLog.findMany({
            where: { entityId: conversationId, action: 'ai_chat_message' },
            orderBy: { createdAt: 'asc' },
        });
        return logs.map((log) => {
            const data = log.newData;
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
    async sendMessage(conversationId, userId, content, options = {}) {
        const startTime = Date.now();
        const securityCheck = this.securityService.comprehensiveCheck(content);
        if (!securityCheck.safe) {
            this.securityService.logSecurityEvent(userId, 'chat_input', securityCheck.flags);
        }
        const sanitizedContent = securityCheck.sanitized || content;
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
        const history = await this.getConversationHistory(conversationId, userId);
        history.push({ role: 'user', content: sanitizedContent });
        let ragContext = '';
        if (options.useRAG && options.ragCollection) {
            try {
                const ragResults = await this.embeddingService_searchSimilar(sanitizedContent, options.ragCollection);
                ragContext = ragResults.map((r) => r.payload.content).join('\n\n');
            }
            catch (error) {
                this.logger.warn('RAG search failed:', error);
            }
        }
        const messages = [];
        if (options.systemPrompt || ragContext) {
            let sysPrompt = options.systemPrompt || 'You are a helpful AI assistant for EduSocial.';
            if (ragContext) {
                sysPrompt += `\n\nRelevant context from documents:\n${ragContext}`;
            }
            messages.push({ role: 'system', content: sysPrompt });
        }
        messages.push(...history);
        const provider = this.providerFactory.getActiveProvider();
        const response = await provider.chatCompletion({
            messages,
            temperature: options.temperature ||
                this.config.get('ai.chatTemperature') ||
                0.7,
            maxTokens: options.maxTokens ||
                this.config.get('ai.chatMaxTokens') ||
                4096,
        });
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
        const cost = this.analyticsService.calculateCost(response.usage.promptTokens, response.usage.completionTokens, {
            costInputPer1M: this.config.get('ai.costInputPer1M') || 0.15,
            costOutputPer1M: this.config.get('ai.costOutputPer1M') || 0.6,
        });
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
        const messageCount = history.length;
        if (messageCount <= 1) {
            this.generateTitle(conversationId, sanitizedContent, userId).catch(() => { });
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
    async *sendMessageStream(conversationId, userId, content, options = {}) {
        const startTime = Date.now();
        const securityCheck = this.securityService.comprehensiveCheck(content);
        const sanitizedContent = securityCheck.sanitized || content;
        await this.prisma.auditLog.create({
            data: {
                userId,
                action: 'ai_chat_message',
                entity: 'ai_conversation',
                entityId: conversationId,
                newData: { role: 'user', content: sanitizedContent },
            },
        });
        const history = await this.getConversationHistory(conversationId, userId);
        history.push({ role: 'user', content: sanitizedContent });
        let ragContext = '';
        if (options.useRAG && options.ragCollection) {
            try {
                const results = await this.embeddingService_searchSimilar(sanitizedContent, options.ragCollection);
                ragContext = results.map((r) => r.payload.content).join('\n\n');
            }
            catch (error) {
                this.logger.warn('RAG search failed:', error);
            }
        }
        const messages = [];
        if (options.systemPrompt || ragContext) {
            let sysPrompt = options.systemPrompt || 'You are a helpful AI assistant for EduSocial.';
            if (ragContext) {
                sysPrompt += `\n\nRelevant context from documents:\n${ragContext}`;
            }
            messages.push({ role: 'system', content: sysPrompt });
        }
        messages.push(...history);
        const provider = this.providerFactory.getActiveProvider();
        let fullContent = '';
        let lastUsage;
        const stream = provider.chatCompletionStream({
            messages,
            temperature: options.temperature ||
                this.config.get('ai.chatTemperature') ||
                0.7,
            maxTokens: options.maxTokens ||
                this.config.get('ai.chatMaxTokens') ||
                4096,
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
        if (lastUsage) {
            const cost = this.analyticsService.calculateCost(lastUsage.promptTokens, lastUsage.completionTokens, {
                costInputPer1M: this.config.get('ai.costInputPer1M') || 0.15,
                costOutputPer1M: this.config.get('ai.costOutputPer1M') || 0.6,
            });
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
        if (history.length <= 1) {
            this.generateTitle(conversationId, sanitizedContent, userId).catch(() => { });
        }
    }
    async getConversationHistory(conversationId, userId) {
        const maxHistory = this.config.get('ai.chatMaxHistory') || 50;
        const logs = await this.prisma.auditLog.findMany({
            where: { entityId: conversationId, action: 'ai_chat_message' },
            orderBy: { createdAt: 'asc' },
            take: maxHistory,
        });
        return logs.map((log) => {
            const data = log.newData;
            return {
                role: (data?.role || 'user'),
                content: data?.content || '',
            };
        });
    }
    async generateTitle(conversationId, firstMessage, userId) {
        try {
            const rendered = prompt_registry_1.PromptRegistry.render('title-generator', {
                message: firstMessage,
            });
            const provider = this.providerFactory.getActiveProvider();
            const response = await provider.chatCompletion({
                messages: [
                    { role: 'system', content: rendered.system },
                    { role: 'user', content: rendered.user },
                ],
                temperature: 0.3,
                maxTokens: 50,
            });
            const log = await this.prisma.auditLog.findUnique({
                where: { id: conversationId },
            });
            if (log) {
                const data = log.newData;
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
        }
        catch (error) {
            this.logger.warn('Failed to generate conversation title:', error);
        }
    }
    async embeddingService_searchSimilar(_query, _collection) {
        return [];
    }
    async deleteConversation(conversationId, userId) {
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
};
exports.AiChatService = AiChatService;
exports.AiChatService = AiChatService = AiChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        provider_factory_1.ProviderFactory,
        memory_service_1.MemoryService,
        ai_security_service_1.AiSecurityService,
        ai_analytics_service_1.AiAnalyticsService,
        rag_pipeline_service_1.RagPipelineService,
        ai_tools_service_1.AiToolsService,
        config_1.ConfigService])
], AiChatService);
//# sourceMappingURL=ai-chat.service.js.map