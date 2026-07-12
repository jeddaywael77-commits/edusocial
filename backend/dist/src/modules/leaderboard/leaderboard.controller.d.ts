import { LeaderboardService } from './leaderboard.service';
export declare class LeaderboardController {
    private readonly leaderboardService;
    constructor(leaderboardService: LeaderboardService);
    getTopByXp(limit?: number): Promise<{
        level: number;
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        avatar: string | null;
        xp: number;
        coins: number;
    }[]>;
    getTopByLevel(limit?: number): Promise<{
        level: number;
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        avatar: string | null;
        xp: number;
        coins: number;
    }[]>;
    getMyRank(userId: string): Promise<{
        rank: number;
        level: number;
        name: string;
        id: string;
        avatar: string | null;
        xp: number;
        coins: number;
    }>;
}
