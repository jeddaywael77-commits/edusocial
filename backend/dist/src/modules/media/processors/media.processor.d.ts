import { Job } from 'bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { ImageProcessor } from './image.processor';
import { DocumentProcessor } from './document.processor';
export interface MediaProcessJob {
    mediaId: string;
    mimeType: string;
    category: string;
}
export declare class MediaProcessor {
    private prisma;
    private imageProcessor;
    private documentProcessor;
    private readonly logger;
    constructor(prisma: PrismaService, imageProcessor: ImageProcessor, documentProcessor: DocumentProcessor);
    process(job: Job<MediaProcessJob>): Promise<void>;
}
