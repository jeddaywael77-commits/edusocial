import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ToggleReactionDto } from './dto/toggle-reaction.dto';
import { ReactionType } from '../../common/enums';
import { SocketGateway } from '../socket/socket.gateway';
import { SocketEvents } from '../socket/socket.events';

@Injectable()
export class LikesService {
  private readonly logger = new Logger(LikesService.name);

  constructor(
    private prisma: PrismaService,
    private socketGateway: SocketGateway,
  ) {}

  async toggle(userId: string, dto: ToggleReactionDto) {
    if (!dto.postId && !dto.commentId) {
      throw new BadRequestException('Either postId or commentId is required');
    }
    if (dto.postId && dto.commentId) {
      throw new BadRequestException('Provide only postId or commentId, not both');
    }

    if (dto.postId) {
      return this.togglePostReaction(userId, dto.postId, dto.type);
    }
    return this.toggleCommentReaction(userId, dto.commentId!, dto.type);
  }

  private async togglePostReaction(
    userId: string,
    postId: string,
    type: ReactionType,
  ) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.isDeleted) {
      throw new NotFoundException('Post not found');
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

    if (post.authorId !== userId) {
      this.socketGateway.broadcastToUser(post.authorId, SocketEvents.FEED_NEW_REACTION, {
        postId,
        type,
        userId,
      });
    }

    return { action: 'added', type };
  }

  private async toggleCommentReaction(
    userId: string,
    commentId: string,
    type: ReactionType,
  ) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment || comment.isDeleted) {
      throw new NotFoundException('Comment not found');
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

  async getPostReactions(postId: string) {
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

  async getCommentReactions(commentId: string) {
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

  async getPostReactors(postId: string, type?: ReactionType, limit: number = 20) {
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
}
