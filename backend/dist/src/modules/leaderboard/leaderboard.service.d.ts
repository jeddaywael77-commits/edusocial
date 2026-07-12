import { PrismaService } from '../../database/prisma.service';
export declare class LeaderboardService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
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
    getUserRank(userId: string): Promise<{
        rank: number;
        id: string;
        name: string;
        avatar: string | null;
        xp: number;
        level: number;
        coins: number;
    }>;
}
