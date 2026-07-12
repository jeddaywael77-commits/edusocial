import { Test, TestingModule } from '@nestjs/testing';
import { StoriesService } from './stories.service';
import { PrismaService } from '../../database/prisma.service';

describe('StoriesService', () => {
  let service: StoriesService;
  let prisma: {
    story: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      delete: jest.Mock;
    };
    storyViewer: {
      upsert: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      story: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
      storyViewer: {
        upsert: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [StoriesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(StoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a story with a 24h expiry', async () => {
      const authorId = 'author-1';
      const data = { image: 'img.png', text: 'Hello' };
      const created = {
        id: 'story-1',
        image: 'img.png',
        text: 'Hello',
        authorId,
        expiresAt: new Date(),
      };
      prisma.story.create.mockResolvedValue(created);

      const result = await service.create(authorId, data);

      expect(prisma.story.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            image: data.image,
            text: data.text,
            authorId,
          }),
          include: {
            author: { select: { id: true, name: true, avatar: true } },
          },
        }),
      );

      const callArg = prisma.story.create.mock.calls[0][0].data;
      const diff = callArg.expiresAt.getTime() - Date.now();
      expect(diff).toBeGreaterThan(23 * 60 * 60 * 1000);
      expect(diff).toBeLessThanOrEqual(24 * 60 * 60 * 1000);

      expect(result).toBe(created);
    });

    it('should create a story without text', async () => {
      prisma.story.create.mockResolvedValue({});

      await service.create('author-1', { image: 'img.png' });

      expect(prisma.story.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ text: undefined }),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return non-expired stories ordered by creation desc', async () => {
      const stories = [{ id: 's1' }, { id: 's2' }];
      prisma.story.findMany.mockResolvedValue(stories);

      const result = await service.findAll();

      expect(prisma.story.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { expiresAt: { gt: expect.any(Date) } },
          orderBy: { createdAt: 'desc' },
        }),
      );
      expect(result).toBe(stories);
    });
  });

  describe('findById', () => {
    it('should return a story with author and viewers', async () => {
      const story = { id: 's1', author: {}, viewers: [] };
      prisma.story.findUnique.mockResolvedValue(story);

      const result = await service.findById('s1');

      expect(prisma.story.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 's1' },
          include: expect.objectContaining({
            author: { select: { id: true, name: true, avatar: true } },
            viewers: {
              include: { user: { select: { id: true, name: true } } },
            },
          }),
        }),
      );
      expect(result).toBe(story);
    });

    it('should return null when story is not found', async () => {
      prisma.story.findUnique.mockResolvedValue(null);

      expect(await service.findById('nonexistent')).toBeNull();
    });
  });

  describe('markAsViewed', () => {
    it('should upsert a story viewer record', async () => {
      const viewer = { storyId: 's1', userId: 'u1', viewedAt: new Date() };
      prisma.storyViewer.upsert.mockResolvedValue(viewer);

      const result = await service.markAsViewed('s1', 'u1');

      expect(prisma.storyViewer.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { storyId_userId: { storyId: 's1', userId: 'u1' } },
          update: { viewedAt: expect.any(Date) },
          create: { storyId: 's1', userId: 'u1' },
        }),
      );
      expect(result).toBe(viewer);
    });
  });

  describe('delete', () => {
    it('should delete the story when author matches', async () => {
      const story = { id: 's1', authorId: 'u1' };
      prisma.story.findUnique.mockResolvedValue(story);
      prisma.story.delete.mockResolvedValue(story);

      const result = await service.delete('s1', 'u1');

      expect(prisma.story.delete).toHaveBeenCalledWith({ where: { id: 's1' } });
      expect(result).toBe(story);
    });

    it('should throw when story does not exist', async () => {
      prisma.story.findUnique.mockResolvedValue(null);

      await expect(service.delete('s1', 'u1')).rejects.toThrow(
        'Not authorized',
      );
    });

    it('should throw when userId does not match authorId', async () => {
      prisma.story.findUnique.mockResolvedValue({
        id: 's1',
        authorId: 'other',
      });

      await expect(service.delete('s1', 'u1')).rejects.toThrow(
        'Not authorized',
      );
    });
  });
});
