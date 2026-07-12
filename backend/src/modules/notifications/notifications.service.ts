import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
import { SocketEvents } from '../socket/socket.events';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  constructor(
    private prisma: PrismaService,
    private socketGateway: SocketGateway,
  ) {}

  async create(userId: string, data: { type: string; title: string; message: string; link?: string; senderId?: string }) {
    const notification = await this.prisma.notification.create({
      data: {
        type: data.type as any,
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

    this.socketGateway.broadcastToUser(userId, SocketEvents.NOTIFICATION_NEW, notification);

    const unreadCount = await this.getUnreadCount(userId);
    this.socketGateway.broadcastToUser(userId, SocketEvents.NOTIFICATION_UNREAD_COUNT, { count: unreadCount });

    return notification;
  }

  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async findUnread(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({ where: { userId, isRead: false } });
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== userId) throw new Error('Not authorized');
    const updated = await this.prisma.notification.update({ where: { id }, data: { isRead: true } });

    const unreadCount = await this.getUnreadCount(userId);
    this.socketGateway.broadcastToUser(userId, SocketEvents.NOTIFICATION_UNREAD_COUNT, { count: unreadCount });

    return updated;
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    this.socketGateway.broadcastToUser(userId, SocketEvents.NOTIFICATION_UNREAD_COUNT, { count: 0 });

    return result;
  }

  async delete(id: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== userId) throw new Error('Not authorized');
    return this.prisma.notification.delete({ where: { id } });
  }
}
