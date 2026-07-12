import { PrismaService } from '../../database/prisma.service';
export declare class LeaderboardService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
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
    getUserRank(userId: string): Promise<{
        rank: number;
        level: number;
        name: string;
        id: string;
        avatar: string | null;
        xp: number;
        coins: number;
    }>;
}
