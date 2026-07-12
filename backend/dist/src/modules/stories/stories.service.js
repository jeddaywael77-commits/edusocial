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
var StoriesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let StoriesService = StoriesService_1 = class StoriesService {
    prisma;
    logger = new common_1.Logger(StoriesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(authorId, data) {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        return this.prisma.story.create({
            data: { image: data.image, text: data.text, authorId, expiresAt },
            include: { author: { select: { id: true, name: true, avatar: true } } },
        });
    }
    async findAll() {
        return this.prisma.story.findMany({
            where: { expiresAt: { gt: new Date() } },
            include: {
                author: { select: { id: true, name: true, avatar: true } },
                _count: { select: { viewers: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return this.prisma.story.findUnique({
            where: { id },
            include: {
                author: { select: { id: true, name: true, avatar: true } },
                viewers: { include: { user: { select: { id: true, name: true } } } },
            },
        });
    }
    async markAsViewed(storyId, userId) {
        return this.prisma.storyViewer.upsert({
            where: { storyId_userId: { storyId, userId } },
            update: { viewedAt: new Date() },
            create: { storyId, userId },
        });
    }
    async delete(id, userId) {
        const story = await this.prisma.story.findUnique({ where: { id } });
        if (!story || story.authorId !== userId)
            throw new Error('Not authorized');
        return this.prisma.story.delete({ where: { id } });
    }
};
exports.StoriesService = StoriesService;
exports.StoriesService = StoriesService = StoriesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StoriesService);
//# sourceMappingURL=stories.service.js.map