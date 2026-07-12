import { GamificationService } from './gamification.service';
declare class AwardBadgeDto {
    badgeId: string;
}
declare class AddXpDto {
    xp: number;
}
export declare class GamificationController {
    private readonly gamificationService;
    constructor(gamificationService: GamificationService);
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
    getMyBadges(userId: string): Promise<({
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
    awardBadge(userId: string, dto: AwardBadgeDto): Promise<{
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
    getStats(userId: string): Promise<{
        badgeCount: number;
        postCount: number;
        level: number;
        name: string;
        id: string;
        xp: number;
        coins: number;
    }>;
    addXp(userId: string, dto: AddXpDto): Promise<{
        level: number;
        id: string;
        xp: number;
        coins: number;
    }>;
}
export {};
