import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);
  constructor(private prisma: PrismaService) {}

  async getBadges() {
    return this.prisma.badge.findMany({
      include: { _count: { select: { users: true } } },
      orderBy: { xpRequired: 'asc' },
    });
  }

  async getUserBadges(userId: string) {
    return this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
    });
  }

  async awardBadge(userId: string, badgeId: string) {
    return this.prisma.userBadge.upsert({
      where: { userId_badgeId: { userId, badgeId } },
      update: {},
      create: { userId, badgeId },
      include: { badge: true },
    });
  }

  async getUserStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, xp: true, level: true, coins: true },
    });
    if (!user) throw new Error('User not found');

    const badgeCount = await this.prisma.userBadge.count({ where: { userId } });
    const postCount = await this.prisma.post.count({ where: { authorId: userId } });

    return { ...user, badgeCount, postCount };
  }

  async addXp(userId: string, xp: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const newTotalXp = user.xp + xp;
    const newLevel = Math.floor(newTotalXp / 100) + 1;

    return this.prisma.user.update({
      where: { id: userId },
      data: { xp: newTotalXp, level: newLevel },
      select: { id: true, xp: true, level: true, coins: true },
    });
  }
}
