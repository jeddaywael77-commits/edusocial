import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
import { SocketEvents } from '../socket/socket.events';

@Injectable()
export class FriendsService {
  private readonly logger = new Logger(FriendsService.name);
  constructor(
    private prisma: PrismaService,
    private socketGateway: SocketGateway,
  ) {}

  async sendRequest(senderId: string, receiverId: string) {
    const request = await this.prisma.friendRequest.create({
      data: { senderId, receiverId },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
      },
    });

    this.socketGateway.broadcastToUser(receiverId, SocketEvents.FRIEND_REQUEST_SENT, request);

    return request;
  }

  async getRequests(userId: string) {
    return this.prisma.friendRequest.findMany({
      where: { receiverId: userId, status: 'PENDING' },
      include: { sender: { select: { id: true, name: true, avatar: true, role: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async acceptRequest(requestId: string, userId: string) {
    const request = await this.prisma.friendRequest.findUnique({ where: { id: requestId } });
    if (!request || request.receiverId !== userId) throw new Error('Not authorized');
    if (request.status !== 'PENDING') throw new Error('Request already handled');

    await this.prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
    });

    await this.prisma.friendship.create({
      data: { userId: request.senderId, friendId: request.receiverId },
    });

    this.socketGateway.broadcastToUser(request.senderId, SocketEvents.FRIEND_REQUEST_ACCEPTED, { requestId, userId });

    return { success: true };
  }

  async declineRequest(requestId: string, userId: string) {
    const request = await this.prisma.friendRequest.findUnique({ where: { id: requestId } });
    if (!request || request.receiverId !== userId) throw new Error('Not authorized');

    const updated = await this.prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'DECLINED' },
    });

    this.socketGateway.broadcastToUser(request.senderId, SocketEvents.FRIEND_REQUEST_DECLINED, { requestId });

    return updated;
  }

  async getFriends(userId: string) {
    const friendships = await this.prisma.friendship.findMany({
      where: { OR: [{ userId }, { friendId: userId }] },
      include: {
        user: { select: { id: true, name: true, avatar: true, isOnline: true, role: true } },
        friend: { select: { id: true, name: true, avatar: true, isOnline: true, role: true } },
      },
    });
    return friendships.map((f) => (f.userId === userId ? f.friend : f.user));
  }

  async removeFriend(userId: string, friendId: string) {
    const result = await this.prisma.friendship.deleteMany({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });

    this.socketGateway.broadcastToUser(friendId, SocketEvents.FRIEND_REMOVED, { userId });

    return result;
  }
}
