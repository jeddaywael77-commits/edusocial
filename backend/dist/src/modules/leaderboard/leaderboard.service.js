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
var LeaderboardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let LeaderboardService = LeaderboardService_1 = class LeaderboardService {
    prisma;
    logger = new common_1.Logger(LeaderboardService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTopByXp(limit = 50) {
        return this.prisma.user.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                avatar: true,
                xp: true,
                level: true,
                coins: true,
                role: true,
            },
            orderBy: { xp: 'desc' },
            take: limit,
        });
    }
    async getTopByLevel(limit = 50) {
        return this.prisma.user.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                avatar: true,
                xp: true,
                level: true,
                coins: true,
                role: true,
            },
            orderBy: [{ level: 'desc' }, { xp: 'desc' }],
            take: limit,
        });
    }
    async getUserRank(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                avatar: true,
                xp: true,
                level: true,
                coins: true,
            },
        });
        if (!user)
            throw new Error('User not found');
        const rank = await this.prisma.user.count({
            where: { xp: { gt: user.xp }, isActive: true },
        });
        return { ...user, rank: rank + 1 };
    }
};
exports.LeaderboardService = LeaderboardService;
exports.LeaderboardService = LeaderboardService = LeaderboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeaderboardService);
//# sourceMappingURL=leaderboard.service.js.map