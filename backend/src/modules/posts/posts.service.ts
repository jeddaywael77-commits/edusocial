import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { PostVisibility, PostStatus } from '../../common/enums';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(private prisma: PrismaService) {}

  async create(authorId: string, dto: CreatePostDto) {
    const data: Prisma.PostCreateInput = {
      content: dto.content,
      type: dto.type || 'TEXT',
      visibility: dto.visibility || 'PUBLIC',
      status: PostStatus.PUBLISHED,
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

  async findAll(userId: string, query: QueryPostsDto) {
    const limit = Math.min(50, Math.max(1, query.limit || 20));

    const where: Prisma.PostWhereInput = {
      isDeleted: false,
      status: PostStatus.PUBLISHED,
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

  async findTrending(userId: string, limit: number = 10) {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    const posts = await this.prisma.post.findMany({
      where: {
        isDeleted: false,
        status: PostStatus.PUBLISHED,
        visibility: PostVisibility.PUBLIC,
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

  async findById(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: this.postInclude(userId),
    });

    if (!post || post.isDeleted) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(id: string, userId: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) throw new NotFoundException('Post not found');
    if (post.isDeleted) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own posts');
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

  async delete(id: string, userId: string, userRole: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) throw new NotFoundException('Post not found');
    if (post.isDeleted) throw new NotFoundException('Post not found');

    const isOwner = post.authorId === userId;
    const isAdmin = userRole === 'ADMIN' || userRole === 'MODERATOR';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Not authorized to delete this post');
    }

    await this.prisma.post.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    this.logger.log(`Post soft-deleted: ${id} by ${userId}`);
    return { message: 'Post deleted successfully' };
  }

  async pin(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only pin your own posts');
    }

    const updated = await this.prisma.post.update({
      where: { id },
      data: { isPinned: !post.isPinned },
      include: this.postInclude(userId),
    });

    return updated;
  }

  async share(id: string, userId: string, note?: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post || post.isDeleted) {
      throw new NotFoundException('Post not found');
    }

    const existingShare = await this.prisma.postShare.findFirst({
      where: { userId, postId: id },
    });

    if (existingShare) {
      throw new ConflictException('You already shared this post');
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

  async save(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post || post.isDeleted) throw new NotFoundException('Post not found');

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

  async report(id: string, userId: string, reason: string, details?: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post || post.isDeleted) throw new NotFoundException('Post not found');

    const existing = await this.prisma.postReport.findUnique({
      where: { userId_postId: { userId, postId: id } },
    });

    if (existing) {
      throw new ConflictException('You already reported this post');
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

  async getFeed(userId: string, cursor?: string, limit: number = 20) {
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

    const where: Prisma.PostWhereInput = {
      isDeleted: false,
      status: PostStatus.PUBLISHED,
      OR: [
        { visibility: PostVisibility.PUBLIC },
        { authorId: userId },
        { authorId: { in: uniqueFriendIds }, visibility: PostVisibility.FRIENDS },
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

  private postInclude(userId: string): Prisma.PostInclude {
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
}
