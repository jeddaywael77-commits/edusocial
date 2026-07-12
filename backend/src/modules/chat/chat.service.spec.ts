import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { PrismaService } from '../../database/prisma.service';

describe('ChatService', () => {
  let service: ChatService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      conversation: {
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      message: {
        findMany: jest.fn(),
        create: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ChatService);
  });

  describe('getConversations', () => {
    it('should return paginated conversations', async () => {
      prisma.conversation.findMany.mockResolvedValue([
        { id: 'c1', participants: [], messages: [] },
      ]);
      prisma.conversation.count.mockResolvedValue(1);

      const result = await service.getConversations('user-1', 1, 20);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
    });
  });

  describe('getMessages', () => {
    it('should return paginated messages', async () => {
      prisma.message.findMany.mockResolvedValue([
        { id: 'm1', content: 'Hello' },
      ]);

      const result = await service.getMessages('conv-1', 1, 50);

      expect(result).toHaveLength(1);
      expect(prisma.message.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 50 }),
      );
    });
  });

  describe('sendMessage', () => {
    it('should create message and update conversation timestamp', async () => {
      prisma.message.create.mockResolvedValue({
        id: 'm1', content: 'Hi', sender: { id: 'u1', name: 'Test', avatar: null },
      });
      prisma.conversation.update.mockResolvedValue({});

      const result = await service.sendMessage('user-1', 'conv-1', { content: 'Hi' });

      expect(result.content).toBe('Hi');
      expect(prisma.conversation.update).toHaveBeenCalled();
    });
  });

  describe('markAsRead', () => {
    it('should mark unread messages as read', async () => {
      prisma.message.updateMany.mockResolvedValue({ count: 3 });

      await service.markAsRead('conv-1', 'user-1');

      expect(prisma.message.updateMany).toHaveBeenCalledWith({
        where: {
          conversationId: 'conv-1',
          senderId: { not: 'user-1' },
          isRead: false,
        },
        data: { isRead: true },
      });
    });
  });
});
