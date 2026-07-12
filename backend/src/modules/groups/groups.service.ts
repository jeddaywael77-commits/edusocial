import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name);
  constructor(private prisma: PrismaService) {}

  async create(
    adminId: string,
    data: { name: string; description?: string; type?: string; cover?: string },
  ) {
    const group = await this.prisma.group.create({
      data: {
        name: data.name,
        description: data.description,
        type: (data.type as any) || 'CLUB',
        cover: data.cover,
        adminId,
      },
      include: { admin: { select: { id: true, name: true, avatar: true } } },
    });

    await this.prisma.groupMember.create({
      data: { groupId: group.id, userId: adminId, role: 'admin' },
    });

    return group;
  }

  async findAll() {
    return this.prisma.group.findMany({
      include: {
        admin: { select: { id: true, name: true, avatar: true } },
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.group.findUnique({
      where: { id },
      include: {
        admin: { select: { id: true, name: true, avatar: true } },
        members: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true, isOnline: true },
            },
          },
        },
        _count: { select: { members: true, posts: true } },
      },
    });
  }

  async update(
    id: string,
    userId: string,
    data: { name?: string; description?: string; cover?: string },
  ) {
    const group = await this.prisma.group.findUnique({ where: { id } });
    if (!group || group.adminId !== userId) throw new Error('Not authorized');
    return this.prisma.group.update({ where: { id }, data });
  }

  async delete(id: string, userId: string) {
    const group = await this.prisma.group.findUnique({ where: { id } });
    if (!group || group.adminId !== userId) throw new Error('Not authorized');
    return this.prisma.group.delete({ where: { id } });
  }

  async join(groupId: string, userId: string) {
    return this.prisma.groupMember.create({
      data: { groupId, userId },
    });
  }

  async leave(groupId: string, userId: string) {
    return this.prisma.groupMember.deleteMany({
      where: { groupId, userId },
    });
  }
}
