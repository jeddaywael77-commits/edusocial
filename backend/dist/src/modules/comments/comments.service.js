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
var CommentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let CommentsService = CommentsService_1 = class CommentsService {
    prisma;
    logger = new common_1.Logger(CommentsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(postId, authorId, dto) {
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post || post.isDeleted) {
            throw new common_1.NotFoundException('Post not found');
        }
        let depth = 0;
        if (dto.parentCommentId) {
            const parent = await this.prisma.comment.findUnique({
                where: { id: dto.parentCommentId },
            });
            if (!parent || parent.isDeleted) {
                throw new common_1.NotFoundException('Parent comment not found');
            }
            if (parent.postId !== postId) {
                throw new common_1.ForbiddenException('Parent comment belongs to different post');
            }
            depth = parent.depth + 1;
            if (depth > 5) {
                throw new common_1.ForbiddenException('Maximum nesting depth reached (5)');
            }
        }
        const comment = await this.prisma.comment.create({
            data: {
                content: dto.content,
                authorId,
                postId,
                parentId: dto.parentCommentId || null,
                depth,
                mentions: dto.mentions || [],
            },
            include: this.commentInclude(authorId),
        });
        this.logger.log(`Comment created: ${comment.id} on post ${postId}`);
        return comment;
    }
    async findByPostId(postId, userId, cursor, limit = 20) {
        const safeLimit = Math.min(50, Math.max(1, limit));
        const where = {
            postId,
            isDeleted: false,
            parentId: null,
        };
        const comments = await this.prisma.comment.findMany({
            where,
            take: safeLimit + 1,
            ...(cursor && { cursor: { id: cursor }, skip: 1 }),
            orderBy: { createdAt: 'asc' },
            include: {
                ...this.commentInclude(userId),
                replies: {
                    where: { isDeleted: false },
                    take: 3,
                    orderBy: { createdAt: 'asc' },
                    include: this.commentInclude(userId),
                },
                _count: {
                    select: {
                        replies: { where: { isDeleted: false } },
                        reactions: true,
                    },
                },
            },
        });
        const hasNext = comments.length > safeLimit;
        const data = hasNext ? comments.slice(0, safeLimit) : comments;
        const nextCursor = hasNext ? data[data.length - 1]?.id : null;
        return { data, nextCursor, hasNext };
    }
    async findReplies(commentId, userId, cursor, limit = 20) {
        const safeLimit = Math.min(50, Math.max(1, limit));
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment || comment.isDeleted) {
            throw new common_1.NotFoundException('Comment not found');
        }
        const replies = await this.prisma.comment.findMany({
            where: {
                parentId: commentId,
                isDeleted: false,
            },
            take: safeLimit + 1,
            ...(cursor && { cursor: { id: cursor }, skip: 1 }),
            orderBy: { createdAt: 'asc' },
            include: {
                ...this.commentInclude(userId),
                _count: { select: { reactions: true } },
            },
        });
        const hasNext = replies.length > safeLimit;
        const data = hasNext ? replies.slice(0, safeLimit) : replies;
        const nextCursor = hasNext ? data[data.length - 1]?.id : null;
        return { data, nextCursor, hasNext };
    }
    async update(id, userId, dto) {
        const comment = await this.prisma.comment.findUnique({ where: { id } });
        if (!comment || comment.isDeleted) {
            throw new common_1.NotFoundException('Comment not found');
        }
        if (comment.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only edit your own comments');
        }
        const updated = await this.prisma.comment.update({
            where: { id },
            data: {
                content: dto.content,
                isEdited: true,
            },
            include: this.commentInclude(userId),
        });
        this.logger.log(`Comment updated: ${id} by ${userId}`);
        return updated;
    }
    async delete(id, userId, userRole) {
        const comment = await this.prisma.comment.findUnique({ where: { id } });
        if (!comment || comment.isDeleted) {
            throw new common_1.NotFoundException('Comment not found');
        }
        const isOwner = comment.authorId === userId;
        const isAdmin = userRole === 'ADMIN' || userRole === 'MODERATOR';
        if (!isOwner && !isAdmin) {
            throw new common_1.ForbiddenException('Not authorized to delete this comment');
        }
        await this.prisma.comment.update({
            where: { id },
            data: { isDeleted: true, deletedAt: new Date() },
        });
        this.logger.log(`Comment soft-deleted: ${id} by ${userId}`);
        return { message: 'Comment deleted successfully' };
    }
    commentInclude(userId) {
        return {
            author: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                    role: true,
                    level: true,
                },
            },
            reactions: {
                where: { userId },
                select: { type: true },
                take: 1,
            },
        };
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = CommentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map