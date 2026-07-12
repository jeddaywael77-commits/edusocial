import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MulterModule } from '@nestjs/platform-express';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MediaProcessor, ImageProcessor, DocumentProcessor } from './processors';
import { LocalStorageProvider, MinioStorageProvider, S3StorageProvider, StorageFactory } from './storage';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as multer from 'multer';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        storage: multer.memoryStorage(),
        limits: {
          fileSize: configService.get<number>('media.maxFileSize') || 50 * 1024 * 1024,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'media-processing',
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    }),
  ],
  controllers: [MediaController],
  providers: [
    MediaService,
    MediaProcessor,
    ImageProcessor,
    DocumentProcessor,
    LocalStorageProvider,
    MinioStorageProvider,
    S3StorageProvider,
    StorageFactory,
  ],
  exports: [MediaService, StorageFactory],
})
export class MediaModule {}
