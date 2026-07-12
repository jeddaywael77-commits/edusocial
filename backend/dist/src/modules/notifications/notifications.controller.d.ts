import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
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
