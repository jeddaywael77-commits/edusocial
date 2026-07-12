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
var FollowersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let FollowersService = FollowersService_1 = class FollowersService {
    prisma;
    logger = new common_1.Logger(FollowersService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async follow(followerId, userId) {
        return this.prisma.follower.create({
            data: { followerId, userId },
            include: {
                follower: { select: { id: true, name: true, avatar: true } },
                user: { select: { id: true, name: true, avatar: true } },
            },
        });
    }
    async unfollow(followerId, userId) {
        return this.prisma.follower.deleteMany({
            where: { followerId, userId },
        });
    }
    async getFollowers(userId) {
        return this.prisma.follower.findMany({
            where: { userId },
            include: { follower: { select: { id: true, name: true, avatar: true, isOnline: true, role: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getFollowing(userId) {
        return this.prisma.follower.findMany({
            where: { followerId: userId },
            include: { user: { select: { id: true, name: true, avatar: true, isOnline: true, role: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getFollowerCount(userId) {
        return this.prisma.follower.count({ where: { userId } });
    }
    async getFollowingCount(userId) {
        return this.prisma.follower.count({ where: { followerId: userId } });
    }
};
exports.FollowersService = FollowersService;
exports.FollowersService = FollowersService = FollowersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FollowersService);
//# sourceMappingURL=followers.service.js.map