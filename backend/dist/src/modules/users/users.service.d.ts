import { PrismaService } from '../../database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
export declare class UsersService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(query: QueryUsersDto): Promise<{
        data: {
            id: string;
            email: string;
            name: string;
            avatar: string | null;
            coverPhoto: string | null;
            bio: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            school: string | null;
            department: string | null;
            xp: number;
            level: number;
            coins: number;
            isOnline: boolean;
            lastSeen: Date;
            createdAt: Date;
            _count: {
                posts: number;
                followers: number;
                following: number;
                friendsA: number;
                friendsB: number;
            };
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    findById(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        coverPhoto: string | null;
        bio: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        school: string | null;
        department: string | null;
        xp: number;
        level: number;
        coins: number;
        isOnline: boolean;
        lastSeen: Date;
        createdAt: Date;
        badges: {
            badge: {
                id: string;
                name: string;
                createdAt: Date;
                description: string | null;
                icon: string;
                color: string;
                xpRequired: number;
            };
            earnedAt: Date;
        }[];
        _count: {
            posts: number;
            followers: number;
            following: number;
            friendsA: number;
            friendsB: number;
        };
    }>;
    update(id: string, dto: UpdateUserDto, currentUserId: string): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        coverPhoto: string | null;
        bio: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        school: string | null;
        department: string | null;
        updatedAt: Date;
    }>;
    getOnlineUsers(): Promise<{
        id: string;
        name: string;
        avatar: string | null;
        isOnline: boolean;
        lastSeen: Date;
    }[]>;
    updateOnlineStatus(userId: string, isOnline: boolean): Promise<{
        id: string;
        email: string;
        password: string;
        name: string;
        avatar: string | null;
        coverPhoto: string | null;
        bio: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        school: string | null;
        department: string | null;
        xp: number;
        level: number;
        coins: number;
        isOnline: boolean;
        lastSeen: Date;
        isActive: boolean;
        refreshToken: string | null;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getLeaderboard(limit?: number): Promise<{
        id: string;
        name: string;
        avatar: string | null;
        xp: number;
        level: number;
        coins: number;
        badges: {
            badge: {
                id: string;
                name: string;
                createdAt: Date;
                description: string | null;
                icon: string;
                color: string;
                xpRequired: number;
            };
        }[];
    }[]>;
}
