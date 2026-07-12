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
var MemoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let MemoryService = MemoryService_1 = class MemoryService {
    prisma;
    logger = new common_1.Logger(MemoryService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addMemory(userId, entry) {
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
        }
        catch (error) {
            this.logger.warn(`Failed to add memory for user ${userId}:`, error);
        }
    }
    async getMemory(userId, options = {}) {
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
                const data = log.newData;
                if (type && data?.type !== type)
                    return null;
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
                .filter(Boolean);
        }
        catch (error) {
            this.logger.warn(`Failed to get memory for user ${userId}:`, error);
            return [];
        }
    }
    async getConversationContext(conversationId, maxTokens = 4000) {
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
            const contextParts = [];
            for (const msg of messages.reverse()) {
                const data = msg.newData;
                const part = `${data?.role || 'user'}: ${data?.content || ''}`;
                const estimatedTokens = Math.ceil(part.length / 4);
                if (totalTokens + estimatedTokens > maxTokens)
                    break;
                contextParts.unshift(part);
                totalTokens += estimatedTokens;
            }
            return contextParts.join('\n');
        }
        catch (error) {
            this.logger.warn(`Failed to get conversation context:`, error);
            return '';
        }
    }
    async getUserPreferences(userId) {
        const memories = await this.getMemory(userId, {
            type: 'preference',
            limit: 50,
        });
        const preferences = {};
        for (const mem of memories) {
            try {
                const parsed = JSON.parse(mem.content);
                Object.assign(preferences, parsed);
            }
            catch {
                preferences[mem.metadata?.key || 'general'] = mem.content;
            }
        }
        return preferences;
    }
    async summarizeConversation(conversationId) {
        const messages = await this.prisma.auditLog.findMany({
            where: {
                entityId: conversationId,
                action: 'ai_chat_message',
            },
            orderBy: { createdAt: 'asc' },
        });
        const content = messages
            .map((m) => {
            const data = m.newData;
            return `${data?.role || 'user'}: ${data?.content || ''}`;
        })
            .join('\n');
        return content.slice(0, 2000);
    }
};
exports.MemoryService = MemoryService;
exports.MemoryService = MemoryService = MemoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MemoryService);
//# sourceMappingURL=memory.service.js.map