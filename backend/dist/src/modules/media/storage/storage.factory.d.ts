import { ConfigService } from '@nestjs/config';
import { IStorageProvider } from './storage-provider.interface';
import { LocalStorageProvider } from './local-storage.provider';
import { MinioStorageProvider } from './minio-storage.provider';
import { S3StorageProvider } from './s3-storage.provider';
export declare class StorageFactory {
    private configService;
    private localProvider;
    private minioProvider;
    private s3Provider;
    private readonly logger;
    private provider;
    constructor(configService: ConfigService, localProvider: LocalStorageProvider, minioProvider: MinioStorageProvider, s3Provider: S3StorageProvider);
    private getProvider;
    getProviderInstance(): IStorageProvider;
}
