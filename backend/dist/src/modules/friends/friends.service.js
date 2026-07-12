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
var FriendsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const socket_gateway_1 = require("../socket/socket.gateway");
const socket_events_1 = require("../socket/socket.events");
let FriendsService = FriendsService_1 = class FriendsService {
    prisma;
    socketGateway;
    logger = new common_1.Logger(FriendsService_1.name);
    constructor(prisma, socketGateway) {
        this.prisma = prisma;
        this.socketGateway = socketGateway;
    }
    async sendRequest(senderId, receiverId) {
        const request = await this.prisma.friendRequest.create({
            data: { senderId, receiverId },
            include: {
                sender: { select: { id: true, name: true, avatar: true } },
                receiver: { select: { id: true, name: true, avatar: true } },
            },
        });
        this.socketGateway.broadcastToUser(receiverId, socket_events_1.SocketEvents.FRIEND_REQUEST_SENT, request);
        return request;
    }
    async getRequests(userId) {
        return this.prisma.friendRequest.findMany({
            where: { receiverId: userId, status: 'PENDING' },
            include: {
                sender: { select: { id: true, name: true, avatar: true, role: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async acceptRequest(requestId, userId) {
        const request = await this.prisma.friendRequest.findUnique({
            where: { id: requestId },
        });
        if (!request || request.receiverId !== userId)
            throw new Error('Not authorized');
        if (request.status !== 'PENDING')
            throw new Error('Request already handled');
        await this.prisma.friendRequest.update({
            where: { id: requestId },
            data: { status: 'ACCEPTED' },
        });
        await this.prisma.friendship.create({
            data: { userId: request.senderId, friendId: request.receiverId },
        });
        this.socketGateway.broadcastToUser(request.senderId, socket_events_1.SocketEvents.FRIEND_REQUEST_ACCEPTED, { requestId, userId });
        return { success: true };
    }
    async declineRequest(requestId, userId) {
        const request = await this.prisma.friendRequest.findUnique({
            where: { id: requestId },
        });
        if (!request || request.receiverId !== userId)
            throw new Error('Not authorized');
        const updated = await this.prisma.friendRequest.update({
            where: { id: requestId },
            data: { status: 'DECLINED' },
        });
        this.socketGateway.broadcastToUser(request.senderId, socket_events_1.SocketEvents.FRIEND_REQUEST_DECLINED, { requestId });
        return updated;
    }
    async getFriends(userId) {
        const friendships = await this.prisma.friendship.findMany({
            where: { OR: [{ userId }, { friendId: userId }] },
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
                friend: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        isOnline: true,
                        role: true,
                    },
                },
            },
        });
        return friendships.map((f) => (f.userId === userId ? f.friend : f.user));
    }
    async removeFriend(userId, friendId) {
        const result = await this.prisma.friendship.deleteMany({
            where: {
                OR: [
                    { userId, friendId },
                    { userId: friendId, friendId: userId },
                ],
            },
        });
        this.socketGateway.broadcastToUser(friendId, socket_events_1.SocketEvents.FRIEND_REMOVED, {
            userId,
        });
        return result;
    }
};
exports.FriendsService = FriendsService;
exports.FriendsService = FriendsService = FriendsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        socket_gateway_1.SocketGateway])
], FriendsService);
//# sourceMappingURL=friends.service.js.map