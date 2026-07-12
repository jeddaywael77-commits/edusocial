import { PrismaService } from '../../database/prisma.service';
export declare class GamificationService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getBadges(): Promise<({
        _count: {
            users: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        icon: string;
        color: string;
        xpRequired: number;
    })[]>;
    getUserBadges(userId: string): Promise<({
        badge: {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            icon: string;
            color: string;
            xpRequired: number;
        };
    } & {
        id: string;
        earnedAt: Date;
        userId: string;
        badgeId: string;
    })[]>;
    awardBadge(userId: string, badgeId: string): Promise<{
        badge: {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            icon: string;
            color: string;
            xpRequired: number;
        };
    } & {
        id: string;
        earnedAt: Date;
        userId: string;
        badgeId: string;
    }>;
    getUserStats(userId: string): Promise<{
        badgeCount: number;
        postCount: number;
        id: string;
        name: string;
        xp: number;
        level: number;
        coins: number;
    }>;
    addXp(userId: string, xp: number): Promise<{
        id: string;
        xp: number;
        level: number;
        coins: number;
    }>;
}
