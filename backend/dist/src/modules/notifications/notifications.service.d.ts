import { PrismaService } from '../../database/prisma.service';
export declare class NotificationsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(userId: string, data: {
        type: string;
        title: string;
        message: string;
        link?: string;
        senderId?: string;
    }): Promise<{
        message: string;
        link: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        id: string;
        createdAt: Date;
        userId: string;
        senderId: string | null;
        isRead: boolean;
    }>;
    findAll(userId: string): Promise<{
        message: string;
        link: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        id: string;
        createdAt: Date;
        userId: string;
        senderId: string | null;
        isRead: boolean;
    }[]>;
    findUnread(userId: string): Promise<{
        message: string;
        link: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        id: string;
        createdAt: Date;
        userId: string;
        senderId: string | null;
        isRead: boolean;
    }[]>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(id: string, userId: string): Promise<{
        message: string;
        link: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        id: string;
        createdAt: Date;
        userId: string;
        senderId: string | null;
        isRead: boolean;
    }>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    delete(id: string, userId: string): Promise<{
        message: string;
        link: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        id: string;
        createdAt: Date;
        userId: string;
        senderId: string | null;
        isRead: boolean;
    }>;
}
