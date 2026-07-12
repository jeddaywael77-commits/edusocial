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
var AiAnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let AiAnalyticsService = AiAnalyticsService_1 = class AiAnalyticsService {
    prisma;
    logger = new common_1.Logger(AiAnalyticsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async trackUsage(record) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    userId: record.userId,
                    action: 'ai_usage',
                    entity: 'ai_analytics',
                    newData: {
                        provider: record.provider,
                        model: record.model,
                        feature: record.feature,
                        promptTokens: record.promptTokens,
                        completionTokens: record.completionTokens,
                        totalTokens: record.totalTokens,
                        latencyMs: record.latencyMs,
                        costUsd: record.costUsd,
                        success: record.success,
                        errorMessage: record.errorMessage,
                    },
                },
            });
        }
        catch (error) {
            this.logger.warn('Failed to track AI usage:', error);
        }
    }
    async getUserStats(userId, days = 30) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        try {
            const logs = await this.prisma.auditLog.findMany({
                where: {
                    userId,
                    action: 'ai_usage',
                    createdAt: { gte: since },
                },
            });
            const byProvider = {};
            const byFeature = {};
            let totalTokens = 0;
            let totalCost = 0;
            let totalLatency = 0;
            let successCount = 0;
            for (const log of logs) {
                const data = log.newData;
                const provider = data?.provider || 'unknown';
                const feature = data?.feature || 'unknown';
                const tokens = data?.totalTokens || 0;
                const cost = data?.costUsd || 0;
                const latency = data?.latencyMs || 0;
                const success = data?.success !== false;
                totalTokens += tokens;
                totalCost += cost;
                totalLatency += latency;
                if (success)
                    successCount++;
                if (!byProvider[provider])
                    byProvider[provider] = { requests: 0, tokens: 0, cost: 0 };
                byProvider[provider].requests++;
                byProvider[provider].tokens += tokens;
                byProvider[provider].cost += cost;
                if (!byFeature[feature])
                    byFeature[feature] = { requests: 0, tokens: 0, cost: 0 };
                byFeature[feature].requests++;
                byFeature[feature].tokens += tokens;
                byFeature[feature].cost += cost;
            }
            return {
                totalRequests: logs.length,
                totalTokens,
                totalCostUsd: totalCost,
                byProvider,
                byFeature,
                avgLatencyMs: logs.length > 0 ? totalLatency / logs.length : 0,
                successRate: logs.length > 0 ? successCount / logs.length : 1,
            };
        }
        catch (error) {
            this.logger.warn('Failed to get user AI stats:', error);
            return {
                totalRequests: 0,
                totalTokens: 0,
                totalCostUsd: 0,
                byProvider: {},
                byFeature: {},
                avgLatencyMs: 0,
                successRate: 1,
            };
        }
    }
    async getGlobalStats(days = 7) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        try {
            const logs = await this.prisma.auditLog.findMany({
                where: {
                    action: 'ai_usage',
                    createdAt: { gte: since },
                },
            });
            const byModel = {};
            const uniqueUsers = new Set();
            let totalTokens = 0;
            let totalCost = 0;
            for (const log of logs) {
                const data = log.newData;
                if (log.userId)
                    uniqueUsers.add(log.userId);
                totalTokens += data?.totalTokens || 0;
                totalCost += data?.costUsd || 0;
                const model = data?.model || 'unknown';
                byModel[model] = (byModel[model] || 0) + 1;
            }
            return {
                totalRequests: logs.length,
                totalTokens,
                totalCostUsd: totalCost,
                uniqueUsers: uniqueUsers.size,
                byModel,
            };
        }
        catch (error) {
            this.logger.warn('Failed to get global AI stats:', error);
            return {
                totalRequests: 0,
                totalTokens: 0,
                totalCostUsd: 0,
                uniqueUsers: 0,
                byModel: {},
            };
        }
    }
    calculateCost(promptTokens, completionTokens, config) {
        return ((promptTokens / 1_000_000) * config.costInputPer1M +
            (completionTokens / 1_000_000) * config.costOutputPer1M);
    }
};
exports.AiAnalyticsService = AiAnalyticsService;
exports.AiAnalyticsService = AiAnalyticsService = AiAnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AiAnalyticsService);
//# sourceMappingURL=ai-analytics.service.js.map