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
var ChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ChatService = ChatService_1 = class ChatService {
    prisma;
    logger = new common_1.Logger(ChatService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createConversation(userId, data) {
        const conversation = await this.prisma.conversation.create({
            data: {
                name: data.name,
                isGroup: data.isGroup ?? false,
                participants: {
                    create: [
                        { userId },
                        ...data.participantIds.map((id) => ({ userId: id })),
                    ],
                },
            },
            include: {
                participants: {
                    include: { user: { select: { id: true, name: true, avatar: true } } },
                },
            },
        });
        return conversation;
    }
    async getConversations(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const take = Math.min(limit, 50);
        const [conversations, total] = await Promise.all([
            this.prisma.conversation.findMany({
                where: { participants: { some: { userId } } },
                include: {
                    participants: {
                        include: {
                            user: {
                                select: { id: true, name: true, avatar: true, isOnline: true },
                            },
                        },
                    },
                    messages: { orderBy: { createdAt: 'desc' }, take: 1 },
                },
                orderBy: { updatedAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.conversation.count({
                where: { participants: { some: { userId } } },
            }),
        ]);
        return {
            data: conversations,
            meta: { total, page, limit: take, totalPages: Math.ceil(total / take) },
        };
    }
    async getMessages(conversationId, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        return this.prisma.message.findMany({
            where: { conversationId },
            include: { sender: { select: { id: true, name: true, avatar: true } } },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        });
    }
    async sendMessage(senderId, conversationId, data) {
        const message = await this.prisma.message.create({
            data: {
                content: data.content,
                type: data.type ?? 'text',
                fileUrl: data.fileUrl,
                fileName: data.fileName,
                conversationId,
                senderId,
            },
            include: { sender: { select: { id: true, name: true, avatar: true } } },
        });
        await this.prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
        });
        return message;
    }
    async markAsRead(conversationId, userId) {
        return this.prisma.message.updateMany({
            where: { conversationId, senderId: { not: userId }, isRead: false },
            data: { isRead: true },
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map