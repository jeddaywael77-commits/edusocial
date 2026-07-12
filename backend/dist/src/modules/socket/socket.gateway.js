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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const common_2 = require("@nestjs/common");
const socket_service_1 = require("./socket.service");
const ws_jwt_guard_1 = require("./ws-jwt.guard");
const ws_current_user_decorator_1 = require("./ws-current-user.decorator");
const socket_events_1 = require("./socket.events");
const chat_service_1 = require("../chat/chat.service");
let SocketGateway = SocketGateway_1 = class SocketGateway {
    socketService;
    chatService;
    server;
    logger = new common_1.Logger(SocketGateway_1.name);
    constructor(socketService, chatService) {
        this.socketService = socketService;
        this.chatService = chatService;
    }
    afterInit() {
        this.socketService.setServer(this.server);
        this.logger.log('WebSocket Gateway initialized');
    }
    async handleConnection(client) {
        const wsData = client.data;
        const user = wsData?.user;
        if (!user?.sub) {
            client.disconnect();
            return;
        }
        const userId = user.sub;
        this.socketService.registerSocket(client.id, userId);
        await this.socketService.markUserOnline(userId);
        void this.socketService.addSocketToConversationRooms(client.id, userId);
        void this.socketService.addSocketToGroupRooms(client.id, userId);
        void this.socketService.addSocketToCourseRooms(client.id, userId);
        this.server.emit(socket_events_1.SocketEvents.PRESENCE_ONLINE, { userId });
        this.logger.log(`Client connected: ${client.id} (user: ${userId})`);
    }
    async handleDisconnect(client) {
        const userId = this.socketService.unregisterSocket(client.id);
        if (userId && !this.socketService.isUserOnline(userId)) {
            await this.socketService.markUserOffline(userId);
            this.server.emit(socket_events_1.SocketEvents.PRESENCE_OFFLINE, { userId });
        }
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleJoinRoom(client, data) {
        this.socketService.joinRoom(client.id, data.room);
    }
    handleLeaveRoom(client, data) {
        this.socketService.leaveRoom(client.id, data.room);
    }
    async handleChatMessage(client, userId, data) {
        const message = await this.chatService.sendMessage(userId, data.conversationId, {
            content: data.content,
            type: data.type,
            fileUrl: data.fileUrl,
            fileName: data.fileName,
        });
        this.server
            .to(`conversation:${data.conversationId}`)
            .emit(socket_events_1.SocketEvents.CHAT_RECEIVE_MESSAGE, message);
    }
    handleTyping(client, userId, data) {
        client
            .to(`conversation:${data.conversationId}`)
            .emit(socket_events_1.SocketEvents.CHAT_TYPING, {
            conversationId: data.conversationId,
            userId,
            userName: data.userName,
        });
    }
    handleStopTyping(client, userId, data) {
        client
            .to(`conversation:${data.conversationId}`)
            .emit(socket_events_1.SocketEvents.CHAT_STOP_TYPING, {
            conversationId: data.conversationId,
            userId,
        });
    }
    async handleMarkRead(client, userId, data) {
        await this.chatService.markAsRead(data.conversationId, userId);
        client
            .to(`conversation:${data.conversationId}`)
            .emit(socket_events_1.SocketEvents.CHAT_READ_RECEIPT, {
            conversationId: data.conversationId,
            userId,
            readAt: new Date().toISOString(),
        });
    }
    handlePresenceTrack(client, userId, data) {
        const isOnline = this.socketService.isUserOnline(data.targetUserId);
        client.emit(socket_events_1.SocketEvents.PRESENCE_ONLINE, {
            userId: data.targetUserId,
            isOnline,
        });
    }
    broadcastToUser(userId, event, data) {
        this.socketService.emitToUser(userId, event, data);
    }
    broadcastToRoom(room, event, data) {
        this.server.to(room).emit(event, data);
    }
    broadcastToGroup(groupId, event, data) {
        this.server.to(`group:${groupId}`).emit(event, data);
    }
    broadcastToAll(event, data) {
        this.server.emit(event, data);
    }
};
exports.SocketGateway = SocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SocketGateway.prototype, "server", void 0);
__decorate([
    (0, common_2.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "handleConnection", null);
__decorate([
    (0, common_2.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)(socket_events_1.SocketEvents.JOIN_ROOM),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, common_2.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)(socket_events_1.SocketEvents.LEAVE_ROOM),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, common_2.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)(socket_events_1.SocketEvents.CHAT_SEND_MESSAGE),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, ws_current_user_decorator_1.WsCurrentUser)('sub')),
    __param(2, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String, Object]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "handleChatMessage", null);
__decorate([
    (0, common_2.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)(socket_events_1.SocketEvents.CHAT_TYPING),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, ws_current_user_decorator_1.WsCurrentUser)('sub')),
    __param(2, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String, Object]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleTyping", null);
__decorate([
    (0, common_2.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)(socket_events_1.SocketEvents.CHAT_STOP_TYPING),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, ws_current_user_decorator_1.WsCurrentUser)('sub')),
    __param(2, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String, Object]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleStopTyping", null);
__decorate([
    (0, common_2.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)(socket_events_1.SocketEvents.MARK_READ),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, ws_current_user_decorator_1.WsCurrentUser)('sub')),
    __param(2, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String, Object]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "handleMarkRead", null);
__decorate([
    (0, common_2.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)(socket_events_1.SocketEvents.PRESENCE_TRACK),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, ws_current_user_decorator_1.WsCurrentUser)('sub')),
    __param(2, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String, Object]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handlePresenceTrack", null);
exports.SocketGateway = SocketGateway = SocketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
            credentials: true,
        },
        transports: ['websocket', 'polling'],
        namespace: '/',
    }),
    __metadata("design:paramtypes", [socket_service_1.SocketService,
        chat_service_1.ChatService])
], SocketGateway);
//# sourceMappingURL=socket.gateway.js.map