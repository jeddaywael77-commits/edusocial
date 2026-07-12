import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string | null;
            bio: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            school: string | null;
            department: string | null;
            xp: number;
            level: number;
            coins: number;
            createdAt: Date;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
            isActive: boolean;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    refresh(userId: string, req: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<{
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
    }>;
}
