import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);
  constructor(private prisma: PrismaService) {}

  async getTopByXp(limit = 50) {
    return this.prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        avatar: true,
        xp: true,
        level: true,
        coins: true,
        role: true,
      },
      orderBy: { xp: 'desc' },
      take: limit,
    });
  }

  async getTopByLevel(limit = 50) {
    return this.prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        avatar: true,
        xp: true,
        level: true,
        coins: true,
        role: true,
      },
      orderBy: [{ level: 'desc' }, { xp: 'desc' }],
      take: limit,
    });
  }

  async getUserRank(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, avatar: true, xp: true, level: true, coins: true },
    });
    if (!user) throw new Error('User not found');

    const rank = await this.prisma.user.count({
      where: { xp: { gt: user.xp }, isActive: true },
    });

    return { ...user, rank: rank + 1 };
  }
}
