import { PrismaService } from '../../../database/prisma.service';
export interface AiUsageRecord {
    userId: string;
    provider: string;
    model: string;
    feature: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    latencyMs: number;
    costUsd: number;
    success: boolean;
    errorMessage?: string;
}
export declare class AiAnalyticsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    trackUsage(record: AiUsageRecord): Promise<void>;
    getUserStats(userId: string, days?: number): Promise<{
        totalRequests: number;
        totalTokens: number;
        totalCostUsd: number;
        byProvider: Record<string, {
            requests: number;
            tokens: number;
            cost: number;
        }>;
        byFeature: Record<string, {
            requests: number;
            tokens: number;
            cost: number;
        }>;
        avgLatencyMs: number;
        successRate: number;
    }>;
    getGlobalStats(days?: number): Promise<{
        totalRequests: number;
        totalTokens: number;
        totalCostUsd: number;
        uniqueUsers: number;
        byModel: Record<string, number>;
    }>;
    calculateCost(promptTokens: number, completionTokens: number, config: {
        costInputPer1M: number;
        costOutputPer1M: number;
    }): number;
}
