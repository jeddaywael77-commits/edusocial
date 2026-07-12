import { Test, TestingModule } from '@nestjs/testing';
import { GamificationService } from './gamification.service';
import { PrismaService } from '../../database/prisma.service';

describe('GamificationService', () => {
  let service: GamificationService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      badge: {
        findMany: jest.fn(),
      },
      userBadge: {
        findMany: jest.fn(),
        upsert: jest.fn(),
        count: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      post: {
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamificationService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(GamificationService);
  });

  describe('getBadges', () => {
    it('should return all badges ordered by xpRequired ascending', async () => {
      const badges = [
        { id: 'b1', name: 'First Post', xpRequired: 10, _count: { users: 5 } },
        { id: 'b2', name: 'Veteran', xpRequired: 100, _count: { users: 1 } },
      ];
      prisma.badge.findMany.mockResolvedValue(badges);

      const result = await service.getBadges();

      expect(result).toEqual(badges);
      expect(prisma.badge.findMany).toHaveBeenCalledWith({
        include: { _count: { select: { users: true } } },
        orderBy: { xpRequired: 'asc' },
      });
    });
  });

  describe('getUserBadges', () => {
    it('should return user badges with badge details', async () => {
      const userBadges = [
        {
          id: 'ub1',
          userId: 'u1',
          badgeId: 'b1',
          earnedAt: new Date(),
          badge: { id: 'b1', name: 'First Post', xpRequired: 10 },
        },
      ];
      prisma.userBadge.findMany.mockResolvedValue(userBadges);

      const result = await service.getUserBadges('u1');

      expect(result).toEqual(userBadges);
      expect(prisma.userBadge.findMany).toHaveBeenCalledWith({
        where: { userId: 'u1' },
        include: { badge: true },
        orderBy: { earnedAt: 'desc' },
      });
    });

    it('should return empty array when user has no badges', async () => {
      prisma.userBadge.findMany.mockResolvedValue([]);

      const result = await service.getUserBadges('u-no-badges');

      expect(result).toEqual([]);
    });
  });

  describe('awardBadge', () => {
    it('should upsert a user badge', async () => {
      const badge = { id: 'b1', name: 'First Post', xpRequired: 10 };
      const userBadge = {
        id: 'ub1',
        userId: 'u1',
        badgeId: 'b1',
        earnedAt: new Date(),
        badge,
      };
      prisma.userBadge.upsert.mockResolvedValue(userBadge);

      const result = await service.awardBadge('u1', 'b1');

      expect(result).toEqual(userBadge);
      expect(prisma.userBadge.upsert).toHaveBeenCalledWith({
        where: { userId_badgeId: { userId: 'u1', badgeId: 'b1' } },
        update: {},
        create: { userId: 'u1', badgeId: 'b1' },
        include: { badge: true },
      });
    });
  });

  describe('getUserStats', () => {
    it('should return user stats with badge and post counts', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        name: 'Alice',
        xp: 250,
        level: 3,
        coins: 50,
      });
      prisma.userBadge.count.mockResolvedValue(4);
      prisma.post.count.mockResolvedValue(12);

      const result = await service.getUserStats('u1');

      expect(result).toEqual({
        id: 'u1',
        name: 'Alice',
        xp: 250,
        level: 3,
        coins: 50,
        badgeCount: 4,
        postCount: 12,
      });
    });

    it('should throw when user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserStats('nonexistent')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('addXp', () => {
    it('should add xp and recalculate level', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        xp: 50,
        level: 1,
      });
      prisma.user.update.mockResolvedValue({
        id: 'u1',
        xp: 120,
        level: 2,
        coins: 10,
      });

      const result = await service.addXp('u1', 70);

      expect(result.xp).toBe(120);
      expect(result.level).toBe(2);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u1' },
        data: { xp: 120, level: 2 },
        select: { id: true, xp: true, level: true, coins: true },
      });
    });

    it('should set level to 1 when total xp < 100', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        xp: 10,
        level: 1,
      });
      prisma.user.update.mockResolvedValue({
        id: 'u1',
        xp: 50,
        level: 1,
        coins: 0,
      });

      const result = await service.addXp('u1', 40);

      expect(result.level).toBe(1);
    });

    it('should calculate level as floor(totalXp / 100) + 1', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        xp: 250,
        level: 3,
      });
      prisma.user.update.mockResolvedValue({
        id: 'u1',
        xp: 450,
        level: 5,
        coins: 20,
      });

      const result = await service.addXp('u1', 200);

      expect(result.xp).toBe(450);
      expect(result.level).toBe(5);
    });

    it('should throw when user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.addXp('nonexistent', 10)).rejects.toThrow(
        'User not found',
      );
    });
  });
});
