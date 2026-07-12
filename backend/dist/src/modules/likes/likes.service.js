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
var LikesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let LikesService = LikesService_1 = class LikesService {
    prisma;
    logger = new common_1.Logger(LikesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async toggle(userId, dto) {
        if (!dto.postId && !dto.commentId) {
            throw new common_1.BadRequestException('Either postId or commentId is required');
        }
        if (dto.postId && dto.commentId) {
            throw new common_1.BadRequestException('Provide only postId or commentId, not both');
        }
        if (dto.postId) {
            return this.togglePostReaction(userId, dto.postId, dto.type);
        }
        return this.toggleCommentReaction(userId, dto.commentId, dto.type);
    }
    async togglePostReaction(userId, postId, type) {
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post || post.isDeleted) {
            throw new common_1.NotFoundException('Post not found');
        }
        const existing = await this.prisma.reaction.findUnique({
            where: { userId_postId: { userId, postId } },
        });
        if (existing) {
            if (existing.type === type) {
                await this.prisma.reaction.delete({
                    where: { userId_postId: { userId, postId } },
                });
                this.logger.log(`Reaction removed: ${type} on post ${postId}`);
                return { action: 'removed', type: null };
            }
            const updated = await this.prisma.reaction.update({
                where: { userId_postId: { userId, postId } },
                data: { type },
            });
            this.logger.log(`Reaction changed: ${type} on post ${postId}`);
            return { action: 'updated', type: updated.type };
        }
        await this.prisma.reaction.create({
            data: { userId, postId, type },
        });
        this.logger.log(`Reaction added: ${type} on post ${postId}`);
        return { action: 'added', type };
    }
    async toggleCommentReaction(userId, commentId, type) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment || comment.isDeleted) {
            throw new common_1.NotFoundException('Comment not found');
        }
        const existing = await this.prisma.commentReaction.findUnique({
            where: { userId_commentId: { userId, commentId } },
        });
        if (existing) {
            if (existing.type === type) {
                await this.prisma.commentReaction.delete({
                    where: { userId_commentId: { userId, commentId } },
                });
                return { action: 'removed', type: null };
            }
            const updated = await this.prisma.commentReaction.update({
                where: { userId_commentId: { userId, commentId } },
                data: { type },
            });
            return { action: 'updated', type: updated.type };
        }
        await this.prisma.commentReaction.create({
            data: { userId, commentId, type },
        });
        return { action: 'added', type };
    }
    async getPostReactions(postId) {
        const reactions = await this.prisma.reaction.groupBy({
            by: ['type'],
            where: { postId },
            _count: { type: true },
            orderBy: { _count: { type: 'desc' } },
        });
        const total = reactions.reduce((sum, r) => sum + r._count.type, 0);
        return {
            total,
            breakdown: reactions.map((r) => ({
                type: r.type,
                count: r._count.type,
            })),
        };
    }
    async getCommentReactions(commentId) {
        const reactions = await this.prisma.commentReaction.groupBy({
            by: ['type'],
            where: { commentId },
            _count: { type: true },
            orderBy: { _count: { type: 'desc' } },
        });
        const total = reactions.reduce((sum, r) => sum + r._count.type, 0);
        return {
            total,
            breakdown: reactions.map((r) => ({
                type: r.type,
                count: r._count.type,
            })),
        };
    }
    async getPostReactors(postId, type, limit = 20) {
        const where = {
            postId,
            ...(type && { type }),
        };
        const reactors = await this.prisma.reaction.findMany({
            where,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                type: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        level: true,
                    },
                },
            },
        });
        return reactors;
    }
};
exports.LikesService = LikesService;
exports.LikesService = LikesService = LikesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LikesService);
//# sourceMappingURL=likes.service.js.map