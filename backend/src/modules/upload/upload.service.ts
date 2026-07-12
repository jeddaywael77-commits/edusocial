import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { MediaService } from '../media/media.service';
import { MediaCategory } from '../../common/enums';
import { QueryUploadsDto } from './dto/upload.dto';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    private prisma: PrismaService,
    private mediaService: MediaService,
  ) {}

  async uploadSingle(
    userId: string,
    file: Express.Multer.File,
    category: MediaCategory = MediaCategory.POST_IMAGE,
    description?: string,
  ) {
    const media = await this.mediaService.upload(userId, file, category);

    this.logger.log(`Upload complete: ${media.id} by user ${userId}`);
    return {
      ...media,
      description,
      uploadType: 'single',
    };
  }

  async uploadMultiple(
    userId: string,
    files: Express.Multer.File[],
    category: MediaCategory = MediaCategory.POST_IMAGE,
    description?: string,
  ) {
    const results: Record<string, unknown>[] = [];
    for (const file of files) {
      const media = await this.mediaService.upload(userId, file, category);
      results.push({ ...media, description });
    }

    this.logger.log(
      `Bulk upload complete: ${results.length} files by user ${userId}`,
    );
    return {
      data: results,
      total: results.length,
      uploadType: 'multiple',
    };
  }

  async getUploadHistory(userId: string, query: QueryUploadsDto) {
    return this.mediaService.findUserMedia(userId, query);
  }

  async getUploadStats(userId: string) {
    return this.mediaService.getStats(userId);
  }

  async getUploadById(userId: string, mediaId: string) {
    const media = await this.mediaService.findById(mediaId, userId);
    return media;
  }

  async deleteUpload(userId: string, mediaId: string, userRole?: string) {
    return this.mediaService.delete(mediaId, userId, userRole);
  }

  async batchDeleteUploads(
    userId: string,
    mediaIds: string[],
    userRole?: string,
  ) {
    const dto = { ids: mediaIds };
    return this.mediaService.bulkDelete(dto, userId, userRole);
  }

  async getSignedUrl(userId: string, mediaId: string, expiresIn?: number) {
    return this.mediaService.getSignedUrl(mediaId, userId, expiresIn);
  }

  async replaceUpload(
    userId: string,
    mediaId: string,
    file: Express.Multer.File,
  ) {
    return this.mediaService.replace(mediaId, userId, file);
  }

  async getRecentUploads(userId: string, limit: number = 10) {
    const uploads = await this.prisma.media.findMany({
      where: { ownerId: userId, isDeleted: false },
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        url: true,
        mimeType: true,
        extension: true,
        originalName: true,
        size: true,
        category: true,
        status: true,
        thumbnailUrl: true,
        createdAt: true,
      },
    });

    return uploads;
  }

  async getUploadQuota(userId: string) {
    const stats = await this.mediaService.getStats(userId);
    const maxUploads = 1000;
    const maxSizeBytes = 5 * 1024 * 1024 * 1024;

    return {
      used: {
        uploads: stats.totalMedia,
        bytes: stats.totalSize,
      },
      limit: {
        uploads: maxUploads,
        bytes: maxSizeBytes,
      },
      remaining: {
        uploads: Math.max(0, maxUploads - stats.totalMedia),
        bytes: Math.max(0, maxSizeBytes - stats.totalSize),
      },
      percentage: {
        uploads: Math.min(
          100,
          Math.round((stats.totalMedia / maxUploads) * 100),
        ),
        bytes: Math.min(
          100,
          Math.round((stats.totalSize / maxSizeBytes) * 100),
        ),
      },
    };
  }
}
