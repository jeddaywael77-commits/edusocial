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
    getConversations(userId: string, page?: number, limit?: number): Promise<{
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
    getMessages(conversationId: string, page?: number, limit?: number): Promise<({
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
    sendMessage(senderId: string, conversationId: string, data: {
        content: string;
        type?: string;
        fileUrl?: string;
        fileName?: string;
    }): Promise<{
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
