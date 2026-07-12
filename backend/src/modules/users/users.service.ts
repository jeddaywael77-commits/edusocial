import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import {
  buildPaginationArgs,
  buildPaginatedResponse,
} from '../../common/utils/prisma-helpers';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryUsersDto) {
    const { page, limit, skip, sortBy, sortOrder } = buildPaginationArgs(query);

    const where: Prisma.UserWhereInput = {
      isActive: true,
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { email: { contains: query.search, mode: 'insensitive' } },
        ],
      }),
      ...(query.role && { role: query.role }),
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          coverPhoto: true,
          bio: true,
          role: true,
          school: true,
          department: true,
          xp: true,
          level: true,
          coins: true,
          isOnline: true,
          lastSeen: true,
          createdAt: true,
          _count: {
            select: {
              posts: true,
              followers: true,
              following: true,
              friendsA: true,
              friendsB: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return buildPaginatedResponse(users, total, page, limit);
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        coverPhoto: true,
        bio: true,
        role: true,
        school: true,
        department: true,
        xp: true,
        level: true,
        coins: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true,
        badges: {
          select: {
            badge: true,
            earnedAt: true,
          },
        },
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
            friendsA: true,
            friendsB: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto, currentUserId: string) {
    if (id !== currentUserId) {
      throw new NotFoundException('You can only update your own profile');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        coverPhoto: true,
        bio: true,
        role: true,
        school: true,
        department: true,
        updatedAt: true,
      },
    });

    this.logger.log(`User updated: ${id}`);
    return updated;
  }

  async getOnlineUsers() {
    return this.prisma.user.findMany({
      where: { isOnline: true, isActive: true },
      select: {
        id: true,
        name: true,
        avatar: true,
        isOnline: true,
        lastSeen: true,
      },
      orderBy: { lastSeen: 'desc' },
      take: 50,
    });
  }

  async updateOnlineStatus(userId: string, isOnline: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isOnline, lastSeen: new Date() },
    });
  }

  async getLeaderboard(limit: number = 50) {
    return this.prisma.user.findMany({
      where: { isActive: true },
      orderBy: { xp: 'desc' },
      take: limit,
      select: {
        id: true,
        name: true,
        avatar: true,
        xp: true,
        level: true,
        coins: true,
        badges: {
          select: {
            badge: true,
          },
        },
      },
    });
  }
}
