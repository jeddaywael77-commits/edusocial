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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const socket_gateway_1 = require("../socket/socket.gateway");
const socket_events_1 = require("../socket/socket.events");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    prisma;
    socketGateway;
    logger = new common_1.Logger(NotificationsService_1.name);
    constructor(prisma, socketGateway) {
        this.prisma = prisma;
        this.socketGateway = socketGateway;
    }
    async create(userId, data) {
        const notification = await this.prisma.notification.create({
            data: {
                type: data.type,
                title: data.title,
                message: data.message,
                link: data.link,
                userId,
                senderId: data.senderId,
            },
            include: {
                sender: { select: { id: true, name: true, avatar: true, level: true } },
            },
        });
        this.socketGateway.broadcastToUser(userId, socket_events_1.SocketEvents.NOTIFICATION_NEW, notification);
        const unreadCount = await this.getUnreadCount(userId);
        this.socketGateway.broadcastToUser(userId, socket_events_1.SocketEvents.NOTIFICATION_UNREAD_COUNT, { count: unreadCount });
        return notification;
    }
    async findAll(userId) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async findUnread(userId) {
        return this.prisma.notification.findMany({
            where: { userId, isRead: false },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getUnreadCount(userId) {
        return this.prisma.notification.count({ where: { userId, isRead: false } });
    }
    async markAsRead(id, userId) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification || notification.userId !== userId)
            throw new Error('Not authorized');
        const updated = await this.prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
        const unreadCount = await this.getUnreadCount(userId);
        this.socketGateway.broadcastToUser(userId, socket_events_1.SocketEvents.NOTIFICATION_UNREAD_COUNT, { count: unreadCount });
        return updated;
    }
    async markAllAsRead(userId) {
        const result = await this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
        this.socketGateway.broadcastToUser(userId, socket_events_1.SocketEvents.NOTIFICATION_UNREAD_COUNT, { count: 0 });
        return result;
    }
    async delete(id, userId) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification || notification.userId !== userId)
            throw new Error('Not authorized');
        return this.prisma.notification.delete({ where: { id } });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        socket_gateway_1.SocketGateway])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map