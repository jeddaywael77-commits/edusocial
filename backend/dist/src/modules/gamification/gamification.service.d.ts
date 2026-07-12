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
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        icon: string;
        color: string;
        xpRequired: number;
    })[]>;
    getUserBadges(userId: string): Promise<({
        badge: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            icon: string;
            color: string;
            xpRequired: number;
        };
    } & {
        id: string;
        userId: string;
        badgeId: string;
        earnedAt: Date;
    })[]>;
    awardBadge(userId: string, badgeId: string): Promise<{
        badge: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            icon: string;
            color: string;
            xpRequired: number;
        };
    } & {
        id: string;
        userId: string;
        badgeId: string;
        earnedAt: Date;
    }>;
    getUserStats(userId: string): Promise<{
        badgeCount: number;
        postCount: number;
        level: number;
        name: string;
        id: string;
        xp: number;
        coins: number;
    }>;
    addXp(userId: string, xp: number): Promise<{
        level: number;
        id: string;
        xp: number;
        coins: number;
    }>;
}
