import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        user: {
            level: number;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            avatar: string | null;
            bio: string | null;
            school: string | null;
            department: string | null;
            xp: number;
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
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            isActive: boolean;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    refreshTokens(userId: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<{
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
    }>;
    private generateTokens;
    private updateRefreshToken;
}
