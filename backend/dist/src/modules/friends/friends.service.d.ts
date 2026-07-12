import { PrismaService } from '../../database/prisma.service';
export declare class FriendsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    sendRequest(senderId: string, receiverId: string): Promise<{
        sender: {
            name: string;
            id: string;
            avatar: string | null;
        };
        receiver: {
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.FriendRequestStatus;
        senderId: string;
        receiverId: string;
    }>;
    getRequests(userId: string): Promise<({
        sender: {
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.FriendRequestStatus;
        senderId: string;
        receiverId: string;
    })[]>;
    acceptRequest(requestId: string, userId: string): Promise<{
        success: boolean;
    }>;
    declineRequest(requestId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.FriendRequestStatus;
        senderId: string;
        receiverId: string;
    }>;
    getFriends(userId: string): Promise<{
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        avatar: string | null;
        isOnline: boolean;
    }[]>;
    removeFriend(userId: string, friendId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
