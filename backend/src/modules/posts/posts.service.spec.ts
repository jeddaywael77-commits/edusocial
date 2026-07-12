import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PrismaService } from '../../database/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
import { SocketEvents } from '../socket/socket.events';
import { PostStatus, PostVisibility } from '../../common/enums';

describe('PostsService', () => {
  let service: PostsService;
  let prisma: any;
  let socketGateway: any;

  const mockUserId = 'user-1';
  const mockPostId = 'post-1';

  const mockPost = {
    id: mockPostId,
    content: 'Hello World',
    type: 'TEXT',
    visibility: 'PUBLIC',
    status: PostStatus.PUBLISHED,
    isDeleted: false,
    isPinned: false,
    images: [],
    video: null,
    pdfUrl: null,
    pdfName: null,
    hashtags: [],
    mentions: [],
    shareCount: 0,
    reportCount: 0,
    isReported: false,
    authorId: mockUserId,
    groupId: null,
    courseId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    author: {
      id: mockUserId,
      name: 'Test User',
      avatar: null,
      role: 'STUDENT',
      isOnline: true,
      level: 1,
    },
    _count: {
      comments: 0,
      reactions: 0,
      shares: 0,
      saves: 0,
    },
    reactions: [],
    saves: [],
  };

  beforeEach(async () => {
    prisma = {
      post: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      postShare: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      postSave: {
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      postReport: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      friendship: {
        findMany: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    socketGateway = {
      broadcastToAll: jest.fn(),
      broadcastToRoom: jest.fn(),
      broadcastToUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: PrismaService, useValue: prisma },
        { provide: SocketGateway, useValue: socketGateway },
      ],
    }).compile();

    service = module.get(PostsService);
  });

  describe('create', () => {
    it('should create a basic post and broadcast to all', async () => {
      prisma.post.create.mockResolvedValue(mockPost);

      const result = await service.create(mockUserId, {
        content: 'Hello World',
      });

      expect(result).toEqual(mockPost);
      expect(prisma.post.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          content: 'Hello World',
          type: 'TEXT',
          visibility: 'PUBLIC',
          status: PostStatus.PUBLISHED,
          images: [],
          hashtags: [],
          mentions: [],
        }),
        include: expect.any(Object),
      });
      expect(socketGateway.broadcastToAll).toHaveBeenCalledWith(
        SocketEvents.FEED_NEW_POST,
        mockPost,
      );
    });

    it('should create a post with mentions and hashtags', async () => {
      const postWithTags = {
        ...mockPost,
        mentions: ['@alice'],
        hashtags: ['#math'],
      };
      prisma.post.create.mockResolvedValue(postWithTags);

      const result = await service.create(mockUserId, {
        content: 'Hello @alice #math',
        mentions: ['@alice'],
        hashtags: ['#math'],
      });

      expect(result.mentions).toEqual(['@alice']);
      expect(result.hashtags).toEqual(['#math']);
      expect(prisma.post.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          mentions: ['@alice'],
          hashtags: ['#math'],
        }),
        include: expect.any(Object),
      });
    });

    it('should broadcast to group room for group posts', async () => {
      const groupPost = { ...mockPost, groupId: 'group-1' };
      prisma.post.create.mockResolvedValue(groupPost);

      await service.create(mockUserId, {
        content: 'Group post',
        groupId: 'group-1',
      });

      expect(socketGateway.broadcastToRoom).toHaveBeenCalledWith(
        'group:group-1',
        SocketEvents.FEED_NEW_POST,
        groupPost,
      );
      expect(socketGateway.broadcastToAll).not.toHaveBeenCalled();
    });

    it('should broadcast to course room for course posts', async () => {
      const coursePost = { ...mockPost, courseId: 'course-1' };
      prisma.post.create.mockResolvedValue(coursePost);

      await service.create(mockUserId, {
        content: 'Course post',
        courseId: 'course-1',
      });

      expect(socketGateway.broadcastToRoom).toHaveBeenCalledWith(
        'course:course-1',
        SocketEvents.FEED_NEW_POST,
        coursePost,
      );
      expect(socketGateway.broadcastToAll).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated posts', async () => {
      const posts = [mockPost];
      prisma.post.findMany.mockResolvedValue(posts);
      prisma.post.count.mockResolvedValue(1);

      const result = await service.findAll(mockUserId, {});

      expect(result.data).toEqual(posts);
      expect(result.meta.total).toBe(1);
      expect(result.meta.hasNext).toBe(false);
      expect(result.meta.nextCursor).toBeNull();
    });

    it('should set hasNext and nextCursor when more posts exist', async () => {
      const posts = Array.from({ length: 21 }, (_, i) => ({
        ...mockPost,
        id: `post-${i}`,
      }));
      prisma.post.findMany.mockResolvedValue(posts);
      prisma.post.count.mockResolvedValue(21);

      const result = await service.findAll(mockUserId, { limit: 20 });

      expect(result.data).toHaveLength(20);
      expect(result.meta.hasNext).toBe(true);
      expect(result.meta.nextCursor).toBe('post-19');
    });

    it('should clamp limit to 1-50 range', async () => {
      prisma.post.findMany.mockResolvedValue([]);
      prisma.post.count.mockResolvedValue(0);

      await service.findAll(mockUserId, { limit: 100 });
      expect(prisma.post.findMany).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ take: 51 }),
      );

      await service.findAll(mockUserId, { limit: -5 });
      expect(prisma.post.findMany).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ take: 2 }),
      );
    });

    it('should filter by authorId', async () => {
      prisma.post.findMany.mockResolvedValue([]);
      prisma.post.count.mockResolvedValue(0);

      await service.findAll(mockUserId, { authorId: 'author-2' });

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ authorId: 'author-2' }),
        }),
      );
    });

    it('should filter by groupId', async () => {
      prisma.post.findMany.mockResolvedValue([]);
      prisma.post.count.mockResolvedValue(0);

      await service.findAll(mockUserId, { groupId: 'group-1' });

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ groupId: 'group-1' }),
        }),
      );
    });

    it('should filter by courseId', async () => {
      prisma.post.findMany.mockResolvedValue([]);
      prisma.post.count.mockResolvedValue(0);

      await service.findAll(mockUserId, { courseId: 'course-1' });

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ courseId: 'course-1' }),
        }),
      );
    });

    it('should filter by hashtag', async () => {
      prisma.post.findMany.mockResolvedValue([]);
      prisma.post.count.mockResolvedValue(0);

      await service.findAll(mockUserId, { hashtag: '#math' });

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ hashtags: { has: '#math' } }),
        }),
      );
    });

    it('should search content and hashtags', async () => {
      prisma.post.findMany.mockResolvedValue([]);
      prisma.post.count.mockResolvedValue(0);

      await service.findAll(mockUserId, { search: 'physics' });

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { content: { contains: 'physics', mode: 'insensitive' } },
              { hashtags: { has: 'physics' } },
            ],
          }),
        }),
      );
    });

    it('should use cursor-based pagination', async () => {
      prisma.post.findMany.mockResolvedValue([]);
      prisma.post.count.mockResolvedValue(0);

      await service.findAll(mockUserId, { cursor: 'post-5' });

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          cursor: { id: 'post-5' },
          skip: 1,
        }),
      );
    });
  });

  describe('findById', () => {
    it('should return a post by id', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);

      const result = await service.findById(mockPostId, mockUserId);

      expect(result).toEqual(mockPost);
      expect(prisma.post.findUnique).toHaveBeenCalledWith({
        where: { id: mockPostId },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException when post does not exist', async () => {
      prisma.post.findUnique.mockResolvedValue(null);

      await expect(service.findById('nonexistent', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when post is deleted', async () => {
      prisma.post.findUnique.mockResolvedValue({
        ...mockPost,
        isDeleted: true,
      });

      await expect(service.findById(mockPostId, mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a post successfully', async () => {
      const updatedPost = { ...mockPost, content: 'Updated content' };
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.post.update.mockResolvedValue(updatedPost);

      const result = await service.update(mockPostId, mockUserId, {
        content: 'Updated content',
      });

      expect(result.content).toBe('Updated content');
      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: mockPostId },
        data: expect.objectContaining({ content: 'Updated content' }),
        include: expect.any(Object),
      });
    });

    it('should throw ForbiddenException when not the owner', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);

      await expect(
        service.update(mockPostId, 'other-user', { content: 'Hacked' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when post does not exist', async () => {
      prisma.post.findUnique.mockResolvedValue(null);

      await expect(
        service.update('nonexistent', mockUserId, { content: 'Nope' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when post is deleted', async () => {
      prisma.post.findUnique.mockResolvedValue({
        ...mockPost,
        isDeleted: true,
      });

      await expect(
        service.update(mockPostId, mockUserId, { content: 'Nope' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should soft delete a post when owner', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.post.update.mockResolvedValue({
        ...mockPost,
        isDeleted: true,
      });

      const result = await service.delete(mockPostId, mockUserId, 'STUDENT');

      expect(result.message).toBe('Post deleted successfully');
      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: mockPostId },
        data: {
          isDeleted: true,
          deletedAt: expect.any(Date),
        },
      });
    });

    it('should soft delete when admin', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.post.update.mockResolvedValue({
        ...mockPost,
        isDeleted: true,
      });

      const result = await service.delete(mockPostId, 'admin-user', 'ADMIN');

      expect(result.message).toBe('Post deleted successfully');
    });

    it('should soft delete when moderator', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.post.update.mockResolvedValue({
        ...mockPost,
        isDeleted: true,
      });

      const result = await service.delete(mockPostId, 'mod-user', 'MODERATOR');

      expect(result.message).toBe('Post deleted successfully');
    });

    it('should throw ForbiddenException when not owner and not admin', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);

      await expect(
        service.delete(mockPostId, 'other-user', 'STUDENT'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when post does not exist', async () => {
      prisma.post.findUnique.mockResolvedValue(null);

      await expect(
        service.delete('nonexistent', mockUserId, 'STUDENT'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when post is already deleted', async () => {
      prisma.post.findUnique.mockResolvedValue({
        ...mockPost,
        isDeleted: true,
      });

      await expect(
        service.delete(mockPostId, mockUserId, 'STUDENT'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('share', () => {
    it('should share a post successfully', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.postShare.findFirst.mockResolvedValue(null);
      prisma.$transaction.mockResolvedValue([
        { id: 'share-1' },
        { ...mockPost, shareCount: 1 },
      ]);

      const result = await service.share(mockPostId, mockUserId);

      expect(result.message).toBe('Post shared successfully');
      expect(prisma.postShare.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          postId: mockPostId,
          note: null,
        },
      });
      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: mockPostId },
        data: { shareCount: { increment: 1 } },
      });
    });

    it('should share with a note', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.postShare.findFirst.mockResolvedValue(null);
      prisma.$transaction.mockResolvedValue([
        { id: 'share-1' },
        { ...mockPost, shareCount: 1 },
      ]);

      await service.share(mockPostId, mockUserId, 'Check this out');

      expect(prisma.postShare.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          postId: mockPostId,
          note: 'Check this out',
        },
      });
    });

    it('should throw ConflictException when already shared', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.postShare.findFirst.mockResolvedValue({
        id: 'share-1',
        userId: mockUserId,
        postId: mockPostId,
      });

      await expect(service.share(mockPostId, mockUserId)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException when post does not exist', async () => {
      prisma.post.findUnique.mockResolvedValue(null);

      await expect(service.share('nonexistent', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when post is deleted', async () => {
      prisma.post.findUnique.mockResolvedValue({
        ...mockPost,
        isDeleted: true,
      });

      await expect(service.share(mockPostId, mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('save / unsave', () => {
    it('should save a post', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.postSave.findUnique.mockResolvedValue(null);
      prisma.postSave.create.mockResolvedValue({});

      const result = await service.save(mockPostId, mockUserId);

      expect(result).toEqual({ saved: true });
      expect(prisma.postSave.create).toHaveBeenCalledWith({
        data: { userId: mockUserId, postId: mockPostId },
      });
    });

    it('should unsave a previously saved post', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.postSave.findUnique.mockResolvedValue({
        id: 'save-1',
        userId: mockUserId,
        postId: mockPostId,
      });
      prisma.postSave.delete.mockResolvedValue({});

      const result = await service.save(mockPostId, mockUserId);

      expect(result).toEqual({ saved: false });
      expect(prisma.postSave.delete).toHaveBeenCalledWith({
        where: { userId_postId: { userId: mockUserId, postId: mockPostId } },
      });
    });

    it('should throw NotFoundException when post does not exist', async () => {
      prisma.post.findUnique.mockResolvedValue(null);

      await expect(service.save('nonexistent', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when post is deleted', async () => {
      prisma.post.findUnique.mockResolvedValue({
        ...mockPost,
        isDeleted: true,
      });

      await expect(service.save(mockPostId, mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('report', () => {
    it('should report a post successfully', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.postReport.findUnique.mockResolvedValue(null);
      prisma.$transaction.mockResolvedValue([{}, {}]);

      const result = await service.report(
        mockPostId,
        mockUserId,
        'SPAM',
        'Too many links',
      );

      expect(result.message).toBe('Report submitted');
      expect(prisma.postReport.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          postId: mockPostId,
          reason: 'SPAM',
          details: 'Too many links',
        },
      });
    });

    it('should auto-flag post when report count reaches threshold', async () => {
      const reportedPost = { ...mockPost, reportCount: 4 };
      prisma.post.findUnique.mockResolvedValue(reportedPost);
      prisma.postReport.findUnique.mockResolvedValue(null);
      prisma.$transaction.mockResolvedValue([{}, {}]);

      await service.report(mockPostId, mockUserId, 'SPAM');

      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: mockPostId },
        data: {
          reportCount: { increment: 1 },
          isReported: true,
        },
      });
    });

    it('should not auto-flag post when below threshold', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.postReport.findUnique.mockResolvedValue(null);
      prisma.$transaction.mockResolvedValue([{}, {}]);

      await service.report(mockPostId, mockUserId, 'SPAM');

      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: mockPostId },
        data: {
          reportCount: { increment: 1 },
          isReported: false,
        },
      });
    });

    it('should throw ConflictException when already reported', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.postReport.findUnique.mockResolvedValue({
        id: 'report-1',
        userId: mockUserId,
        postId: mockPostId,
      });

      await expect(
        service.report(mockPostId, mockUserId, 'SPAM'),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException when post does not exist', async () => {
      prisma.post.findUnique.mockResolvedValue(null);

      await expect(
        service.report('nonexistent', mockUserId, 'SPAM'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when post is deleted', async () => {
      prisma.post.findUnique.mockResolvedValue({
        ...mockPost,
        isDeleted: true,
      });

      await expect(
        service.report(mockPostId, mockUserId, 'SPAM'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getFeed', () => {
    it('should return paginated feed posts', async () => {
      prisma.friendship.findMany.mockResolvedValue([]);
      prisma.post.findMany.mockResolvedValue([mockPost]);

      const result = await service.getFeed(mockUserId);

      expect(result.data).toEqual([mockPost]);
      expect(result.hasNext).toBe(false);
      expect(result.nextCursor).toBeNull();
    });

    it('should include public posts, own posts, and friends-only posts', async () => {
      prisma.friendship.findMany.mockResolvedValue([
        { userId: mockUserId, friendId: 'friend-1' },
        { userId: 'friend-2', friendId: mockUserId },
      ]);
      prisma.post.findMany.mockResolvedValue([]);

      await service.getFeed(mockUserId);

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { visibility: PostVisibility.PUBLIC },
              { authorId: mockUserId },
              {
                authorId: {
                  in: ['friend-1', 'friend-2'],
                },
                visibility: PostVisibility.FRIENDS,
              },
            ],
          }),
        }),
      );
    });

    it('should exclude current user from friend IDs', async () => {
      prisma.friendship.findMany.mockResolvedValue([
        { userId: mockUserId, friendId: mockUserId },
      ]);
      prisma.post.findMany.mockResolvedValue([]);

      await service.getFeed(mockUserId);

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { visibility: PostVisibility.PUBLIC },
              { authorId: mockUserId },
              {
                authorId: { in: [] },
                visibility: PostVisibility.FRIENDS,
              },
            ],
          }),
        }),
      );
    });

    it('should set hasNext and nextCursor when more posts exist', async () => {
      const posts = Array.from({ length: 21 }, (_, i) => ({
        ...mockPost,
        id: `post-${i}`,
      }));
      prisma.friendship.findMany.mockResolvedValue([]);
      prisma.post.findMany.mockResolvedValue(posts);

      const result = await service.getFeed(mockUserId, undefined, 20);

      expect(result.data).toHaveLength(20);
      expect(result.hasNext).toBe(true);
      expect(result.nextCursor).toBe('post-19');
    });

    it('should use cursor when provided', async () => {
      prisma.friendship.findMany.mockResolvedValue([]);
      prisma.post.findMany.mockResolvedValue([]);

      await service.getFeed(mockUserId, 'post-5', 10);

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          cursor: { id: 'post-5' },
          skip: 1,
        }),
      );
    });

    it('should clamp limit to 1-50 range', async () => {
      prisma.friendship.findMany.mockResolvedValue([]);
      prisma.post.findMany.mockResolvedValue([]);

      await service.getFeed(mockUserId, undefined, 100);
      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 51 }),
      );
    });

    it('should only show non-deleted, published posts', async () => {
      prisma.friendship.findMany.mockResolvedValue([]);
      prisma.post.findMany.mockResolvedValue([]);

      await service.getFeed(mockUserId);

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isDeleted: false,
            status: PostStatus.PUBLISHED,
          }),
        }),
      );
    });
  });

  describe('pin', () => {
    it('should toggle pin on a post', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);
      prisma.post.update.mockResolvedValue({
        ...mockPost,
        isPinned: true,
      });

      const result = await service.pin(mockPostId, mockUserId);

      expect(result.isPinned).toBe(true);
      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: mockPostId },
        data: { isPinned: true },
        include: expect.any(Object),
      });
    });

    it('should throw ForbiddenException when not the owner', async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost);

      await expect(service.pin(mockPostId, 'other-user')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException when post does not exist', async () => {
      prisma.post.findUnique.mockResolvedValue(null);

      await expect(service.pin('nonexistent', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
