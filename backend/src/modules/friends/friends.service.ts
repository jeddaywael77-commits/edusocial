import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class FriendsService {
  private readonly logger = new Logger(FriendsService.name);
  constructor(private prisma: PrismaService) {}

  async sendRequest(senderId: string, receiverId: string) {
    return this.prisma.friendRequest.create({
      data: { senderId, receiverId },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
      },
    });
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

    return { success: true };
  }

  async declineRequest(requestId: string, userId: string) {
    const request = await this.prisma.friendRequest.findUnique({ where: { id: requestId } });
    if (!request || request.receiverId !== userId) throw new Error('Not authorized');

    return this.prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'DECLINED' },
    });
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
    return this.prisma.friendship.deleteMany({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });
  }
}
