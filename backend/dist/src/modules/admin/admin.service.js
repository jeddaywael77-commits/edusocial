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
var AdminService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const socket_gateway_1 = require("../socket/socket.gateway");
const socket_events_1 = require("../socket/socket.events");
let AdminService = AdminService_1 = class AdminService {
    prisma;
    socketGateway;
    logger = new common_1.Logger(AdminService_1.name);
    constructor(prisma, socketGateway) {
        this.prisma = prisma;
        this.socketGateway = socketGateway;
    }
    async getDashboardStats() {
        const [totalUsers, activeUsers, onlineUsers, totalPosts, totalGroups, totalCourses, totalComments, totalMedia, pendingPostReports, pendingCommentReports, newUsersToday, newPostsToday,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { isActive: true } }),
            this.prisma.user.count({ where: { isOnline: true } }),
            this.prisma.post.count({ where: { isDeleted: false } }),
            this.prisma.group.count(),
            this.prisma.course.count(),
            this.prisma.comment.count({ where: { isDeleted: false } }),
            this.prisma.media.count({ where: { isDeleted: false } }),
            this.prisma.postReport.count({ where: { status: 'pending' } }),
            this.prisma.commentReport.count({ where: { status: 'pending' } }),
            this.prisma.user.count({
                where: {
                    createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
                },
            }),
            this.prisma.post.count({
                where: {
                    isDeleted: false,
                    createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
                },
            }),
        ]);
        const usersByRole = await this.prisma.user.groupBy({
            by: ['role'],
            _count: { id: true },
        });
        return {
            users: {
                total: totalUsers,
                active: activeUsers,
                online: onlineUsers,
                newToday: newUsersToday,
                byRole: usersByRole,
            },
            content: {
                posts: totalPosts,
                comments: totalComments,
                groups: totalGroups,
                courses: totalCourses,
                media: totalMedia,
                newPostsToday,
            },
            reports: {
                pendingPostReports,
                pendingCommentReports,
                totalPending: pendingPostReports + pendingCommentReports,
            },
        };
    }
    async getUsers(query) {
        const page = query.page || 1;
        const limit = Math.min(query.limit || 20, 100);
        const skip = (page - 1) * limit;
        const where = {
            ...(query.search && {
                OR: [
                    { name: { contains: query.search, mode: 'insensitive' } },
                    { email: { contains: query.search, mode: 'insensitive' } },
                ],
            }),
            ...(query.role && { role: query.role }),
            ...(query.isActive !== undefined && { isActive: query.isActive }),
            ...(query.isOnline !== undefined && { isOnline: query.isOnline }),
        };
        const sortBy = query.sortBy || 'createdAt';
        const sortOrder = query.sortOrder || 'desc';
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    avatar: true,
                    role: true,
                    school: true,
                    department: true,
                    xp: true,
                    level: true,
                    coins: true,
                    isOnline: true,
                    isActive: true,
                    emailVerified: true,
                    createdAt: true,
                    lastSeen: true,
                    _count: {
                        select: {
                            posts: true,
                            comments: true,
                            groups: true,
                            coursesEnrolled: true,
                        },
                    },
                },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            data: users,
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
    async getUserById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
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
                isActive: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
                lastSeen: true,
                _count: {
                    select: {
                        posts: true,
                        comments: true,
                        reactions: true,
                        groups: true,
                        createdGroups: true,
                        coursesEnrolled: true,
                        taughtCourses: true,
                        documents: true,
                        media: true,
                    },
                },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async updateUserRole(id, dto, adminId) {
        if (id === adminId) {
            throw new common_1.ForbiddenException('Cannot change your own role');
        }
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const updated = await this.prisma.user.update({
            where: { id },
            data: { role: dto.role },
            select: { id: true, name: true, email: true, role: true },
        });
        await this.logAudit(adminId, 'UPDATE_ROLE', 'User', id, { oldRole: user.role }, { newRole: dto.role });
        this.socketGateway.broadcastToUser(id, socket_events_1.SocketEvents.NOTIFICATION_RECEIVED, {
            title: 'Role Updated',
            message: `Your role has been changed to ${dto.role}`,
        });
        this.logger.log(`User ${id} role changed from ${user.role} to ${dto.role} by ${adminId}`);
        return updated;
    }
    async toggleUserActive(id, isActive, adminId) {
        if (id === adminId) {
            throw new common_1.ForbiddenException('Cannot deactivate your own account');
        }
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const updated = await this.prisma.user.update({
            where: { id },
            data: { isActive },
            select: { id: true, name: true, email: true, isActive: true },
        });
        await this.logAudit(adminId, isActive ? 'ACTIVATE_USER' : 'DEACTIVATE_USER', 'User', id, { isActive: !isActive }, { isActive });
        this.logger.log(`User ${id} ${isActive ? 'activated' : 'deactivated'} by ${adminId}`);
        return updated;
    }
    async deleteUser(id, adminId) {
        if (id === adminId) {
            throw new common_1.ForbiddenException('Cannot delete your own account');
        }
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.logAudit(adminId, 'DELETE_USER', 'User', id, { name: user.name, email: user.email }, null);
        await this.prisma.user.delete({ where: { id } });
        this.logger.log(`User ${id} (${user.email}) deleted by ${adminId}`);
        return { success: true };
    }
    async getReports(query) {
        const page = query.page || 1;
        const limit = Math.min(query.limit || 20, 100);
        const skip = (page - 1) * limit;
        const type = query.type || 'post';
        const status = query.status || 'pending';
        const sortBy = query.sortBy || 'createdAt';
        const sortOrder = query.sortOrder || 'desc';
        if (type === 'post') {
            const where = { status };
            const [reports, total] = await Promise.all([
                this.prisma.postReport.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { [sortBy]: sortOrder },
                    include: {
                        user: { select: { id: true, name: true, avatar: true } },
                        post: {
                            select: {
                                id: true,
                                content: true,
                                type: true,
                                authorId: true,
                                isDeleted: true,
                                author: { select: { id: true, name: true, avatar: true } },
                            },
                        },
                    },
                }),
                this.prisma.postReport.count({ where }),
            ]);
            return {
                data: reports,
                type: 'post',
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
        const where = { status };
        const [reports, total] = await Promise.all([
            this.prisma.commentReport.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    user: { select: { id: true, name: true, avatar: true } },
                    comment: {
                        select: {
                            id: true,
                            content: true,
                            authorId: true,
                            postId: true,
                            isDeleted: true,
                            author: { select: { id: true, name: true, avatar: true } },
                        },
                    },
                },
            }),
            this.prisma.commentReport.count({ where }),
        ]);
        return {
            data: reports,
            type: 'comment',
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
    async resolvePostReport(reportId, dto, adminId) {
        const report = await this.prisma.postReport.findUnique({
            where: { id: reportId },
        });
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        const updated = await this.prisma.postReport.update({
            where: { id: reportId },
            data: { status: dto.status },
        });
        if (dto.status === 'resolved') {
            await this.prisma.post.update({
                where: { id: report.postId },
                data: { isReported: false, reportCount: { decrement: 1 } },
            });
        }
        await this.logAudit(adminId, 'RESOLVE_POST_REPORT', 'PostReport', reportId, { status: report.status }, { status: dto.status, note: dto.note });
        this.logger.log(`Post report ${reportId} resolved as ${dto.status} by ${adminId}`);
        return updated;
    }
    async resolveCommentReport(reportId, dto, adminId) {
        const report = await this.prisma.commentReport.findUnique({
            where: { id: reportId },
        });
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        const updated = await this.prisma.commentReport.update({
            where: { id: reportId },
            data: { status: dto.status },
        });
        await this.logAudit(adminId, 'RESOLVE_COMMENT_REPORT', 'CommentReport', reportId, { status: report.status }, { status: dto.status, note: dto.note });
        this.logger.log(`Comment report ${reportId} resolved as ${dto.status} by ${adminId}`);
        return updated;
    }
    async getAuditLogs(query) {
        const page = query.page || 1;
        const limit = Math.min(query.limit || 50, 200);
        const skip = (page - 1) * limit;
        const where = {
            ...(query.userId && { userId: query.userId }),
            ...(query.action && {
                action: { contains: query.action, mode: 'insensitive' },
            }),
            ...(query.entity && {
                entity: { contains: query.entity, mode: 'insensitive' },
            }),
        };
        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { id: true, name: true, avatar: true, email: true } },
                },
            }),
            this.prisma.auditLog.count({ where }),
        ]);
        return {
            data: logs,
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
    async logAudit(userId, action, entity, entityId, oldData, newData, ip, userAgent) {
        return this.prisma.auditLog.create({
            data: {
                userId,
                action,
                entity,
                entityId,
                oldData: oldData || undefined,
                newData: newData || undefined,
                ip,
                userAgent,
            },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = AdminService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        socket_gateway_1.SocketGateway])
], AdminService);
//# sourceMappingURL=admin.service.js.map