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
var GroupMembersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMembersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const socket_gateway_1 = require("../socket/socket.gateway");
const socket_events_1 = require("../socket/socket.events");
let GroupMembersService = GroupMembersService_1 = class GroupMembersService {
    prisma;
    socketGateway;
    logger = new common_1.Logger(GroupMembersService_1.name);
    constructor(prisma, socketGateway) {
        this.prisma = prisma;
        this.socketGateway = socketGateway;
    }
    async getMembers(groupId, query) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
        });
        if (!group)
            throw new common_1.NotFoundException('Group not found');
        const page = query.page || 1;
        const limit = Math.min(query.limit || 20, 100);
        const skip = (page - 1) * limit;
        const where = {
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
    async getMember(groupId, userId) {
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
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        return member;
    }
    async updateMemberRole(groupId, userId, newRole, requesterId) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
        });
        if (!group)
            throw new common_1.NotFoundException('Group not found');
        const requester = await this.prisma.groupMember.findUnique({
            where: { groupId_userId: { groupId, userId: requesterId } },
        });
        if (!requester ||
            (requester.role !== 'admin' && requester.role !== 'moderator')) {
            throw new common_1.ForbiddenException('Only group admin or moderator can change roles');
        }
        if (userId === requesterId && newRole !== 'admin') {
            throw new common_1.ForbiddenException('Cannot demote yourself');
        }
        const target = await this.prisma.groupMember.findUnique({
            where: { groupId_userId: { groupId, userId } },
        });
        if (!target)
            throw new common_1.NotFoundException('Member not found');
        if (target.role === 'admin' && requester.role !== 'admin') {
            throw new common_1.ForbiddenException('Only the group admin can change the admin role');
        }
        const updated = await this.prisma.groupMember.update({
            where: { groupId_userId: { groupId, userId } },
            data: { role: newRole },
            include: {
                user: { select: { id: true, name: true, avatar: true } },
            },
        });
        this.logger.log(`Member ${userId} role changed to ${newRole} in group ${groupId}`);
        this.socketGateway.broadcastToGroup(groupId, socket_events_1.SocketEvents.GROUP_MEMBER_UPDATED, {
            groupId,
            userId,
            role: newRole,
        });
        return updated;
    }
    async removeMember(groupId, userId, requesterId) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
        });
        if (!group)
            throw new common_1.NotFoundException('Group not found');
        if (userId === group.adminId) {
            throw new common_1.ForbiddenException('Cannot remove the group admin');
        }
        if (userId === requesterId) {
            throw new common_1.ForbiddenException('Use the leave endpoint to leave a group');
        }
        const requester = await this.prisma.groupMember.findUnique({
            where: { groupId_userId: { groupId, userId: requesterId } },
        });
        if (!requester ||
            (requester.role !== 'admin' && requester.role !== 'moderator')) {
            throw new common_1.ForbiddenException('Only group admin or moderator can remove members');
        }
        const target = await this.prisma.groupMember.findUnique({
            where: { groupId_userId: { groupId, userId } },
        });
        if (!target)
            throw new common_1.NotFoundException('Member not found');
        await this.prisma.groupMember.delete({
            where: { groupId_userId: { groupId, userId } },
        });
        this.logger.log(`Member ${userId} removed from group ${groupId} by ${requesterId}`);
        this.socketGateway.broadcastToGroup(groupId, socket_events_1.SocketEvents.GROUP_MEMBER_REMOVED, {
            groupId,
            userId,
        });
        this.socketGateway.broadcastToUser(userId, socket_events_1.SocketEvents.NOTIFICATION_RECEIVED, {
            title: 'Removed from Group',
            message: `You have been removed from ${group.name}`,
        });
        return { success: true };
    }
    async transferOwnership(groupId, newAdminId, currentAdminId) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
        });
        if (!group)
            throw new common_1.NotFoundException('Group not found');
        if (group.adminId !== currentAdminId) {
            throw new common_1.ForbiddenException('Only the group admin can transfer ownership');
        }
        if (newAdminId === currentAdminId) {
            throw new common_1.ForbiddenException('Cannot transfer ownership to yourself');
        }
        const newAdminMember = await this.prisma.groupMember.findUnique({
            where: { groupId_userId: { groupId, userId: newAdminId } },
        });
        if (!newAdminMember) {
            throw new common_1.NotFoundException('New admin must be a member of the group');
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
        this.logger.log(`Group ${groupId} ownership transferred from ${currentAdminId} to ${newAdminId}`);
        this.socketGateway.broadcastToGroup(groupId, socket_events_1.SocketEvents.GROUP_MEMBER_UPDATED, {
            groupId,
            type: 'ownership_transferred',
            previousAdminId: currentAdminId,
            newAdminId,
        });
        return { success: true };
    }
    async getMemberStats(groupId) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
        });
        if (!group)
            throw new common_1.NotFoundException('Group not found');
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
};
exports.GroupMembersService = GroupMembersService;
exports.GroupMembersService = GroupMembersService = GroupMembersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        socket_gateway_1.SocketGateway])
], GroupMembersService);
//# sourceMappingURL=group-members.service.js.map