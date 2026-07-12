import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IStorageProvider } from './storage-provider.interface';
import { LocalStorageProvider } from './local-storage.provider';
import { MinioStorageProvider } from './minio-storage.provider';
import { S3StorageProvider } from './s3-storage.provider';

@Injectable()
export class StorageFactory {
  private readonly logger = new Logger(StorageFactory.name);
  private provider: IStorageProvider;

  constructor(
    private configService: ConfigService,
    private localProvider: LocalStorageProvider,
    private minioProvider: MinioStorageProvider,
    private s3Provider: S3StorageProvider,
  ) {
    const providerType =
      this.configService.get<string>('media.storageProvider') || 'local';
    this.provider = this.getProvider(providerType);
    this.logger.log(`Storage provider: ${providerType}`);
  }

  private getProvider(type: string): IStorageProvider {
    switch (type.toLowerCase()) {
      case 'minio':
        return this.minioProvider;
      case 's3':
      case 'aws':
        return this.s3Provider;
      case 'local':
      default:
        return this.localProvider;
    }
  }

  getProviderInstance(): IStorageProvider {
    return this.provider;
  }
}
