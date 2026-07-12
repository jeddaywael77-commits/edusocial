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
var GamificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let GamificationService = GamificationService_1 = class GamificationService {
    prisma;
    logger = new common_1.Logger(GamificationService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getBadges() {
        return this.prisma.badge.findMany({
            include: { _count: { select: { users: true } } },
            orderBy: { xpRequired: 'asc' },
        });
    }
    async getUserBadges(userId) {
        return this.prisma.userBadge.findMany({
            where: { userId },
            include: { badge: true },
            orderBy: { earnedAt: 'desc' },
        });
    }
    async awardBadge(userId, badgeId) {
        return this.prisma.userBadge.upsert({
            where: { userId_badgeId: { userId, badgeId } },
            update: {},
            create: { userId, badgeId },
            include: { badge: true },
        });
    }
    async getUserStats(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, xp: true, level: true, coins: true },
        });
        if (!user)
            throw new Error('User not found');
        const badgeCount = await this.prisma.userBadge.count({ where: { userId } });
        const postCount = await this.prisma.post.count({ where: { authorId: userId } });
        return { ...user, badgeCount, postCount };
    }
    async addXp(userId, xp) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error('User not found');
        const newTotalXp = user.xp + xp;
        const newLevel = Math.floor(newTotalXp / 100) + 1;
        return this.prisma.user.update({
            where: { id: userId },
            data: { xp: newTotalXp, level: newLevel },
            select: { id: true, xp: true, level: true, coins: true },
        });
    }
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = GamificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GamificationService);
//# sourceMappingURL=gamification.service.js.map