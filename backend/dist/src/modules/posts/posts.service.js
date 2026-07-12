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
var PostsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const enums_1 = require("../../common/enums");
let PostsService = PostsService_1 = class PostsService {
    prisma;
    logger = new common_1.Logger(PostsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(authorId, dto) {
        const data = {
            content: dto.content,
            type: dto.type || 'TEXT',
            visibility: dto.visibility || 'PUBLIC',
            status: enums_1.PostStatus.PUBLISHED,
            images: dto.images || [],
            video: dto.video,
            pdfUrl: dto.pdfUrl,
            pdfName: dto.pdfName,
            hashtags: dto.hashtags || [],
            mentions: dto.mentions || [],
            author: { connect: { id: authorId } },
            ...(dto.groupId && { group: { connect: { id: dto.groupId } } }),
            ...(dto.courseId && { course: { connect: { id: dto.courseId } } }),
        };
        const post = await this.prisma.post.create({
            data,
            include: this.postInclude(authorId),
        });
        this.logger.log(`Post created: ${post.id} by ${authorId}`);
        return post;
    }
    async findAll(userId, query) {
        const limit = Math.min(50, Math.max(1, query.limit || 20));
        const where = {
            isDeleted: false,
            status: enums_1.PostStatus.PUBLISHED,
            ...(query.authorId && { authorId: query.authorId }),
            ...(query.groupId && { groupId: query.groupId }),
            ...(query.courseId && { courseId: query.courseId }),
            ...(query.visibility && { visibility: query.visibility }),
            ...(query.type && { type: query.type }),
            ...(query.hashtag && { hashtags: { has: query.hashtag } }),
            ...(query.search && {
                OR: [
                    { content: { contains: query.search, mode: 'insensitive' } },
                    { hashtags: { has: query.search } },
                ],
            }),
        };
        const cursor = query.cursor
            ? { id: query.cursor }
            : undefined;
        const [posts, count] = await Promise.all([
            this.prisma.post.findMany({
                where,
                take: limit + 1,
                ...(cursor && { cursor, skip: 1 }),
                orderBy: [
                    { isPinned: 'desc' },
                    { createdAt: 'desc' },
                ],
                include: this.postInclude(userId),
            }),
            this.prisma.post.count({ where }),
        ]);
        const hasNext = posts.length > limit;
        const data = hasNext ? posts.slice(0, limit) : posts;
        const nextCursor = hasNext ? data[data.length - 1]?.id : null;
        return {
            data,
            meta: {
                total: count,
                nextCursor,
                hasNext,
                limit,
            },
        };
    }
    async findTrending(userId, limit = 10) {
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
        const posts = await this.prisma.post.findMany({
            where: {
                isDeleted: false,
                status: enums_1.PostStatus.PUBLISHED,
                visibility: enums_1.PostVisibility.PUBLIC,
                createdAt: { gte: threeDaysAgo },
            },
            orderBy: [
                { shareCount: 'desc' },
                { createdAt: 'desc' },
            ],
            take: limit,
            include: this.postInclude(userId),
        });
        return posts;
    }
    async findById(id, userId) {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: this.postInclude(userId),
        });
        if (!post || post.isDeleted) {
            throw new common_1.NotFoundException('Post not found');
        }
        return post;
    }
    async update(id, userId, dto) {
        const post = await this.prisma.post.findUnique({ where: { id } });
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        if (post.isDeleted)
            throw new common_1.NotFoundException('Post not found');
        if (post.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only edit your own posts');
        }
        const updated = await this.prisma.post.update({
            where: { id },
            data: {
                ...(dto.content !== undefined && { content: dto.content }),
                ...(dto.type !== undefined && { type: dto.type }),
                ...(dto.visibility !== undefined && { visibility: dto.visibility }),
                ...(dto.status !== undefined && { status: dto.status }),
                ...(dto.images !== undefined && { images: dto.images }),
                ...(dto.video !== undefined && { video: dto.video }),
                ...(dto.hashtags !== undefined && { hashtags: dto.hashtags }),
                ...(dto.mentions !== undefined && { mentions: dto.mentions }),
            },
            include: this.postInclude(userId),
        });
        this.logger.log(`Post updated: ${id} by ${userId}`);
        return updated;
    }
    async delete(id, userId, userRole) {
        const post = await this.prisma.post.findUnique({ where: { id } });
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        if (post.isDeleted)
            throw new common_1.NotFoundException('Post not found');
        const isOwner = post.authorId === userId;
        const isAdmin = userRole === 'ADMIN' || userRole === 'MODERATOR';
        if (!isOwner && !isAdmin) {
            throw new common_1.ForbiddenException('Not authorized to delete this post');
        }
        await this.prisma.post.update({
            where: { id },
            data: { isDeleted: true, deletedAt: new Date() },
        });
        this.logger.log(`Post soft-deleted: ${id} by ${userId}`);
        return { message: 'Post deleted successfully' };
    }
    async pin(id, userId) {
        const post = await this.prisma.post.findUnique({ where: { id } });
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        if (post.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only pin your own posts');
        }
        const updated = await this.prisma.post.update({
            where: { id },
            data: { isPinned: !post.isPinned },
            include: this.postInclude(userId),
        });
        return updated;
    }
    async share(id, userId, note) {
        const post = await this.prisma.post.findUnique({ where: { id } });
        if (!post || post.isDeleted) {
            throw new common_1.NotFoundException('Post not found');
        }
        const existingShare = await this.prisma.postShare.findFirst({
            where: { userId, postId: id },
        });
        if (existingShare) {
            throw new common_1.ConflictException('You already shared this post');
        }
        const [, updated] = await this.prisma.$transaction([
            this.prisma.postShare.create({
                data: {
                    userId,
                    postId: id,
                    note: note || null,
                },
            }),
            this.prisma.post.update({
                where: { id },
                data: { shareCount: { increment: 1 } },
            }),
        ]);
        this.logger.log(`Post shared: ${id} by ${userId}`);
        return { message: 'Post shared successfully' };
    }
    async save(id, userId) {
        const post = await this.prisma.post.findUnique({ where: { id } });
        if (!post || post.isDeleted)
            throw new common_1.NotFoundException('Post not found');
        const existing = await this.prisma.postSave.findUnique({
            where: { userId_postId: { userId, postId: id } },
        });
        if (existing) {
            await this.prisma.postSave.delete({
                where: { userId_postId: { userId, postId: id } },
            });
            return { saved: false };
        }
        await this.prisma.postSave.create({
            data: { userId, postId: id },
        });
        return { saved: true };
    }
    async report(id, userId, reason, details) {
        const post = await this.prisma.post.findUnique({ where: { id } });
        if (!post || post.isDeleted)
            throw new common_1.NotFoundException('Post not found');
        const existing = await this.prisma.postReport.findUnique({
            where: { userId_postId: { userId, postId: id } },
        });
        if (existing) {
            throw new common_1.ConflictException('You already reported this post');
        }
        await this.prisma.$transaction([
            this.prisma.postReport.create({
                data: { userId, postId: id, reason, details },
            }),
            this.prisma.post.update({
                where: { id },
                data: {
                    reportCount: { increment: 1 },
                    isReported: post.reportCount + 1 >= 5,
                },
            }),
        ]);
        return { message: 'Report submitted' };
    }
    async getFeed(userId, cursor, limit = 20) {
        const safeLimit = Math.min(50, Math.max(1, limit));
        const friendIds = await this.prisma.friendship.findMany({
            where: { OR: [{ userId }, { friendId: userId }] },
            select: {
                userId: true,
                friendId: true,
            },
        });
        const ids = friendIds.flatMap((f) => [f.userId, f.friendId]);
        const uniqueFriendIds = [...new Set(ids)].filter((id) => id !== userId);
        const where = {
            isDeleted: false,
            status: enums_1.PostStatus.PUBLISHED,
            OR: [
                { visibility: enums_1.PostVisibility.PUBLIC },
                { authorId: userId },
                { authorId: { in: uniqueFriendIds }, visibility: enums_1.PostVisibility.FRIENDS },
            ],
        };
        const dbCursor = cursor ? { id: cursor } : undefined;
        const posts = await this.prisma.post.findMany({
            where,
            take: safeLimit + 1,
            ...(dbCursor && { cursor: dbCursor, skip: 1 }),
            orderBy: [
                { isPinned: 'desc' },
                { createdAt: 'desc' },
            ],
            include: this.postInclude(userId),
        });
        const hasNext = posts.length > safeLimit;
        const data = hasNext ? posts.slice(0, safeLimit) : posts;
        const nextCursor = hasNext ? data[data.length - 1]?.id : null;
        return { data, nextCursor, hasNext };
    }
    postInclude(userId) {
        return {
            author: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                    role: true,
                    isOnline: true,
                    level: true,
                },
            },
            _count: {
                select: {
                    comments: { where: { isDeleted: false } },
                    reactions: true,
                    shares: true,
                    saves: { where: { userId } },
                },
            },
            reactions: {
                where: { userId },
                select: { type: true },
                take: 1,
            },
            saves: {
                where: { userId },
                select: { id: true },
                take: 1,
            },
        };
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = PostsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map