import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { PrismaService } from '../../database/prisma.service';
import { MediaService } from '../media/media.service';

describe('UploadService', () => {
  let service: UploadService;
  let prisma: Record<string, any>;
  let mediaService: Record<string, any>;

  beforeEach(async () => {
    prisma = {
      media: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    mediaService = {
      upload: jest.fn().mockResolvedValue({
        id: 'm1',
        url: 'http://test.com/file.jpg',
        mimeType: 'image/jpeg',
      }),
      findUserMedia: jest
        .fn()
        .mockResolvedValue({ data: [], meta: { total: 0, page: 1 } }),
      getStats: jest.fn().mockResolvedValue({ totalMedia: 0, totalSize: 0 }),
      findById: jest
        .fn()
        .mockResolvedValue({ id: 'm1', url: 'http://test.com/file.jpg' }),
      delete: jest.fn().mockResolvedValue({ success: true }),
      bulkDelete: jest.fn().mockResolvedValue([]),
      getSignedUrl: jest.fn().mockResolvedValue({ url: 'http://signed.url' }),
      replace: jest.fn().mockResolvedValue({ id: 'm1' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        { provide: PrismaService, useValue: prisma },
        { provide: MediaService, useValue: mediaService },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadSingle', () => {
    it('should upload a single file', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 100,
      } as Express.Multer.File;
      const result = await service.uploadSingle('user1', mockFile);
      expect(mediaService.upload).toHaveBeenCalled();
      expect(result).toHaveProperty('url');
    });
  });

  describe('uploadMultiple', () => {
    it('should upload multiple files', async () => {
      const mockFiles = [
        {
          buffer: Buffer.from('test1'),
          originalname: 'test1.jpg',
          mimetype: 'image/jpeg',
          size: 100,
        },
        {
          buffer: Buffer.from('test2'),
          originalname: 'test2.jpg',
          mimetype: 'image/jpeg',
          size: 200,
        },
      ] as Express.Multer.File[];
      const result = await service.uploadMultiple('user1', mockFiles);
      expect(mediaService.upload).toHaveBeenCalledTimes(2);
      expect(result.total).toBe(2);
    });
  });

  describe('getUploadHistory', () => {
    it('should return upload history', async () => {
      const result = await service.getUploadHistory('user1', {
        page: 1,
        limit: 10,
      });
      expect(mediaService.findUserMedia).toHaveBeenCalled();
      expect(result).toHaveProperty('data');
    });
  });

  describe('getUploadStats', () => {
    it('should return upload stats', async () => {
      const result = await service.getUploadStats('user1');
      expect(mediaService.getStats).toHaveBeenCalled();
      expect(result).toHaveProperty('totalMedia');
    });
  });

  describe('getUploadById', () => {
    it('should return upload by id', async () => {
      mediaService.findById.mockResolvedValue({
        id: 'm1',
        url: 'http://test.com/file.jpg',
      });
      const result = await service.getUploadById('user1', 'm1');
      expect(result.id).toBe('m1');
    });
  });

  describe('deleteUpload', () => {
    it('should delete upload', async () => {
      const result = await service.deleteUpload('user1', 'm1');
      expect(mediaService.delete).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe('batchDeleteUploads', () => {
    it('should batch delete uploads', async () => {
      await service.batchDeleteUploads('user1', ['m1', 'm2']);
      expect(mediaService.bulkDelete).toHaveBeenCalled();
    });
  });

  describe('getSignedUrl', () => {
    it('should get signed url', async () => {
      const result = await service.getSignedUrl('user1', 'm1');
      expect(mediaService.getSignedUrl).toHaveBeenCalled();
      expect(result).toHaveProperty('url');
    });
  });

  describe('getRecentUploads', () => {
    it('should return recent uploads', async () => {
      prisma.media.findMany.mockResolvedValue([
        { id: 'm1', url: 'http://test.com/file.jpg', originalName: 'test.jpg' },
      ]);
      const result = await service.getRecentUploads('user1', 5);
      expect(result).toHaveLength(1);
      expect(prisma.media.findMany).toHaveBeenCalled();
    });
  });

  describe('getUploadQuota', () => {
    it('should return upload quota info', async () => {
      const result = await service.getUploadQuota('user1');
      expect(result).toHaveProperty('used');
      expect(result).toHaveProperty('limit');
      expect(result).toHaveProperty('remaining');
      expect(result).toHaveProperty('percentage');
    });
  });
});
