import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../../database/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
import { SocketEvents } from '../socket/socket.events';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: any;
  let socketGateway: any;

  const mockNotification = {
    id: 'n1',
    type: 'LIKE',
    title: 'Test',
    message: 'Test notification',
    link: null,
    userId: 'user-1',
    senderId: 'user-2',
    isRead: false,
    createdAt: new Date(),
    sender: { id: 'user-2', name: 'Sender', avatar: null, level: 1 },
  };

  beforeEach(async () => {
    prisma = {
      notification: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };

    socketGateway = {
      broadcastToUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: prisma },
        { provide: SocketGateway, useValue: socketGateway },
      ],
    }).compile();

    service = module.get(NotificationsService);
  });

  describe('create', () => {
    it('should create notification and broadcast events', async () => {
      prisma.notification.create.mockResolvedValue(mockNotification);
      prisma.notification.count.mockResolvedValue(1);

      const result = await service.create('user-1', {
        type: 'LIKE',
        title: 'Test',
        message: 'Test notification',
        senderId: 'user-2',
      });

      expect(result).toEqual(mockNotification);
      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: {
          type: 'LIKE',
          title: 'Test',
          message: 'Test notification',
          link: undefined,
          userId: 'user-1',
          senderId: 'user-2',
        },
        include: {
          sender: {
            select: { id: true, name: true, avatar: true, level: true },
          },
        },
      });
      expect(socketGateway.broadcastToUser).toHaveBeenCalledWith(
        'user-1',
        SocketEvents.NOTIFICATION_NEW,
        mockNotification,
      );
      expect(socketGateway.broadcastToUser).toHaveBeenCalledWith(
        'user-1',
        SocketEvents.NOTIFICATION_UNREAD_COUNT,
        { count: 1 },
      );
    });

    it('should create notification with link', async () => {
      prisma.notification.create.mockResolvedValue({
        ...mockNotification,
        link: '/posts/p1',
      });
      prisma.notification.count.mockResolvedValue(1);

      await service.create('user-1', {
        type: 'COMMENT',
        title: 'Comment',
        message: 'Someone commented',
        link: '/posts/p1',
      });

      expect(prisma.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ link: '/posts/p1' }),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return recent notifications for user', async () => {
      const notifications = [mockNotification];
      prisma.notification.findMany.mockResolvedValue(notifications);

      const result = await service.findAll('user-1');

      expect(result).toEqual(notifications);
      expect(prisma.notification.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    });

    it('should return empty array when no notifications', async () => {
      prisma.notification.findMany.mockResolvedValue([]);

      const result = await service.findAll('user-99');

      expect(result).toEqual([]);
    });
  });

  describe('findUnread', () => {
    it('should return only unread notifications', async () => {
      const unread = [{ ...mockNotification, isRead: false }];
      prisma.notification.findMany.mockResolvedValue(unread);

      const result = await service.findUnread('user-1');

      expect(result).toEqual(unread);
      expect(prisma.notification.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', isRead: false },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count', async () => {
      prisma.notification.count.mockResolvedValue(5);

      const result = await service.getUnreadCount('user-1');

      expect(result).toBe(5);
      expect(prisma.notification.count).toHaveBeenCalledWith({
        where: { userId: 'user-1', isRead: false },
      });
    });

    it('should return 0 when no unread notifications', async () => {
      prisma.notification.count.mockResolvedValue(0);

      const result = await service.getUnreadCount('user-1');

      expect(result).toBe(0);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read and broadcast count', async () => {
      prisma.notification.findUnique.mockResolvedValue(mockNotification);
      prisma.notification.update.mockResolvedValue({
        ...mockNotification,
        isRead: true,
      });
      prisma.notification.count.mockResolvedValue(0);

      const result = await service.markAsRead('n1', 'user-1');

      expect(result.isRead).toBe(true);
      expect(prisma.notification.update).toHaveBeenCalledWith({
        where: { id: 'n1' },
        data: { isRead: true },
      });
      expect(socketGateway.broadcastToUser).toHaveBeenCalledWith(
        'user-1',
        SocketEvents.NOTIFICATION_UNREAD_COUNT,
        { count: 0 },
      );
    });

    it('should throw if notification not found', async () => {
      prisma.notification.findUnique.mockResolvedValue(null);

      await expect(service.markAsRead('n99', 'user-1')).rejects.toThrow(
        'Not authorized',
      );
    });

    it('should throw if notification belongs to another user', async () => {
      prisma.notification.findUnique.mockResolvedValue({
        ...mockNotification,
        userId: 'user-2',
      });

      await expect(service.markAsRead('n1', 'user-1')).rejects.toThrow(
        'Not authorized',
      );
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all unread notifications as read', async () => {
      prisma.notification.updateMany.mockResolvedValue({ count: 3 });

      const result = await service.markAllAsRead('user-1');

      expect(result.count).toBe(3);
      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', isRead: false },
        data: { isRead: true },
      });
      expect(socketGateway.broadcastToUser).toHaveBeenCalledWith(
        'user-1',
        SocketEvents.NOTIFICATION_UNREAD_COUNT,
        { count: 0 },
      );
    });
  });

  describe('delete', () => {
    it('should delete notification owned by user', async () => {
      prisma.notification.findUnique.mockResolvedValue(mockNotification);
      prisma.notification.delete.mockResolvedValue(mockNotification);

      const result = await service.delete('n1', 'user-1');

      expect(result).toEqual(mockNotification);
      expect(prisma.notification.delete).toHaveBeenCalledWith({
        where: { id: 'n1' },
      });
    });

    it('should throw if notification not found', async () => {
      prisma.notification.findUnique.mockResolvedValue(null);

      await expect(service.delete('n99', 'user-1')).rejects.toThrow(
        'Not authorized',
      );
    });

    it('should throw if notification belongs to another user', async () => {
      prisma.notification.findUnique.mockResolvedValue({
        ...mockNotification,
        userId: 'user-2',
      });

      await expect(service.delete('n1', 'user-1')).rejects.toThrow(
        'Not authorized',
      );
    });
  });
});
