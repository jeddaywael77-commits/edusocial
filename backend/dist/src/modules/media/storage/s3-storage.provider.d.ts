import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IStorageProvider, StorageUploadResult, StorageUploadOptions, SignedUrlOptions } from './storage-provider.interface';
export declare class S3StorageProvider implements IStorageProvider, OnModuleInit {
    private configService;
    private readonly logger;
    private client;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    upload(buffer: Buffer, options: StorageUploadOptions): Promise<StorageUploadResult>;
    uploadStream(stream: NodeJS.ReadableStream, options: StorageUploadOptions): Promise<StorageUploadResult>;
    delete(bucket: string, key: string): Promise<void>;
    getSignedUrl(options: SignedUrlOptions): Promise<string>;
    getPublicUrl(bucket: string, key: string): string;
    copy(srcBucket: string, srcKey: string, destBucket: string, destKey: string): Promise<void>;
}
