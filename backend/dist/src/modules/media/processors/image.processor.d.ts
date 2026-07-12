import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../database/prisma.service';
import { StorageFactory } from '../storage/storage.factory';
export declare class ImageProcessor {
    private prisma;
    private storageFactory;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, storageFactory: StorageFactory, configService: ConfigService);
    process(mediaId: string): Promise<void>;
    stripMetadata(buffer: Buffer): Promise<Buffer>;
    resize(buffer: Buffer, width: number, height: number): Promise<Buffer>;
    generateWebp(buffer: Buffer, quality?: number): Promise<Buffer>;
    getImageMetadata(buffer: Buffer): Promise<any>;
}
