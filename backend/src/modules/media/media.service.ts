import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { StorageFactory } from './storage/storage.factory';
import { MediaStatus, MediaCategory } from '../../common/enums';
import { QueryMediaDto, BulkDeleteDto } from './dto/media.dto';
import { createHash, randomUUID } from 'crypto';
import * as path from 'path';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    private prisma: PrismaService,
    private storageFactory: StorageFactory,
    private configService: ConfigService,
  ) {}

  async upload(
    ownerId: string,
    file: Express.Multer.File,
    category: MediaCategory = MediaCategory.POST_IMAGE,
  ) {
    const checksum = createHash('sha256').update(file.buffer).digest('hex');

    const existing = await this.prisma.media.findFirst({
      where: { checksum, ownerId, isDeleted: false },
    });
    if (existing) {
      this.logger.log(`Duplicate upload detected: ${checksum}`);
      return existing;
    }

    const ext =
      path.extname(file.originalname).toLowerCase().replace('.', '') ||
      this.getExtFromMime(file.mimetype);
    const key = this.generateKey(ownerId, category, ext);

    const storage = this.storageFactory.getProviderInstance();
    const bucket =
      this.configService.get<string>('media.bucket') || 'edusocial';

    const result = await storage.upload(file.buffer, {
      bucket,
      key,
      contentType: file.mimetype,
      metadata: {
        ownerId,
        category,
        originalName: file.originalname,
      },
    });

    const media = await this.prisma.media.create({
      data: {
        ownerId,
        category: category as any,
        storageProvider:
          this.configService.get<string>('media.storageProvider') || 'local',
        bucket: result.bucket,
        key: result.key,
        url: result.url,
        mimeType: file.mimetype,
        extension: ext,
        originalName: file.originalname,
        size: file.size,
        checksum,
        status: MediaStatus.UPLOADING as any,
        width: file.mimetype.startsWith('image/')
          ? (file as any).width || null
          : null,
        height: file.mimetype.startsWith('image/')
          ? (file as any).height || null
          : null,
      },
    });

    this.logger.log(`File uploaded: ${media.id} (${file.originalname})`);
    return media;
  }

  async uploadMultiple(
    ownerId: string,
    files: Express.Multer.File[],
    category: MediaCategory = MediaCategory.POST_IMAGE,
  ) {
    const results: any[] = [];
    for (const file of files) {
      const media = await this.upload(ownerId, file, category);
      results.push(media);
    }
    return results;
  }

  async findById(id: string, userId: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
      include: { owner: { select: { id: true, name: true, avatar: true } } },
    });

    if (!media || media.isDeleted) {
      throw new NotFoundException('Media not found');
    }

    return media;
  }

  async findUserMedia(userId: string, query: QueryMediaDto) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.MediaWhereInput = {
      ownerId: userId,
      isDeleted: false,
      ...(query.category && { category: query.category }),
      ...(query.mimeType && {
        mimeType: { contains: query.mimeType, mode: 'insensitive' },
      }),
      ...(query.search && {
        OR: [
          { originalName: { contains: query.search, mode: 'insensitive' } },
          { mimeType: { contains: query.search, mode: 'insensitive' } },
        ],
      }),
    };

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const [media, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: { owner: { select: { id: true, name: true, avatar: true } } },
      }),
      this.prisma.media.count({ where }),
    ]);

    return {
      data: media,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async getSignedUrl(id: string, userId: string, expiresIn?: number) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media || media.isDeleted)
      throw new NotFoundException('Media not found');

    const storage = this.storageFactory.getProviderInstance();
    const url = await storage.getSignedUrl({
      bucket:
        media.bucket ||
        this.configService.get<string>('media.bucket') ||
        'edusocial',
      key: media.key,
      expiresIn:
        expiresIn ||
        this.configService.get<number>('media.signedUrlExpiry') ||
        3600,
    });

    return { url, expiresIn: expiresIn || 3600 };
  }

  async replace(id: string, userId: string, file: Express.Multer.File) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media || media.isDeleted)
      throw new NotFoundException('Media not found');
    if (media.ownerId !== userId)
      throw new ForbiddenException('Not authorized');

    const storage = this.storageFactory.getProviderInstance();
    const bucket =
      media.bucket ||
      this.configService.get<string>('media.bucket') ||
      'edusocial';
    await storage.delete(bucket, media.key);

    const checksum = createHash('sha256').update(file.buffer).digest('hex');
    const ext =
      path.extname(file.originalname).toLowerCase().replace('.', '') ||
      this.getExtFromMime(file.mimetype);

    const replaceBucket =
      media.bucket ||
      this.configService.get<string>('media.bucket') ||
      'edusocial';
    const result = await storage.upload(file.buffer, {
      bucket: replaceBucket,
      key: media.key,
      contentType: file.mimetype,
    });

    const updated = await this.prisma.media.update({
      where: { id },
      data: {
        url: result.url,
        mimeType: file.mimetype,
        extension: ext,
        originalName: file.originalname,
        size: file.size,
        checksum,
        status: MediaStatus.UPLOADING as any,
      },
    });

    this.logger.log(`Media replaced: ${id}`);
    return updated;
  }

  async delete(id: string, userId: string, userRole?: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media || media.isDeleted)
      throw new NotFoundException('Media not found');

    const isOwner = media.ownerId === userId;
    const isAdmin = userRole === 'ADMIN' || userRole === 'MODERATOR';
    if (!isOwner && !isAdmin) throw new ForbiddenException('Not authorized');

    const updated = await this.prisma.media.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    this.logger.log(`Media soft-deleted: ${id}`);
    return { success: true, id: updated.id };
  }

  async bulkDelete(dto: BulkDeleteDto, userId: string, userRole?: string) {
    const results: { id: string; success: boolean; error?: string }[] = [];
    for (const id of dto.ids) {
      try {
        await this.delete(id, userId, userRole);
        results.push({ id, success: true });
      } catch (error) {
        results.push({ id, success: false, error: error.message });
      }
    }
    return results;
  }

  async updateStatus(
    id: string,
    status: MediaStatus,
    metadata?: Record<string, any>,
  ) {
    const data: Prisma.MediaUpdateInput = { status: status };
    if (metadata) {
      data.metadata = metadata;
    }
    return this.prisma.media.update({ where: { id }, data });
  }

  async updateProcessingResult(
    id: string,
    results: {
      thumbnailUrl?: string;
      webpUrl?: string;
      compressedUrl?: string;
      width?: number;
      height?: number;
      duration?: number;
      pageCount?: number;
    },
  ) {
    return this.prisma.media.update({
      where: { id },
      data: {
        ...results,
        status: MediaStatus.READY as any,
      },
    });
  }

  async getStats(ownerId: string) {
    const stats = await this.prisma.media.groupBy({
      by: ['category', 'mimeType'],
      where: { ownerId, isDeleted: false },
      _count: { id: true },
      _sum: { size: true },
    });

    const totalMedia = await this.prisma.media.count({
      where: { ownerId, isDeleted: false },
    });
    const totalSize = await this.prisma.media.aggregate({
      where: { ownerId, isDeleted: false },
      _sum: { size: true },
    });

    return {
      totalMedia,
      totalSize: totalSize._sum.size || 0,
      byCategory: stats.reduce(
        (acc, s) => {
          acc[s.category] = (acc[s.category] || 0) + s._count.id;
          return acc;
        },
        {} as Record<string, number>,
      ),
      byType: stats.reduce(
        (acc, s) => {
          acc[s.mimeType] = (acc[s.mimeType] || 0) + s._count.id;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }

  private generateKey(
    ownerId: string,
    category: MediaCategory,
    ext: string,
  ): string {
    const date = new Date();
    const datePath = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`;
    const uuid = randomUUID();
    return `${category.toLowerCase()}/${datePath}/${ownerId}/${uuid}.${ext}`;
  }

  private getExtFromMime(mimeType: string): string {
    const mimeMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'video/mp4': 'mp4',
      'video/webm': 'webm',
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'docx',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        'xlsx',
      'application/vnd.ms-powerpoint': 'ppt',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        'pptx',
      'text/plain': 'txt',
    };
    return mimeMap[mimeType] || 'bin';
  }
}
