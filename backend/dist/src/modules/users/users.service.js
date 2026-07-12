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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const prisma_helpers_1 = require("../../common/utils/prisma-helpers");
let UsersService = UsersService_1 = class UsersService {
    prisma;
    logger = new common_1.Logger(UsersService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page, limit, skip, sortBy, sortOrder } = (0, prisma_helpers_1.buildPaginationArgs)(query);
        const where = {
            isActive: true,
            ...(query.search && {
                OR: [
                    { name: { contains: query.search, mode: 'insensitive' } },
                    { email: { contains: query.search, mode: 'insensitive' } },
                ],
            }),
            ...(query.role && { role: query.role }),
        };
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                    coverPhoto: true,
                    bio: true,
                    role: true,
                    school: true,
                    department: true,
                    xp: true,
                    level: true,
                    coins: true,
                    isOnline: true,
                    lastSeen: true,
                    createdAt: true,
                    _count: {
                        select: {
                            posts: true,
                            followers: true,
                            following: true,
                            friendsA: true,
                            friendsB: true,
                        },
                    },
                },
            }),
            this.prisma.user.count({ where }),
        ]);
        return (0, prisma_helpers_1.buildPaginatedResponse)(users, total, page, limit);
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                coverPhoto: true,
                bio: true,
                role: true,
                school: true,
                department: true,
                xp: true,
                level: true,
                coins: true,
                isOnline: true,
                lastSeen: true,
                createdAt: true,
                badges: {
                    select: {
                        badge: true,
                        earnedAt: true,
                    },
                },
                _count: {
                    select: {
                        posts: true,
                        followers: true,
                        following: true,
                        friendsA: true,
                        friendsB: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async update(id, dto, currentUserId) {
        if (id !== currentUserId) {
            throw new common_1.NotFoundException('You can only update your own profile');
        }
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const updated = await this.prisma.user.update({
            where: { id },
            data: dto,
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                coverPhoto: true,
                bio: true,
                role: true,
                school: true,
                department: true,
                updatedAt: true,
            },
        });
        this.logger.log(`User updated: ${id}`);
        return updated;
    }
    async getOnlineUsers() {
        return this.prisma.user.findMany({
            where: { isOnline: true, isActive: true },
            select: {
                id: true,
                name: true,
                avatar: true,
                isOnline: true,
                lastSeen: true,
            },
            orderBy: { lastSeen: 'desc' },
            take: 50,
        });
    }
    async updateOnlineStatus(userId, isOnline) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { isOnline, lastSeen: new Date() },
        });
    }
    async getLeaderboard(limit = 50) {
        return this.prisma.user.findMany({
            where: { isActive: true },
            orderBy: { xp: 'desc' },
            take: limit,
            select: {
                id: true,
                name: true,
                avatar: true,
                xp: true,
                level: true,
                coins: true,
                badges: {
                    select: {
                        badge: true,
                    },
                },
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map