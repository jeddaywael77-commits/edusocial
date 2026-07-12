import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { PrismaService } from '../../database/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
import { SocketEvents } from '../socket/socket.events';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('CommentsService', () => {
  let service: CommentsService;
  let prisma: any;
  let socketGateway: any;

  const mockPost = {
    id: 'post-1',
    authorId: 'author-1',
    isDeleted: false,
  };

  const mockComment = {
    id: 'comment-1',
    content: 'Test comment',
    authorId: 'user-1',
    postId: 'post-1',
    parentId: null,
    depth: 0,
    mentions: [],
    isDeleted: false,
    isEdited: false,
    createdAt: new Date('2026-01-01'),
    deletedAt: null,
    author: {
      id: 'user-1',
      name: 'User',
      avatar: null,
      role: 'USER',
      level: 1,
    },
    reactions: [],
  };

  beforeEach(async () => {
    prisma = {
      post: {
        findUnique: jest.fn(),
      },
      comment: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
    };

    socketGateway = {
      broadcastToUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: PrismaService, useValue: prisma },
        { provide: SocketGateway, useValue: socketGateway },
      ],
    }).compile();

    service = module.get(CommentsService);
  });

  describe('create', () => {
    const createDto = { content: 'Great post!' };

    it('should create a top-level comment successfully', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.comment.create.mockResolvedValue(mockComment);

      const result = await service.create('post-1', 'user-1', createDto);

      expect(prisma.comment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            content: 'Great post!',
            authorId: 'user-1',
            postId: 'post-1',
            parentId: null,
            depth: 0,
            mentions: [],
          }),
        }),
      );
      expect(result.id).toBe('comment-1');
    });

    it('should broadcast to post author when comment is from a different user', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.comment.create.mockResolvedValue(mockComment);

      await service.create('post-1', 'user-2', createDto);

      expect(socketGateway.broadcastToUser).toHaveBeenCalledWith(
        'author-1',
        SocketEvents.FEED_NEW_COMMENT,
        { comment: mockComment, postId: 'post-1' },
      );
    });

    it('should not broadcast when author comments on own post', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.comment.create.mockResolvedValue({
        ...mockComment,
        authorId: 'author-1',
      });

      await service.create('post-1', 'author-1', createDto);

      expect(socketGateway.broadcastToUser).not.toHaveBeenCalled();
    });

    it('should create a reply with correct depth', async () => {
      const parentComment = { ...mockComment, depth: 1 };
      const replyDto = { content: 'Reply', parentCommentId: 'comment-1' };
      const replyComment = {
        ...mockComment,
        id: 'comment-2',
        depth: 2,
        parentId: 'comment-1',
      };

      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.comment.findUnique.mockResolvedValue(parentComment);
      prisma.comment.create.mockResolvedValue(replyComment);

      const result = await service.create('post-1', 'user-1', replyDto);

      expect(prisma.comment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ depth: 2, parentId: 'comment-1' }),
        }),
      );
      expect(result.depth).toBe(2);
    });

    it('should throw NotFoundException when post not found', async () => {
      prisma.post.findUnique.mockResolvedValue(null);

      await expect(
        service.create('nonexistent', 'user-1', createDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when post is deleted', async () => {
      prisma.post.findUnique.mockResolvedValue({
        ...mockPost,
        isDeleted: true,
      });

      await expect(
        service.create('post-1', 'user-1', createDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when parent comment not found', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.comment.findUnique.mockResolvedValue(null);

      await expect(
        service.create('post-1', 'user-1', {
          content: 'Reply',
          parentCommentId: 'nonexistent',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when parent comment is deleted', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.comment.findUnique.mockResolvedValue({
        ...mockComment,
        isDeleted: true,
      });

      await expect(
        service.create('post-1', 'user-1', {
          content: 'Reply',
          parentCommentId: 'comment-1',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when parent comment belongs to different post', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.comment.findUnique.mockResolvedValue({
        ...mockComment,
        postId: 'other-post',
      });

      await expect(
        service.create('post-1', 'user-1', {
          content: 'Reply',
          parentCommentId: 'comment-1',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when max nesting depth exceeded', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.comment.findUnique.mockResolvedValue({ ...mockComment, depth: 5 });

      await expect(
        service.create('post-1', 'user-1', {
          content: 'Reply',
          parentCommentId: 'comment-1',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should pass mentions to comment create', async () => {
      const dtoWithMentions = { content: 'Hello @user2', mentions: ['user-2'] };
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.comment.create.mockResolvedValue(mockComment);

      await service.create('post-1', 'user-1', dtoWithMentions);

      expect(prisma.comment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ mentions: ['user-2'] }),
        }),
      );
    });
  });

  describe('findByPostId', () => {
    it('should return paginated comments with cursor', async () => {
      const comments = [
        { ...mockComment },
        { ...mockComment, id: 'comment-2' },
      ];
      prisma.comment.findMany.mockResolvedValue(comments);

      const result = await service.findByPostId(
        'post-1',
        'user-1',
        'cursor-1',
        10,
      );

      expect(prisma.comment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { postId: 'post-1', isDeleted: false, parentId: null },
          take: 11,
          cursor: { id: 'cursor-1' },
          skip: 1,
        }),
      );
      expect(result.data).toHaveLength(2);
      expect(result.hasNext).toBe(false);
      expect(result.nextCursor).toBeNull();
    });

    it('should detect hasNext when extra item returned', async () => {
      const comments = Array.from({ length: 21 }, (_, i) => ({
        ...mockComment,
        id: `comment-${i}`,
      }));
      prisma.comment.findMany.mockResolvedValue(comments);

      const result = await service.findByPostId(
        'post-1',
        'user-1',
        undefined,
        20,
      );

      expect(result.data).toHaveLength(20);
      expect(result.hasNext).toBe(true);
      expect(result.nextCursor).toBe('comment-19');
    });

    it('should clamp limit between 1 and 50', async () => {
      prisma.comment.findMany.mockResolvedValue([]);

      await service.findByPostId('post-1', 'user-1', undefined, 100);

      expect(prisma.comment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 51 }),
      );

      await service.findByPostId('post-1', 'user-1', undefined, 0);

      expect(prisma.comment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 2 }),
      );
    });

    it('should include nested replies limited to 3', async () => {
      prisma.comment.findMany.mockResolvedValue([
        { ...mockComment, replies: [] },
      ]);

      await service.findByPostId('post-1', 'user-1');

      expect(prisma.comment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.objectContaining({
            replies: expect.objectContaining({ take: 3 }),
          }),
        }),
      );
    });
  });

  describe('findReplies', () => {
    it('should return paginated replies for a comment', async () => {
      const replies = [
        { ...mockComment, id: 'reply-1', parentId: 'comment-1' },
        { ...mockComment, id: 'reply-2', parentId: 'comment-1' },
      ];
      prisma.comment.findUnique.mockResolvedValue(mockComment);
      prisma.comment.findMany.mockResolvedValue(replies);

      const result = await service.findReplies('comment-1', 'user-1');

      expect(result.data).toHaveLength(2);
      expect(result.hasNext).toBe(false);
    });

    it('should use cursor for pagination', async () => {
      prisma.comment.findUnique.mockResolvedValue(mockComment);
      prisma.comment.findMany.mockResolvedValue([]);

      await service.findReplies('comment-1', 'user-1', 'reply-5', 10);

      expect(prisma.comment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          cursor: { id: 'reply-5' },
          skip: 1,
          take: 11,
        }),
      );
    });

    it('should throw NotFoundException when comment not found', async () => {
      prisma.comment.findUnique.mockResolvedValue(null);

      await expect(
        service.findReplies('nonexistent', 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when comment is deleted', async () => {
      prisma.comment.findUnique.mockResolvedValue({
        ...mockComment,
        isDeleted: true,
      });

      await expect(service.findReplies('comment-1', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should detect hasNext for replies', async () => {
      prisma.comment.findUnique.mockResolvedValue(mockComment);
      const replies = Array.from({ length: 21 }, (_, i) => ({
        ...mockComment,
        id: `reply-${i}`,
        parentId: 'comment-1',
      }));
      prisma.comment.findMany.mockResolvedValue(replies);

      const result = await service.findReplies(
        'comment-1',
        'user-1',
        undefined,
        20,
      );

      expect(result.data).toHaveLength(20);
      expect(result.hasNext).toBe(true);
      expect(result.nextCursor).toBe('reply-19');
    });
  });

  describe('update', () => {
    it('should update a comment successfully', async () => {
      const updatedComment = {
        ...mockComment,
        content: 'Updated',
        isEdited: true,
      };
      prisma.comment.findUnique.mockResolvedValue(mockComment);
      prisma.comment.update.mockResolvedValue(updatedComment);

      const result = await service.update('comment-1', 'user-1', {
        content: 'Updated',
      });

      expect(result.content).toBe('Updated');
      expect(result.isEdited).toBe(true);
      expect(prisma.comment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ content: 'Updated', isEdited: true }),
        }),
      );
    });

    it('should throw ForbiddenException when not the owner', async () => {
      prisma.comment.findUnique.mockResolvedValue(mockComment);

      await expect(
        service.update('comment-1', 'user-2', { content: 'Hacked' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when comment not found', async () => {
      prisma.comment.findUnique.mockResolvedValue(null);

      await expect(
        service.update('nonexistent', 'user-1', { content: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when comment is deleted', async () => {
      prisma.comment.findUnique.mockResolvedValue({
        ...mockComment,
        isDeleted: true,
      });

      await expect(
        service.update('comment-1', 'user-1', { content: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should soft delete when owner', async () => {
      prisma.comment.findUnique.mockResolvedValue(mockComment);
      prisma.comment.update.mockResolvedValue({});

      const result = await service.delete('comment-1', 'user-1', 'USER');

      expect(result.message).toBe('Comment deleted successfully');
      expect(prisma.comment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'comment-1' },
          data: expect.objectContaining({
            isDeleted: true,
            deletedAt: expect.any(Date),
          }),
        }),
      );
    });

    it('should soft delete when user is ADMIN', async () => {
      prisma.comment.findUnique.mockResolvedValue(mockComment);
      prisma.comment.update.mockResolvedValue({});

      const result = await service.delete('comment-1', 'admin-user', 'ADMIN');

      expect(result.message).toBe('Comment deleted successfully');
    });

    it('should soft delete when user is MODERATOR', async () => {
      prisma.comment.findUnique.mockResolvedValue(mockComment);
      prisma.comment.update.mockResolvedValue({});

      const result = await service.delete('comment-1', 'mod-user', 'MODERATOR');

      expect(result.message).toBe('Comment deleted successfully');
    });

    it('should throw ForbiddenException when not owner and not admin/mod', async () => {
      prisma.comment.findUnique.mockResolvedValue(mockComment);

      await expect(
        service.delete('comment-1', 'user-2', 'USER'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when comment not found', async () => {
      prisma.comment.findUnique.mockResolvedValue(null);

      await expect(
        service.delete('nonexistent', 'user-1', 'USER'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when comment is already deleted', async () => {
      prisma.comment.findUnique.mockResolvedValue({
        ...mockComment,
        isDeleted: true,
      });

      await expect(
        service.delete('comment-1', 'user-1', 'USER'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
