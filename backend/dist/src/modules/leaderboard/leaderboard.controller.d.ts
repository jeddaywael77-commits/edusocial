import { LeaderboardService } from './leaderboard.service';
export declare class LeaderboardController {
    private readonly leaderboardService;
    constructor(leaderboardService: LeaderboardService);
    getTopByXp(limit?: number): Promise<{
        id: string;
        name: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        xp: number;
        level: number;
        coins: number;
    }[]>;
    getTopByLevel(limit?: number): Promise<{
        id: string;
        name: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        xp: number;
        level: number;
        coins: number;
    }[]>;
    getMyRank(userId: string): Promise<{
        rank: number;
        id: string;
        name: string;
        avatar: string | null;
        xp: number;
        level: number;
        coins: number;
    }>;
}
