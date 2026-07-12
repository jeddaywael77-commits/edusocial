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
    getConversations(userId: string): Promise<{
        data: ({
            participants: ({
                user: {
                    id: string;
                    name: string;
                    avatar: string | null;
                    isOnline: boolean;
                };
            } & {
                id: string;
                userId: string;
                conversationId: string;
                joinedAt: Date;
            })[];
            messages: {
                id: string;
                createdAt: Date;
                type: string;
                content: string;
                fileUrl: string | null;
                senderId: string;
                conversationId: string;
                fileName: string | null;
                isRead: boolean;
            }[];
        } & {
            id: string;
            name: string | null;
            avatar: string | null;
            createdAt: Date;
            updatedAt: Date;
            isGroup: boolean;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createConversation(userId: string, dto: CreateConversationDto): Promise<{
        participants: ({
            user: {
                id: string;
                name: string;
                avatar: string | null;
            };
        } & {
            id: string;
            userId: string;
            conversationId: string;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        name: string | null;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
        isGroup: boolean;
    }>;
    getMessages(id: string, page?: number, limit?: number): Promise<({
        sender: {
            id: string;
            name: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        type: string;
        content: string;
        fileUrl: string | null;
        senderId: string;
        conversationId: string;
        fileName: string | null;
        isRead: boolean;
    })[]>;
    sendMessage(userId: string, conversationId: string, dto: SendMessageDto): Promise<{
        sender: {
            id: string;
            name: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        type: string;
        content: string;
        fileUrl: string | null;
        senderId: string;
        conversationId: string;
        fileName: string | null;
        isRead: boolean;
    }>;
    markAsRead(conversationId: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
export {};
