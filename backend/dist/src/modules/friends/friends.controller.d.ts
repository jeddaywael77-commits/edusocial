import { FriendsService } from './friends.service';
declare class SendRequestDto {
    receiverId: string;
}
export declare class FriendsController {
    private readonly friendsService;
    constructor(friendsService: FriendsService);
    getFriends(userId: string): Promise<{
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        avatar: string | null;
        isOnline: boolean;
    }[]>;
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
    sendRequest(userId: string, dto: SendRequestDto): Promise<{
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
    acceptRequest(id: string, userId: string): Promise<{
        success: boolean;
    }>;
    declineRequest(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.FriendRequestStatus;
        senderId: string;
        receiverId: string;
    }>;
    removeFriend(userId: string, friendId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
export {};
