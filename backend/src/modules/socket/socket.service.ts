import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SocketService implements OnModuleInit {
  private readonly logger = new Logger(SocketService.name);
  private server: Server;
  private pubClient: Redis;
  private subClient: Redis;
  private readonly userSockets = new Map<string, Set<string>>();
  private readonly socketUsers = new Map<string, string>();

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  onModuleInit() {
    const host = this.configService.get<string>('redis.host') || 'localhost';
    const port = this.configService.get<number>('redis.port') || 6379;

    this.pubClient = new Redis({ host, port, maxRetriesPerRequest: null });
    this.subClient = this.pubClient.duplicate();

    this.pubClient.on('error', (err) =>
      this.logger.error('Redis pub error:', err.message),
    );
    this.subClient.on('error', (err) =>
      this.logger.error('Redis sub error:', err.message),
    );
    this.pubClient.on('connect', () => this.logger.log('Redis pub connected'));
    this.subClient.on('connect', () => this.logger.log('Redis sub connected'));
  }

  createRedisAdapter() {
    return createAdapter(this.pubClient, this.subClient);
  }

  setServer(server: Server) {
    this.server = server;
  }

  getServer(): Server {
    return this.server;
  }

  registerSocket(socketId: string, userId: string) {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socketId);
    this.socketUsers.set(socketId, userId);
  }

  unregisterSocket(socketId: string): string | undefined {
    const userId = this.socketUsers.get(socketId);
    if (userId) {
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.delete(socketId);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
      this.socketUsers.delete(socketId);
    }
    return userId;
  }

  getUserId(socketId: string): string | undefined {
    return this.socketUsers.get(socketId);
  }

  getUserSocketIds(userId: string): string[] {
    return Array.from(this.userSockets.get(userId) || []);
  }

  isUserOnline(userId: string): boolean {
    const sockets = this.userSockets.get(userId);
    return !!sockets && sockets.size > 0;
  }

  getOnlineUserIds(): string[] {
    return Array.from(this.userSockets.keys());
  }

  async markUserOnline(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isOnline: true, lastSeen: new Date() },
    });
  }

  async markUserOffline(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isOnline: false, lastSeen: new Date() },
    });
  }

  emitToUser(userId: string, event: string, data: unknown) {
    const socketIds = this.getUserSocketIds(userId);
    for (const socketId of socketIds) {
      const socket = this.server?.sockets?.sockets?.get(socketId);
      if (socket) {
        socket.emit(event, data);
      }
    }
  }

  emitToRoom(room: string, event: string, data: unknown) {
    this.server?.to(room).emit(event, data);
  }

  broadcastToAll(event: string, data: unknown) {
    this.server?.emit(event, data);
  }

  async addSocketToConversationRooms(socketId: string, userId: string) {
    const conversations = await this.prisma.conversationParticipant.findMany({
      where: { userId },
      select: { conversationId: true },
    });

    const socket = this.server?.sockets?.sockets?.get(socketId);
    if (socket) {
      for (const { conversationId } of conversations) {
        void socket.join(`conversation:${conversationId}`);
      }
    }
  }

  async addSocketToGroupRooms(socketId: string, userId: string) {
    const memberships = await this.prisma.groupMember.findMany({
      where: { userId },
      select: { groupId: true },
    });

    const socket = this.server?.sockets?.sockets?.get(socketId);
    if (socket) {
      for (const { groupId } of memberships) {
        void socket.join(`group:${groupId}`);
      }
    }
  }

  async addSocketToCourseRooms(socketId: string, userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      select: { courseId: true },
    });

    const socket = this.server?.sockets?.sockets?.get(socketId);
    if (socket) {
      for (const { courseId } of enrollments) {
        void socket.join(`course:${courseId}`);
      }
    }
  }

  joinRoom(socketId: string, room: string) {
    const socket = this.server?.sockets?.sockets?.get(socketId);
    if (socket) {
      void socket.join(room);
    }
  }

  leaveRoom(socketId: string, room: string) {
    const socket = this.server?.sockets?.sockets?.get(socketId);
    if (socket) {
      void socket.leave(room);
    }
  }

  async cleanup() {
    await this.pubClient?.quit();
    await this.subClient?.quit();
  }
}
