import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class AiAnalyticsService {
  private readonly logger = new Logger(AiAnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async trackUsage(record: AiUsageRecord): Promise<void> {
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
    } catch (error) {
      this.logger.warn('Failed to track AI usage:', error);
    }
  }

  async getUserStats(userId: string, days: number = 30): Promise<{
    totalRequests: number;
    totalTokens: number;
    totalCostUsd: number;
    byProvider: Record<string, { requests: number; tokens: number; cost: number }>;
    byFeature: Record<string, { requests: number; tokens: number; cost: number }>;
    avgLatencyMs: number;
    successRate: number;
  }> {
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

      const byProvider: Record<string, { requests: number; tokens: number; cost: number }> = {};
      const byFeature: Record<string, { requests: number; tokens: number; cost: number }> = {};
      let totalTokens = 0;
      let totalCost = 0;
      let totalLatency = 0;
      let successCount = 0;

      for (const log of logs) {
        const data = log.newData as any;
        const provider = data?.provider || 'unknown';
        const feature = data?.feature || 'unknown';
        const tokens = data?.totalTokens || 0;
        const cost = data?.costUsd || 0;
        const latency = data?.latencyMs || 0;
        const success = data?.success !== false;

        totalTokens += tokens;
        totalCost += cost;
        totalLatency += latency;
        if (success) successCount++;

        if (!byProvider[provider]) byProvider[provider] = { requests: 0, tokens: 0, cost: 0 };
        byProvider[provider].requests++;
        byProvider[provider].tokens += tokens;
        byProvider[provider].cost += cost;

        if (!byFeature[feature]) byFeature[feature] = { requests: 0, tokens: 0, cost: 0 };
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
    } catch (error) {
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

  async getGlobalStats(days: number = 7): Promise<{
    totalRequests: number;
    totalTokens: number;
    totalCostUsd: number;
    uniqueUsers: number;
    byModel: Record<string, number>;
  }> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    try {
      const logs = await this.prisma.auditLog.findMany({
        where: {
          action: 'ai_usage',
          createdAt: { gte: since },
        },
      });

      const byModel: Record<string, number> = {};
      const uniqueUsers = new Set<string>();
      let totalTokens = 0;
      let totalCost = 0;

      for (const log of logs) {
        const data = log.newData as any;
        if (log.userId) uniqueUsers.add(log.userId);
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
    } catch (error) {
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

  calculateCost(promptTokens: number, completionTokens: number, config: {
    costInputPer1M: number;
    costOutputPer1M: number;
  }): number {
    return (
      (promptTokens / 1_000_000) * config.costInputPer1M +
      (completionTokens / 1_000_000) * config.costOutputPer1M
    );
  }
}
