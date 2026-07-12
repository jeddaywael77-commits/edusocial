import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { ChatService } from '../chat/chat.service';
export declare class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private socketService;
    private chatService;
    server: Server;
    private readonly logger;
    constructor(socketService: SocketService, chatService: ChatService);
    afterInit(): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleJoinRoom(client: Socket, data: {
        room: string;
    }): void;
    handleLeaveRoom(client: Socket, data: {
        room: string;
    }): void;
    handleChatMessage(client: Socket, userId: string, data: {
        conversationId: string;
        content: string;
        type?: string;
        fileUrl?: string;
        fileName?: string;
    }): Promise<void>;
    handleTyping(client: Socket, userId: string, data: {
        conversationId: string;
        userName: string;
    }): void;
    handleStopTyping(client: Socket, userId: string, data: {
        conversationId: string;
    }): void;
    handleMarkRead(client: Socket, userId: string, data: {
        conversationId: string;
    }): Promise<void>;
    handlePresenceTrack(client: Socket, userId: string, data: {
        targetUserId: string;
    }): void;
    broadcastToUser(userId: string, event: string, data: unknown): void;
    broadcastToRoom(room: string, event: string, data: unknown): void;
    broadcastToGroup(groupId: string, event: string, data: unknown): void;
    broadcastToAll(event: string, data: unknown): void;
}
