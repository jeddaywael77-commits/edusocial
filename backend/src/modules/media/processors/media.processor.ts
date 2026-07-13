import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { MediaStatus } from '../../../common/enums';
import { ImageProcessor } from './image.processor';
import { DocumentProcessor } from './document.processor';

export interface MediaProcessJob {
  mediaId: string;
  mimeType: string;
  category: string;
}

@Processor('media-processing', {
  concurrency: 2,
})
export class MediaProcessor extends WorkerHost {
  private readonly logger = new Logger(MediaProcessor.name);

  constructor(
    private prisma: PrismaService,
    private imageProcessor: ImageProcessor,
    private documentProcessor: DocumentProcessor,
  ) {
    super();
  }

  async process(job: Job<MediaProcessJob>): Promise<void> {
    const { mediaId, mimeType } = job.data;
    this.logger.log(`Processing media: ${mediaId} (${mimeType})`);

    try {
      await this.prisma.media.update({
        where: { id: mediaId },
        data: { status: MediaStatus.PROCESSING as any },
      });

      if (mimeType.startsWith('image/')) {
        await this.imageProcessor.process(mediaId);
      } else if (mimeType === 'application/pdf') {
        await this.documentProcessor.processPdf(mediaId);
      }

      await this.prisma.media.update({
        where: { id: mediaId },
        data: { status: MediaStatus.READY as any },
      });

      this.logger.log(`Media processed successfully: ${mediaId}`);
    } catch (error) {
      this.logger.error(`Failed to process media ${mediaId}:`, error.message);

      await this.prisma.media.update({
        where: { id: mediaId },
        data: {
          status: MediaStatus.FAILED as any,
          metadata: { error: error.message },
        },
      });

      throw error;
    }
  }
}
