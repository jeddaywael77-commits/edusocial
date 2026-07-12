import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
import { SocketEvents } from '../socket/socket.events';
import { QueryGroupMembersDto } from './dto/group-members.dto';

@Injectable()
export class GroupMembersService {
  private readonly logger = new Logger(GroupMembersService.name);

  constructor(
    private prisma: PrismaService,
    private socketGateway: SocketGateway,
  ) {}

  async getMembers(groupId: string, query: QueryGroupMembersDto) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });
    if (!group) throw new NotFoundException('Group not found');

    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.GroupMemberWhereInput = {
      groupId,
      ...(query.search && {
        user: {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { email: { contains: query.search, mode: 'insensitive' } },
          ],
        },
      }),
      ...(query.role && { role: query.role }),
    };

    const sortBy = query.sortBy || 'joinedAt';
    const sortOrder = query.sortOrder || 'desc';

    const [members, total] = await Promise.all([
      this.prisma.groupMember.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              isOnline: true,
              level: true,
              xp: true,
            },
          },
        },
      }),
      this.prisma.groupMember.count({ where }),
    ]);

    return {
      data: members,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async getMember(groupId: string, userId: string) {
    const member = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            bio: true,
            isOnline: true,
            level: true,
            xp: true,
            lastSeen: true,
          },
        },
        group: {
          select: { id: true, name: true, type: true, adminId: true },
        },
      },
    });

    if (!member) throw new NotFoundException('Member not found');
    return member;
  }

  async updateMemberRole(
    groupId: string,
    userId: string,
    newRole: string,
    requesterId: string,
  ) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });
    if (!group) throw new NotFoundException('Group not found');

    const requester = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: requesterId } },
    });
    if (
      !requester ||
      (requester.role !== 'admin' && requester.role !== 'moderator')
    ) {
      throw new ForbiddenException(
        'Only group admin or moderator can change roles',
      );
    }

    if (userId === requesterId && newRole !== 'admin') {
      throw new ForbiddenException('Cannot demote yourself');
    }

    const target = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    if (!target) throw new NotFoundException('Member not found');

    if (target.role === 'admin' && requester.role !== 'admin') {
      throw new ForbiddenException(
        'Only the group admin can change the admin role',
      );
    }

    const updated = await this.prisma.groupMember.update({
      where: { groupId_userId: { groupId, userId } },
      data: { role: newRole },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    this.logger.log(
      `Member ${userId} role changed to ${newRole} in group ${groupId}`,
    );
    this.socketGateway.broadcastToGroup(
      groupId,
      SocketEvents.GROUP_MEMBER_UPDATED,
      {
        groupId,
        userId,
        role: newRole,
      },
    );

    return updated;
  }

  async removeMember(groupId: string, userId: string, requesterId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });
    if (!group) throw new NotFoundException('Group not found');

    if (userId === group.adminId) {
      throw new ForbiddenException('Cannot remove the group admin');
    }

    if (userId === requesterId) {
      throw new ForbiddenException('Use the leave endpoint to leave a group');
    }

    const requester = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: requesterId } },
    });
    if (
      !requester ||
      (requester.role !== 'admin' && requester.role !== 'moderator')
    ) {
      throw new ForbiddenException(
        'Only group admin or moderator can remove members',
      );
    }

    const target = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    if (!target) throw new NotFoundException('Member not found');

    await this.prisma.groupMember.delete({
      where: { groupId_userId: { groupId, userId } },
    });

    this.logger.log(
      `Member ${userId} removed from group ${groupId} by ${requesterId}`,
    );
    this.socketGateway.broadcastToGroup(
      groupId,
      SocketEvents.GROUP_MEMBER_REMOVED,
      {
        groupId,
        userId,
      },
    );

    this.socketGateway.broadcastToUser(
      userId,
      SocketEvents.NOTIFICATION_RECEIVED,
      {
        title: 'Removed from Group',
        message: `You have been removed from ${group.name}`,
      },
    );

    return { success: true };
  }

  async transferOwnership(
    groupId: string,
    newAdminId: string,
    currentAdminId: string,
  ) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });
    if (!group) throw new NotFoundException('Group not found');
    if (group.adminId !== currentAdminId) {
      throw new ForbiddenException(
        'Only the group admin can transfer ownership',
      );
    }

    if (newAdminId === currentAdminId) {
      throw new ForbiddenException('Cannot transfer ownership to yourself');
    }

    const newAdminMember = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: newAdminId } },
    });
    if (!newAdminMember) {
      throw new NotFoundException('New admin must be a member of the group');
    }

    await this.prisma.$transaction([
      this.prisma.group.update({
        where: { id: groupId },
        data: { adminId: newAdminId },
      }),
      this.prisma.groupMember.update({
        where: { groupId_userId: { groupId, userId: newAdminId } },
        data: { role: 'admin' },
      }),
      this.prisma.groupMember.update({
        where: { groupId_userId: { groupId, userId: currentAdminId } },
        data: { role: 'member' },
      }),
    ]);

    this.logger.log(
      `Group ${groupId} ownership transferred from ${currentAdminId} to ${newAdminId}`,
    );
    this.socketGateway.broadcastToGroup(
      groupId,
      SocketEvents.GROUP_MEMBER_UPDATED,
      {
        groupId,
        type: 'ownership_transferred',
        previousAdminId: currentAdminId,
        newAdminId,
      },
    );

    return { success: true };
  }

  async getMemberStats(groupId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });
    if (!group) throw new NotFoundException('Group not found');

    const [total, byRole] = await Promise.all([
      this.prisma.groupMember.count({ where: { groupId } }),
      this.prisma.groupMember.groupBy({
        by: ['role'],
        where: { groupId },
        _count: { id: true },
      }),
    ]);

    return { total, byRole };
  }
}
