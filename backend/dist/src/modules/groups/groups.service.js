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
var GroupsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let GroupsService = GroupsService_1 = class GroupsService {
    prisma;
    logger = new common_1.Logger(GroupsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(adminId, data) {
        const group = await this.prisma.group.create({
            data: {
                name: data.name,
                description: data.description,
                type: data.type || 'CLUB',
                cover: data.cover,
                adminId,
            },
            include: { admin: { select: { id: true, name: true, avatar: true } } },
        });
        await this.prisma.groupMember.create({
            data: { groupId: group.id, userId: adminId, role: 'admin' },
        });
        return group;
    }
    async findAll() {
        return this.prisma.group.findMany({
            include: {
                admin: { select: { id: true, name: true, avatar: true } },
                _count: { select: { members: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return this.prisma.group.findUnique({
            where: { id },
            include: {
                admin: { select: { id: true, name: true, avatar: true } },
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, avatar: true, isOnline: true },
                        },
                    },
                },
                _count: { select: { members: true, posts: true } },
            },
        });
    }
    async update(id, userId, data) {
        const group = await this.prisma.group.findUnique({ where: { id } });
        if (!group || group.adminId !== userId)
            throw new Error('Not authorized');
        return this.prisma.group.update({ where: { id }, data });
    }
    async delete(id, userId) {
        const group = await this.prisma.group.findUnique({ where: { id } });
        if (!group || group.adminId !== userId)
            throw new Error('Not authorized');
        return this.prisma.group.delete({ where: { id } });
    }
    async join(groupId, userId) {
        return this.prisma.groupMember.create({
            data: { groupId, userId },
        });
    }
    async leave(groupId, userId) {
        return this.prisma.groupMember.deleteMany({
            where: { groupId, userId },
        });
    }
};
exports.GroupsService = GroupsService;
exports.GroupsService = GroupsService = GroupsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GroupsService);
//# sourceMappingURL=groups.service.js.map