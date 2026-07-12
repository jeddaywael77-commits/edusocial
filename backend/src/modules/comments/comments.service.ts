import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { SocketGateway } from '../socket/socket.gateway';
import { SocketEvents } from '../socket/socket.events';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);

  constructor(
    private prisma: PrismaService,
    private socketGateway: SocketGateway,
  ) {}

  async create(postId: string, authorId: string, dto: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.isDeleted) {
      throw new NotFoundException('Post not found');
    }

    let depth = 0;
    if (dto.parentCommentId) {
      const parent = await this.prisma.comment.findUnique({
        where: { id: dto.parentCommentId },
      });
      if (!parent || parent.isDeleted) {
        throw new NotFoundException('Parent comment not found');
      }
      if (parent.postId !== postId) {
        throw new ForbiddenException('Parent comment belongs to different post');
      }
      depth = parent.depth + 1;
      if (depth > 5) {
        throw new ForbiddenException('Maximum nesting depth reached (5)');
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

    if (post.authorId !== authorId) {
      this.socketGateway.broadcastToUser(post.authorId, SocketEvents.FEED_NEW_COMMENT, {
        comment,
        postId,
      });
    }

    return comment;
  }

  async findByPostId(
    postId: string,
    userId: string,
    cursor?: string,
    limit: number = 20,
  ) {
    const safeLimit = Math.min(50, Math.max(1, limit));

    const where: Prisma.CommentWhereInput = {
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

  async findReplies(
    commentId: string,
    userId: string,
    cursor?: string,
    limit: number = 20,
  ) {
    const safeLimit = Math.min(50, Math.max(1, limit));

    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment || comment.isDeleted) {
      throw new NotFoundException('Comment not found');
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

  async update(id: string, userId: string, dto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });

    if (!comment || comment.isDeleted) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
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

  async delete(id: string, userId: string, userRole: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });

    if (!comment || comment.isDeleted) {
      throw new NotFoundException('Comment not found');
    }

    const isOwner = comment.authorId === userId;
    const isAdmin = userRole === 'ADMIN' || userRole === 'MODERATOR';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Not authorized to delete this comment');
    }

    await this.prisma.comment.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    this.logger.log(`Comment soft-deleted: ${id} by ${userId}`);
    return { message: 'Comment deleted successfully' };
  }

  private commentInclude(userId: string) {
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
}
