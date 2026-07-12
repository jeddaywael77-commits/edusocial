import { PrismaService } from '../../database/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
export declare class FriendsService {
    private prisma;
    private socketGateway;
    private readonly logger;
    constructor(prisma: PrismaService, socketGateway: SocketGateway);
    sendRequest(senderId: string, receiverId: string): Promise<{
        sender: {
            id: string;
            name: string;
            avatar: string | null;
        };
        receiver: {
            id: string;
            name: string;
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
            id: string;
            name: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
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
        id: string;
        name: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        isOnline: boolean;
    }[]>;
    removeFriend(userId: string, friendId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
