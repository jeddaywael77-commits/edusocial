import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { LikesService } from './likes.service';
import { PrismaService } from '../../database/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
import { SocketEvents } from '../socket/socket.events';
import { ReactionType } from '../../common/enums';
import { ToggleReactionDto } from './dto/toggle-reaction.dto';

const mockPrisma = {
  post: {
    findUnique: jest.fn(),
  },
  comment: {
    findUnique: jest.fn(),
  },
  reaction: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    groupBy: jest.fn(),
  },
  commentReaction: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    groupBy: jest.fn(),
  },
};

const mockSocketGateway = {
  broadcastToUser: jest.fn(),
};

describe('LikesService', () => {
  let service: LikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: SocketGateway, useValue: mockSocketGateway },
      ],
    }).compile();

    service = module.get<LikesService>(LikesService);
    jest.clearAllMocks();
  });

  describe('toggle', () => {
    it('should throw if neither postId nor commentId provided', async () => {
      const dto: ToggleReactionDto = { type: ReactionType.LIKE };
      await expect(service.toggle('user-1', dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if both postId and commentId provided', async () => {
      const dto: ToggleReactionDto = {
        type: ReactionType.LIKE,
        postId: 'post-1',
        commentId: 'comment-1',
      };
      await expect(service.toggle('user-1', dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('togglePostReaction', () => {
    it('should add a new reaction to a post', async () => {
      mockPrisma.post.findUnique.mockResolvedValue({
        id: 'post-1',
        authorId: 'author-1',
        isDeleted: false,
      });
      mockPrisma.reaction.findUnique.mockResolvedValue(null);
      mockPrisma.reaction.create.mockResolvedValue({});

      const result = await service.toggle('user-1', {
        type: ReactionType.LIKE,
        postId: 'post-1',
      });

      expect(result).toEqual({ action: 'added', type: ReactionType.LIKE });
      expect(mockPrisma.reaction.create).toHaveBeenCalledWith({
        data: { userId: 'user-1', postId: 'post-1', type: ReactionType.LIKE },
      });
      expect(mockSocketGateway.broadcastToUser).toHaveBeenCalledWith(
        'author-1',
        SocketEvents.FEED_NEW_REACTION,
        { postId: 'post-1', type: ReactionType.LIKE, userId: 'user-1' },
      );
    });

    it('should not notify author when user reacts to own post', async () => {
      mockPrisma.post.findUnique.mockResolvedValue({
        id: 'post-1',
        authorId: 'user-1',
        isDeleted: false,
      });
      mockPrisma.reaction.findUnique.mockResolvedValue(null);
      mockPrisma.reaction.create.mockResolvedValue({});

      await service.toggle('user-1', {
        type: ReactionType.LIKE,
        postId: 'post-1',
      });

      expect(mockSocketGateway.broadcastToUser).not.toHaveBeenCalled();
    });

    it('should remove reaction when same type toggled again', async () => {
      mockPrisma.post.findUnique.mockResolvedValue({
        id: 'post-1',
        authorId: 'author-1',
        isDeleted: false,
      });
      mockPrisma.reaction.findUnique.mockResolvedValue({
        userId: 'user-1',
        postId: 'post-1',
        type: ReactionType.LIKE,
      });
      mockPrisma.reaction.delete.mockResolvedValue({});

      const result = await service.toggle('user-1', {
        type: ReactionType.LIKE,
        postId: 'post-1',
      });

      expect(result).toEqual({ action: 'removed', type: null });
      expect(mockPrisma.reaction.delete).toHaveBeenCalledWith({
        where: { userId_postId: { userId: 'user-1', postId: 'post-1' } },
      });
    });

    it('should update reaction type when different type provided', async () => {
      mockPrisma.post.findUnique.mockResolvedValue({
        id: 'post-1',
        authorId: 'author-1',
        isDeleted: false,
      });
      mockPrisma.reaction.findUnique.mockResolvedValue({
        userId: 'user-1',
        postId: 'post-1',
        type: ReactionType.LIKE,
      });
      mockPrisma.reaction.update.mockResolvedValue({
        type: ReactionType.LOVE,
      });

      const result = await service.toggle('user-1', {
        type: ReactionType.LOVE,
        postId: 'post-1',
      });

      expect(result).toEqual({ action: 'updated', type: ReactionType.LOVE });
      expect(mockPrisma.reaction.update).toHaveBeenCalledWith({
        where: { userId_postId: { userId: 'user-1', postId: 'post-1' } },
        data: { type: ReactionType.LOVE },
      });
    });

    it('should throw NotFoundException if post does not exist', async () => {
      mockPrisma.post.findUnique.mockResolvedValue(null);

      await expect(
        service.toggle('user-1', { type: ReactionType.LIKE, postId: 'post-1' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if post is deleted', async () => {
      mockPrisma.post.findUnique.mockResolvedValue({
        id: 'post-1',
        isDeleted: true,
      });

      await expect(
        service.toggle('user-1', { type: ReactionType.LIKE, postId: 'post-1' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleCommentReaction', () => {
    it('should add a new reaction to a comment', async () => {
      mockPrisma.comment.findUnique.mockResolvedValue({
        id: 'comment-1',
        isDeleted: false,
      });
      mockPrisma.commentReaction.findUnique.mockResolvedValue(null);
      mockPrisma.commentReaction.create.mockResolvedValue({});

      const result = await service.toggle('user-1', {
        type: ReactionType.LOVE,
        commentId: 'comment-1',
      });

      expect(result).toEqual({ action: 'added', type: ReactionType.LOVE });
      expect(mockPrisma.commentReaction.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          commentId: 'comment-1',
          type: ReactionType.LOVE,
        },
      });
    });

    it('should remove comment reaction when same type toggled', async () => {
      mockPrisma.comment.findUnique.mockResolvedValue({
        id: 'comment-1',
        isDeleted: false,
      });
      mockPrisma.commentReaction.findUnique.mockResolvedValue({
        userId: 'user-1',
        commentId: 'comment-1',
        type: ReactionType.LOVE,
      });
      mockPrisma.commentReaction.delete.mockResolvedValue({});

      const result = await service.toggle('user-1', {
        type: ReactionType.LOVE,
        commentId: 'comment-1',
      });

      expect(result).toEqual({ action: 'removed', type: null });
    });

    it('should update comment reaction type', async () => {
      mockPrisma.comment.findUnique.mockResolvedValue({
        id: 'comment-1',
        isDeleted: false,
      });
      mockPrisma.commentReaction.findUnique.mockResolvedValue({
        userId: 'user-1',
        commentId: 'comment-1',
        type: ReactionType.LIKE,
      });
      mockPrisma.commentReaction.update.mockResolvedValue({
        type: ReactionType.HAHA,
      });

      const result = await service.toggle('user-1', {
        type: ReactionType.HAHA,
        commentId: 'comment-1',
      });

      expect(result).toEqual({ action: 'updated', type: ReactionType.HAHA });
    });

    it('should throw NotFoundException if comment does not exist', async () => {
      mockPrisma.comment.findUnique.mockResolvedValue(null);

      await expect(
        service.toggle('user-1', {
          type: ReactionType.LIKE,
          commentId: 'comment-1',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if comment is deleted', async () => {
      mockPrisma.comment.findUnique.mockResolvedValue({
        id: 'comment-1',
        isDeleted: true,
      });

      await expect(
        service.toggle('user-1', {
          type: ReactionType.LIKE,
          commentId: 'comment-1',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPostReactions', () => {
    it('should return grouped reactions with total count', async () => {
      mockPrisma.reaction.groupBy.mockResolvedValue([
        { type: ReactionType.LIKE, _count: { type: 5 } },
        { type: ReactionType.LOVE, _count: { type: 3 } },
        { type: ReactionType.HAHA, _count: { type: 1 } },
      ]);

      const result = await service.getPostReactions('post-1');

      expect(result).toEqual({
        total: 9,
        breakdown: [
          { type: ReactionType.LIKE, count: 5 },
          { type: ReactionType.LOVE, count: 3 },
          { type: ReactionType.HAHA, count: 1 },
        ],
      });
    });

    it('should return zero total when no reactions exist', async () => {
      mockPrisma.reaction.groupBy.mockResolvedValue([]);

      const result = await service.getPostReactions('post-1');

      expect(result).toEqual({ total: 0, breakdown: [] });
    });
  });

  describe('getCommentReactions', () => {
    it('should return grouped comment reactions', async () => {
      mockPrisma.commentReaction.groupBy.mockResolvedValue([
        { type: ReactionType.LIKE, _count: { type: 2 } },
      ]);

      const result = await service.getCommentReactions('comment-1');

      expect(result).toEqual({
        total: 2,
        breakdown: [{ type: ReactionType.LIKE, count: 2 }],
      });
    });
  });

  describe('getPostReactors', () => {
    it('should return reactors with user info', async () => {
      const reactors = [
        {
          type: ReactionType.LIKE,
          createdAt: new Date('2026-01-01'),
          user: { id: 'user-1', name: 'Alice', avatar: null, level: 5 },
        },
      ];
      mockPrisma.reaction.findMany.mockResolvedValue(reactors);

      const result = await service.getPostReactors('post-1');

      expect(result).toEqual(reactors);
      expect(mockPrisma.reaction.findMany).toHaveBeenCalledWith({
        where: { postId: 'post-1' },
        take: 20,
        orderBy: { createdAt: 'desc' },
        select: {
          type: true,
          createdAt: true,
          user: {
            select: { id: true, name: true, avatar: true, level: true },
          },
        },
      });
    });

    it('should filter by reaction type when provided', async () => {
      mockPrisma.reaction.findMany.mockResolvedValue([]);

      await service.getPostReactors('post-1', ReactionType.LOVE);

      expect(mockPrisma.reaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { postId: 'post-1', type: ReactionType.LOVE },
        }),
      );
    });

    it('should respect custom limit', async () => {
      mockPrisma.reaction.findMany.mockResolvedValue([]);

      await service.getPostReactors('post-1', undefined, 5);

      expect(mockPrisma.reaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 5 }),
      );
    });
  });
});
