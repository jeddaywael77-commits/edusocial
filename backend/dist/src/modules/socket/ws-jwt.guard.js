"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WsJwtGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsJwtGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const websockets_1 = require("@nestjs/websockets");
const prisma_service_1 = require("../../database/prisma.service");
let WsJwtGuard = WsJwtGuard_1 = class WsJwtGuard {
    jwtService;
    configService;
    prisma;
    logger = new common_1.Logger(WsJwtGuard_1.name);
    constructor(jwtService, configService, prisma) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const client = context.switchToWs().getClient();
        const token = this.extractToken(client);
        if (!token) {
            throw new websockets_1.WsException('Unauthorized: No token provided');
        }
        try {
            const secret = this.configService.get('jwt.secret') || 'fallback-secret';
            const payload = await this.jwtService.verifyAsync(token, {
                secret,
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    name: true,
                    isActive: true,
                },
            });
            if (!user || !user.isActive) {
                throw new websockets_1.WsException('Unauthorized: User not found or inactive');
            }
            client.data.user = {
                sub: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
            };
            return true;
        }
        catch (error) {
            if (error instanceof websockets_1.WsException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Unknown error';
            this.logger.warn(`WS auth failed: ${message}`);
            throw new websockets_1.WsException('Unauthorized: Invalid token');
        }
    }
    extractToken(client) {
        const token = client.handshake.auth?.token ||
            client.handshake.headers?.authorization?.replace('Bearer ', '') ||
            client.handshake.query?.token;
        return typeof token === 'string' ? token : null;
    }
};
exports.WsJwtGuard = WsJwtGuard;
exports.WsJwtGuard = WsJwtGuard = WsJwtGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        prisma_service_1.PrismaService])
], WsJwtGuard);
//# sourceMappingURL=ws-jwt.guard.js.map