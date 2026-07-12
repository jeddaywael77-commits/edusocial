import { GamificationService } from './gamification.service';
declare class AwardBadgeDto {
    badgeId: string;
    userId?: string;
}
declare class AddXpDto {
    xp: number;
    userId?: string;
}
export declare class GamificationController {
    private readonly gamificationService;
    constructor(gamificationService: GamificationService);
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
    getMyBadges(userId: string): Promise<({
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
    awardBadge(userId: string, dto: AwardBadgeDto): Promise<{
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
    getStats(userId: string): Promise<{
        badgeCount: number;
        postCount: number;
        id: string;
        name: string;
        xp: number;
        level: number;
        coins: number;
    }>;
    addXp(userId: string, dto: AddXpDto): Promise<{
        id: string;
        xp: number;
        level: number;
        coins: number;
    }>;
}
export {};
