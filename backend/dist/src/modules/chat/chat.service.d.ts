import { PrismaService } from '../../database/prisma.service';
export declare class ChatService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createConversation(userId: string, data: {
        name?: string;
        participantIds: string[];
        isGroup?: boolean;
    }): Promise<{
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
    getMessages(conversationId: string, page?: number, limit?: number): Promise<({
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
    sendMessage(senderId: string, conversationId: string, data: {
        content: string;
        type?: string;
        fileUrl?: string;
        fileName?: string;
    }): Promise<{
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
