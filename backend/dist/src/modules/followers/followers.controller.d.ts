import { FollowersService } from './followers.service';
export declare class FollowersController {
    private readonly followersService;
    constructor(followersService: FollowersService);
    follow(followerId: string, userId: string): Promise<{
        user: {
            id: string;
            name: string;
            avatar: string | null;
        };
        follower: {
            id: string;
            name: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        followerId: string;
    }>;
    unfollow(followerId: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    getFollowers(userId: string): Promise<({
        follower: {
            id: string;
            name: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            isOnline: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        followerId: string;
    })[]>;
    getFollowing(userId: string): Promise<({
        user: {
            id: string;
            name: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            isOnline: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        followerId: string;
    })[]>;
    getFollowerCount(userId: string): Promise<number>;
}
