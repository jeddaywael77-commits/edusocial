import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { SocketService } from './socket.service.js';
import { WsJwtGuard } from './ws-jwt.guard.js';
import { WsCurrentUser } from './ws-current-user.decorator.js';
import { SocketEvents } from './socket.events.js';
import { ChatService } from '../chat/chat.service.js';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  namespace: '/',
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SocketGateway.name);

  constructor(
    private socketService: SocketService,
    private chatService: ChatService,
  ) {}

  afterInit() {
    this.socketService.setServer(this.server);
    this.logger.log('WebSocket Gateway initialized');
  }

  @UseGuards(WsJwtGuard)
  async handleConnection(client: Socket) {
    const user = client.data?.user;
    if (!user?.sub) {
      client.disconnect();
      return;
    }

    const userId = user.sub;
    this.socketService.registerSocket(client.id, userId);
    await this.socketService.markUserOnline(userId);

    await this.socketService.addSocketToConversationRooms(client.id, userId);
    await this.socketService.addSocketToGroupRooms(client.id, userId);
    await this.socketService.addSocketToCourseRooms(client.id, userId);

    this.server.emit(SocketEvents.PRESENCE_ONLINE, { userId });
    this.logger.log(`Client connected: ${client.id} (user: ${userId})`);
  }

  async handleDisconnect(client: Socket) {
    const userId = this.socketService.unregisterSocket(client.id);

    if (userId && !this.socketService.isUserOnline(userId)) {
      await this.socketService.markUserOffline(userId);
      this.server.emit(SocketEvents.PRESENCE_OFFLINE, { userId });
    }

    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvents.JOIN_ROOM)
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ) {
    this.socketService.joinRoom(client.id, data.room);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvents.LEAVE_ROOM)
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ) {
    this.socketService.leaveRoom(client.id, data.room);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvents.CHAT_SEND_MESSAGE)
  async handleChatMessage(
    @ConnectedSocket() client: Socket,
    @WsCurrentUser('sub') userId: string,
    @MessageBody() data: { conversationId: string; content: string; type?: string; fileUrl?: string; fileName?: string },
  ) {
    const message = await this.chatService.sendMessage(userId, data.conversationId, {
      content: data.content,
      type: data.type,
      fileUrl: data.fileUrl,
      fileName: data.fileName,
    });

    this.server.to(`conversation:${data.conversationId}`).emit(SocketEvents.CHAT_RECEIVE_MESSAGE, message);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvents.CHAT_TYPING)
  handleTyping(
    @ConnectedSocket() client: Socket,
    @WsCurrentUser('sub') userId: string,
    @MessageBody() data: { conversationId: string; userName: string },
  ) {
    client.to(`conversation:${data.conversationId}`).emit(SocketEvents.CHAT_TYPING, {
      conversationId: data.conversationId,
      userId,
      userName: data.userName,
    });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvents.CHAT_STOP_TYPING)
  handleStopTyping(
    @ConnectedSocket() client: Socket,
    @WsCurrentUser('sub') userId: string,
    @MessageBody() data: { conversationId: string },
  ) {
    client.to(`conversation:${data.conversationId}`).emit(SocketEvents.CHAT_STOP_TYPING, {
      conversationId: data.conversationId,
      userId,
    });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvents.MARK_READ)
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @WsCurrentUser('sub') userId: string,
    @MessageBody() data: { conversationId: string },
  ) {
    await this.chatService.markAsRead(data.conversationId, userId);

    client.to(`conversation:${data.conversationId}`).emit(SocketEvents.CHAT_READ_RECEIPT, {
      conversationId: data.conversationId,
      userId,
      readAt: new Date().toISOString(),
    });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvents.PRESENCE_TRACK)
  handlePresenceTrack(
    @ConnectedSocket() client: Socket,
    @WsCurrentUser('sub') userId: string,
    @MessageBody() data: { targetUserId: string },
  ) {
    const isOnline = this.socketService.isUserOnline(data.targetUserId);
    client.emit(SocketEvents.PRESENCE_ONLINE, {
      userId: data.targetUserId,
      isOnline,
    });
  }

  broadcastToUser(userId: string, event: string, data: unknown) {
    this.socketService.emitToUser(userId, event, data);
  }

  broadcastToRoom(room: string, event: string, data: unknown) {
    this.server.to(room).emit(event, data);
  }

  broadcastToAll(event: string, data: unknown) {
    this.server.emit(event, data);
  }
}
