import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
export declare class WsJwtGuard implements CanActivate {
    private jwtService;
    private configService;
    private prisma;
    private readonly logger;
    constructor(jwtService: JwtService, configService: ConfigService, prisma: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractToken;
}
