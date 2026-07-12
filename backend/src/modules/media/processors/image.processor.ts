import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../database/prisma.service';
import { StorageFactory } from '../storage/storage.factory';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sharp = require('sharp');

@Injectable()
export class ImageProcessor {
  private readonly logger = new Logger(ImageProcessor.name);

  constructor(
    private prisma: PrismaService,
    private storageFactory: StorageFactory,
    private configService: ConfigService,
  ) {}

  async process(mediaId: string) {
    const media = await this.prisma.media.findUnique({ where: { id: mediaId } });
    if (!media) throw new Error(`Media not found: ${mediaId}`);

    const storage = this.storageFactory.getProviderInstance();
    const bucket = media.bucket || this.configService.get<string>('media.bucket') || 'edusocial';
    const key = media.key;

    try {
      const response = await fetch(media.url);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const metadata = await sharp(buffer).metadata();

      const width = metadata.width || undefined;
      const height = metadata.height || undefined;

      const thumbnailWidth = this.configService.get<number>('media.thumbnailWidth') || 300;
      const thumbnailHeight = this.configService.get<number>('media.thumbnailHeight') || 300;
      const imageQuality = this.configService.get<number>('media.imageQuality') || 80;
      const generateWebp = this.configService.get<boolean>('media.generateWebp') !== false;

      const thumbnailBuffer = await sharp(buffer)
        .resize(thumbnailWidth, thumbnailHeight, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer();

      const thumbnailKey = key.replace(/(\.[^.]+)$/, '-thumb.jpg');
      const thumbnailResult = await storage.upload(thumbnailBuffer, {
        bucket,
        key: thumbnailKey,
        contentType: 'image/jpeg',
      });

      const maxWidth = this.configService.get<number>('media.maxWidth') || 2048;
      const maxHeight = this.configService.get<number>('media.maxHeight') || 2048;
      const compressedBuffer = await sharp(buffer)
        .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: imageQuality })
        .toBuffer();

      const compressedKey = key.replace(/(\.[^.]+)$/, '-compressed.jpg');
      const compressedResult = await storage.upload(compressedBuffer, {
        bucket,
        key: compressedKey,
        contentType: 'image/jpeg',
      });

      let webpUrl: string | undefined;
      if (generateWebp && (metadata.format === 'jpeg' || metadata.format === 'png')) {
        const webpBuffer = await sharp(buffer)
          .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: imageQuality })
          .toBuffer();

        const webpKey = key.replace(/(\.[^.]+)$/, '.webp');
        const webpResult = await storage.upload(webpBuffer, {
          bucket,
          key: webpKey,
          contentType: 'image/webp',
        });
        webpUrl = webpResult.url;
      }

      await this.prisma.media.update({
        where: { id: mediaId },
        data: {
          width,
          height,
          thumbnailUrl: thumbnailResult.url,
          compressedUrl: compressedResult.url,
          webpUrl,
          metadata: {
            originalWidth: metadata.width,
            originalHeight: metadata.height,
            format: metadata.format,
            channels: metadata.channels,
            density: metadata.density,
            hasAlpha: metadata.hasAlpha,
            size: metadata.size,
          },
        },
      });

      this.logger.log(`Image processed: ${mediaId} (${width}x${height})`);
    } catch (error) {
      this.logger.error(`Image processing failed for ${mediaId}:`, error.message);
      throw error;
    }
  }

  async stripMetadata(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer).toBuffer();
  }

  async resize(buffer: Buffer, width: number, height: number): Promise<Buffer> {
    return sharp(buffer).resize(width, height, { fit: 'inside' }).toBuffer();
  }

  async generateWebp(buffer: Buffer, quality: number = 80): Promise<Buffer> {
    return sharp(buffer).webp({ quality }).toBuffer();
  }

  async getImageMetadata(buffer: Buffer) {
    return sharp(buffer).metadata();
  }
}
