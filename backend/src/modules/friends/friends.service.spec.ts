import { Test, TestingModule } from '@nestjs/testing';
import { FriendsService } from './friends.service';
import { PrismaService } from '../../database/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
import { SocketEvents } from '../socket/socket.events';

describe('FriendsService', () => {
  let service: FriendsService;

  const mockPrisma = {
    friendRequest: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    friendship: {
      findMany: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mockSocketGateway = {
    broadcastToUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: SocketGateway, useValue: mockSocketGateway },
      ],
    }).compile();

    service = module.get<FriendsService>(FriendsService);
    jest.clearAllMocks();
  });

  describe('sendRequest', () => {
    it('should create and broadcast a friend request', async () => {
      const senderId = 'sender-1';
      const receiverId = 'receiver-1';
      const mockRequest = {
        id: 'req-1',
        senderId,
        receiverId,
        status: 'PENDING',
        sender: { id: senderId, name: 'Alice', avatar: null },
        receiver: { id: receiverId, name: 'Bob', avatar: null },
      };

      mockPrisma.friendRequest.create.mockResolvedValue(mockRequest);

      const result = await service.sendRequest(senderId, receiverId);

      expect(mockPrisma.friendRequest.create).toHaveBeenCalledWith({
        data: { senderId, receiverId },
        include: {
          sender: { select: { id: true, name: true, avatar: true } },
          receiver: { select: { id: true, name: true, avatar: true } },
        },
      });
      expect(mockSocketGateway.broadcastToUser).toHaveBeenCalledWith(
        receiverId,
        SocketEvents.FRIEND_REQUEST_SENT,
        mockRequest,
      );
      expect(result).toEqual(mockRequest);
    });

    it('should throw on self-request', async () => {
      mockPrisma.friendRequest.create.mockRejectedValue(
        new Error('Unique constraint failed'),
      );

      await expect(service.sendRequest('user-1', 'user-1')).rejects.toThrow(
        'Unique constraint failed',
      );
    });
  });

  describe('getRequests', () => {
    it('should return pending requests for the user', async () => {
      const userId = 'user-1';
      const mockRequests = [
        {
          id: 'req-1',
          senderId: 'sender-1',
          receiverId: userId,
          status: 'PENDING',
          sender: {
            id: 'sender-1',
            name: 'Alice',
            avatar: null,
            role: 'STUDENT',
          },
        },
      ];

      mockPrisma.friendRequest.findMany.mockResolvedValue(mockRequests);

      const result = await service.getRequests(userId);

      expect(mockPrisma.friendRequest.findMany).toHaveBeenCalledWith({
        where: { receiverId: userId, status: 'PENDING' },
        include: {
          sender: {
            select: { id: true, name: true, avatar: true, role: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockRequests);
    });
  });

  describe('acceptRequest', () => {
    const requestId = 'req-1';
    const userId = 'receiver-1';

    it('should accept a pending request and create friendship', async () => {
      const mockRequest = {
        id: requestId,
        senderId: 'sender-1',
        receiverId: userId,
        status: 'PENDING',
      };

      mockPrisma.friendRequest.findUnique.mockResolvedValue(mockRequest);
      mockPrisma.friendRequest.update.mockResolvedValue({
        ...mockRequest,
        status: 'ACCEPTED',
      });
      mockPrisma.friendship.create.mockResolvedValue({});

      const result = await service.acceptRequest(requestId, userId);

      expect(mockPrisma.friendRequest.update).toHaveBeenCalledWith({
        where: { id: requestId },
        data: { status: 'ACCEPTED' },
      });
      expect(mockPrisma.friendship.create).toHaveBeenCalledWith({
        data: { userId: 'sender-1', friendId: userId },
      });
      expect(mockSocketGateway.broadcastToUser).toHaveBeenCalledWith(
        'sender-1',
        SocketEvents.FRIEND_REQUEST_ACCEPTED,
        { requestId, userId },
      );
      expect(result).toEqual({ success: true });
    });

    it('should throw if not authorized', async () => {
      mockPrisma.friendRequest.findUnique.mockResolvedValue({
        id: requestId,
        senderId: 'sender-1',
        receiverId: 'other-user',
        status: 'PENDING',
      });

      await expect(service.acceptRequest(requestId, userId)).rejects.toThrow(
        'Not authorized',
      );
    });

    it('should throw if request already handled', async () => {
      mockPrisma.friendRequest.findUnique.mockResolvedValue({
        id: requestId,
        senderId: 'sender-1',
        receiverId: userId,
        status: 'ACCEPTED',
      });

      await expect(service.acceptRequest(requestId, userId)).rejects.toThrow(
        'Request already handled',
      );
    });
  });

  describe('declineRequest', () => {
    const requestId = 'req-1';
    const userId = 'receiver-1';

    it('should decline a pending request', async () => {
      const mockRequest = {
        id: requestId,
        senderId: 'sender-1',
        receiverId: userId,
        status: 'PENDING',
      };
      const mockUpdated = { ...mockRequest, status: 'DECLINED' };

      mockPrisma.friendRequest.findUnique.mockResolvedValue(mockRequest);
      mockPrisma.friendRequest.update.mockResolvedValue(mockUpdated);

      const result = await service.declineRequest(requestId, userId);

      expect(mockPrisma.friendRequest.update).toHaveBeenCalledWith({
        where: { id: requestId },
        data: { status: 'DECLINED' },
      });
      expect(mockSocketGateway.broadcastToUser).toHaveBeenCalledWith(
        'sender-1',
        SocketEvents.FRIEND_REQUEST_DECLINED,
        { requestId },
      );
      expect(result).toEqual(mockUpdated);
    });

    it('should throw if not authorized', async () => {
      mockPrisma.friendRequest.findUnique.mockResolvedValue({
        id: requestId,
        senderId: 'sender-1',
        receiverId: 'other-user',
        status: 'PENDING',
      });

      await expect(service.declineRequest(requestId, userId)).rejects.toThrow(
        'Not authorized',
      );
    });
  });

  describe('getFriends', () => {
    it('should return the friend list mapped to the other user', async () => {
      const userId = 'user-1';
      const mockFriendships = [
        {
          userId: 'user-1',
          friendId: 'user-2',
          user: {
            id: 'user-1',
            name: 'Alice',
            avatar: null,
            isOnline: true,
            role: 'STUDENT',
          },
          friend: {
            id: 'user-2',
            name: 'Bob',
            avatar: null,
            isOnline: false,
            role: 'TEACHER',
          },
        },
        {
          userId: 'user-3',
          friendId: 'user-1',
          user: {
            id: 'user-3',
            name: 'Charlie',
            avatar: null,
            isOnline: true,
            role: 'STUDENT',
          },
          friend: {
            id: 'user-1',
            name: 'Alice',
            avatar: null,
            isOnline: true,
            role: 'STUDENT',
          },
        },
      ];

      mockPrisma.friendship.findMany.mockResolvedValue(mockFriendships);

      const result = await service.getFriends(userId);

      expect(result).toEqual([
        {
          id: 'user-2',
          name: 'Bob',
          avatar: null,
          isOnline: false,
          role: 'TEACHER',
        },
        {
          id: 'user-3',
          name: 'Charlie',
          avatar: null,
          isOnline: true,
          role: 'STUDENT',
        },
      ]);
    });
  });

  describe('removeFriend', () => {
    it('should delete the friendship and broadcast the removal', async () => {
      const userId = 'user-1';
      const friendId = 'user-2';
      const mockResult = { count: 1 };

      mockPrisma.friendship.deleteMany.mockResolvedValue(mockResult);

      const result = await service.removeFriend(userId, friendId);

      expect(mockPrisma.friendship.deleteMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { userId, friendId },
            { userId: friendId, friendId: userId },
          ],
        },
      });
      expect(mockSocketGateway.broadcastToUser).toHaveBeenCalledWith(
        friendId,
        SocketEvents.FRIEND_REMOVED,
        { userId },
      );
      expect(result).toEqual(mockResult);
    });
  });
});
