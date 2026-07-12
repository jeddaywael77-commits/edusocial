import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class FollowersService {
  private readonly logger = new Logger(FollowersService.name);
  constructor(private prisma: PrismaService) {}

  async follow(followerId: string, userId: string) {
    return this.prisma.follower.create({
      data: { followerId, userId },
      include: {
        follower: { select: { id: true, name: true, avatar: true } },
        user: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async unfollow(followerId: string, userId: string) {
    return this.prisma.follower.deleteMany({
      where: { followerId, userId },
    });
  }

  async getFollowers(userId: string) {
    return this.prisma.follower.findMany({
      where: { userId },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            avatar: true,
            isOnline: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFollowing(userId: string) {
    return this.prisma.follower.findMany({
      where: { followerId: userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            isOnline: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFollowerCount(userId: string) {
    return this.prisma.follower.count({ where: { userId } });
  }

  async getFollowingCount(userId: string) {
    return this.prisma.follower.count({ where: { followerId: userId } });
  }
}
