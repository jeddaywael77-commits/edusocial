import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(query: QueryUsersDto): Promise<{
        data: {
            level: number;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            avatar: string | null;
            coverPhoto: string | null;
            bio: string | null;
            school: string | null;
            department: string | null;
            xp: number;
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
    getOnlineUsers(): Promise<{
        name: string;
        id: string;
        avatar: string | null;
        isOnline: boolean;
        lastSeen: Date;
    }[]>;
    getLeaderboard(limit?: number): Promise<{
        level: number;
        name: string;
        id: string;
        avatar: string | null;
        xp: number;
        coins: number;
        badges: {
            badge: {
                description: string | null;
                name: string;
                id: string;
                createdAt: Date;
                icon: string;
                color: string;
                xpRequired: number;
            };
        }[];
    }[]>;
    findById(id: string): Promise<{
        level: number;
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        avatar: string | null;
        coverPhoto: string | null;
        bio: string | null;
        school: string | null;
        department: string | null;
        xp: number;
        coins: number;
        isOnline: boolean;
        lastSeen: Date;
        createdAt: Date;
        badges: {
            badge: {
                description: string | null;
                name: string;
                id: string;
                createdAt: Date;
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
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        avatar: string | null;
        coverPhoto: string | null;
        bio: string | null;
        school: string | null;
        department: string | null;
        updatedAt: Date;
    }>;
}
