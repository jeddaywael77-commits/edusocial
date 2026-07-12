import { ChatService } from './chat.service';
declare class CreateConversationDto {
    name?: string;
    participantIds: string[];
    isGroup?: boolean;
}
declare class SendMessageDto {
    content: string;
    type?: string;
    fileUrl?: string;
    fileName?: string;
}
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getConversations(userId: string): Promise<({
        participants: ({
            user: {
                name: string;
                id: string;
                avatar: string | null;
                isOnline: boolean;
            };
        } & {
            id: string;
            userId: string;
            joinedAt: Date;
            conversationId: string;
        })[];
        messages: {
            type: string;
            id: string;
            createdAt: Date;
            content: string;
            senderId: string;
            fileUrl: string | null;
            fileName: string | null;
            conversationId: string;
            isRead: boolean;
        }[];
    } & {
        name: string | null;
        id: string;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
        isGroup: boolean;
    })[]>;
    createConversation(userId: string, dto: CreateConversationDto): Promise<{
        participants: ({
            user: {
                name: string;
                id: string;
                avatar: string | null;
            };
        } & {
            id: string;
            userId: string;
            joinedAt: Date;
            conversationId: string;
        })[];
    } & {
        name: string | null;
        id: string;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
        isGroup: boolean;
    }>;
    getMessages(id: string, page?: number, limit?: number): Promise<({
        sender: {
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        type: string;
        id: string;
        createdAt: Date;
        content: string;
        senderId: string;
        fileUrl: string | null;
        fileName: string | null;
        conversationId: string;
        isRead: boolean;
    })[]>;
    sendMessage(userId: string, conversationId: string, dto: SendMessageDto): Promise<{
        sender: {
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        type: string;
        id: string;
        createdAt: Date;
        content: string;
        senderId: string;
        fileUrl: string | null;
        fileName: string | null;
        conversationId: string;
        isRead: boolean;
    }>;
    markAsRead(conversationId: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
export {};
