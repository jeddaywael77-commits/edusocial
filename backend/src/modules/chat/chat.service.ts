import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  constructor(private prisma: PrismaService) {}

  async createConversation(
    userId: string,
    data: { name?: string; participantIds: string[]; isGroup?: boolean },
  ) {
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

  async getConversations(userId: string, page = 1, limit = 20) {
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

  async getMessages(conversationId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    return this.prisma.message.findMany({
      where: { conversationId },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
  }

  async sendMessage(
    senderId: string,
    conversationId: string,
    data: {
      content: string;
      type?: string;
      fileUrl?: string;
      fileName?: string;
    },
  ) {
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

  async markAsRead(conversationId: string, userId: string) {
    return this.prisma.message.updateMany({
      where: { conversationId, senderId: { not: userId }, isRead: false },
      data: { isRead: true },
    });
  }
}
