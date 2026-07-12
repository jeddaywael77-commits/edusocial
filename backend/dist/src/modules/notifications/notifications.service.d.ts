import { PrismaService } from '../../database/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
export declare class NotificationsService {
    private prisma;
    private socketGateway;
    private readonly logger;
    constructor(prisma: PrismaService, socketGateway: SocketGateway);
    create(userId: string, data: {
        type: string;
        title: string;
        message: string;
        link?: string;
        senderId?: string;
    }): Promise<{
        sender: {
            id: string;
            name: string;
            avatar: string | null;
            level: number;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        link: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        userId: string;
        senderId: string | null;
        message: string;
        isRead: boolean;
    }>;
    findAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        link: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        userId: string;
        senderId: string | null;
        message: string;
        isRead: boolean;
    }[]>;
    findUnread(userId: string): Promise<{
        id: string;
        createdAt: Date;
        link: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        userId: string;
        senderId: string | null;
        message: string;
        isRead: boolean;
    }[]>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        link: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        userId: string;
        senderId: string | null;
        message: string;
        isRead: boolean;
    }>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    delete(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        link: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        userId: string;
        senderId: string | null;
        message: string;
        isRead: boolean;
    }>;
}
