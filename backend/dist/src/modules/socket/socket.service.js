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
var SocketService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const ioredis_1 = require("ioredis");
const prisma_service_1 = require("../../database/prisma.service");
let SocketService = SocketService_1 = class SocketService {
    configService;
    prisma;
    logger = new common_1.Logger(SocketService_1.name);
    server;
    pubClient;
    subClient;
    userSockets = new Map();
    socketUsers = new Map();
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
    }
    onModuleInit() {
        const host = this.configService.get('redis.host') || 'localhost';
        const port = this.configService.get('redis.port') || 6379;
        this.pubClient = new ioredis_1.Redis({ host, port, maxRetriesPerRequest: null });
        this.subClient = this.pubClient.duplicate();
        this.pubClient.on('error', (err) => this.logger.error('Redis pub error:', err.message));
        this.subClient.on('error', (err) => this.logger.error('Redis sub error:', err.message));
        this.pubClient.on('connect', () => this.logger.log('Redis pub connected'));
        this.subClient.on('connect', () => this.logger.log('Redis sub connected'));
    }
    createRedisAdapter() {
        return (0, redis_adapter_1.createAdapter)(this.pubClient, this.subClient);
    }
    setServer(server) {
        this.server = server;
    }
    getServer() {
        return this.server;
    }
    registerSocket(socketId, userId) {
        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
        }
        this.userSockets.get(userId).add(socketId);
        this.socketUsers.set(socketId, userId);
    }
    unregisterSocket(socketId) {
        const userId = this.socketUsers.get(socketId);
        if (userId) {
            const sockets = this.userSockets.get(userId);
            if (sockets) {
                sockets.delete(socketId);
                if (sockets.size === 0) {
                    this.userSockets.delete(userId);
                }
            }
            this.socketUsers.delete(socketId);
        }
        return userId;
    }
    getUserId(socketId) {
        return this.socketUsers.get(socketId);
    }
    getUserSocketIds(userId) {
        return Array.from(this.userSockets.get(userId) || []);
    }
    isUserOnline(userId) {
        const sockets = this.userSockets.get(userId);
        return !!sockets && sockets.size > 0;
    }
    getOnlineUserIds() {
        return Array.from(this.userSockets.keys());
    }
    async markUserOnline(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { isOnline: true, lastSeen: new Date() },
        });
    }
    async markUserOffline(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { isOnline: false, lastSeen: new Date() },
        });
    }
    emitToUser(userId, event, data) {
        const socketIds = this.getUserSocketIds(userId);
        for (const socketId of socketIds) {
            const socket = this.server?.sockets?.sockets?.get(socketId);
            if (socket) {
                socket.emit(event, data);
            }
        }
    }
    emitToRoom(room, event, data) {
        this.server?.to(room).emit(event, data);
    }
    broadcastToAll(event, data) {
        this.server?.emit(event, data);
    }
    async addSocketToConversationRooms(socketId, userId) {
        const conversations = await this.prisma.conversationParticipant.findMany({
            where: { userId },
            select: { conversationId: true },
        });
        const socket = this.server?.sockets?.sockets?.get(socketId);
        if (socket) {
            for (const { conversationId } of conversations) {
                void socket.join(`conversation:${conversationId}`);
            }
        }
    }
    async addSocketToGroupRooms(socketId, userId) {
        const memberships = await this.prisma.groupMember.findMany({
            where: { userId },
            select: { groupId: true },
        });
        const socket = this.server?.sockets?.sockets?.get(socketId);
        if (socket) {
            for (const { groupId } of memberships) {
                void socket.join(`group:${groupId}`);
            }
        }
    }
    async addSocketToCourseRooms(socketId, userId) {
        const enrollments = await this.prisma.enrollment.findMany({
            where: { userId },
            select: { courseId: true },
        });
        const socket = this.server?.sockets?.sockets?.get(socketId);
        if (socket) {
            for (const { courseId } of enrollments) {
                void socket.join(`course:${courseId}`);
            }
        }
    }
    joinRoom(socketId, room) {
        const socket = this.server?.sockets?.sockets?.get(socketId);
        if (socket) {
            void socket.join(room);
        }
    }
    leaveRoom(socketId, room) {
        const socket = this.server?.sockets?.sockets?.get(socketId);
        if (socket) {
            void socket.leave(room);
        }
    }
    async cleanup() {
        await this.pubClient?.quit();
        await this.subClient?.quit();
    }
};
exports.SocketService = SocketService;
exports.SocketService = SocketService = SocketService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], SocketService);
//# sourceMappingURL=socket.service.js.map