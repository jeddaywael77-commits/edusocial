import { PrismaService } from '../../database/prisma.service';
export declare class FollowersService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    follow(followerId: string, userId: string): Promise<{
        user: {
            name: string;
            id: string;
            avatar: string | null;
        };
        follower: {
            name: string;
            id: string;
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
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            avatar: string | null;
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
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            avatar: string | null;
            isOnline: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        followerId: string;
    })[]>;
    getFollowerCount(userId: string): Promise<number>;
    getFollowingCount(userId: string): Promise<number>;
}
