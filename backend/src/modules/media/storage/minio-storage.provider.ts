import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import {
  IStorageProvider,
  StorageUploadResult,
  StorageUploadOptions,
  SignedUrlOptions,
} from './storage-provider.interface';

@Injectable()
export class MinioStorageProvider implements IStorageProvider, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MinioStorageProvider.name);
  private client: Minio.Client;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.client = new Minio.Client({
      endPoint: this.configService.get<string>('media.minioEndpoint') || 'localhost',
      port: this.configService.get<number>('media.minioPort') || 9000,
      useSSL: this.configService.get<boolean>('media.minioUseSsl') || false,
      accessKey: this.configService.get<string>('media.minioAccessKey') || 'minioadmin',
      secretKey: this.configService.get<string>('media.minioSecretKey') || 'minioadmin',
    });

    const bucket = this.configService.get<string>('media.minioBucket') || 'edusocial';
    const exists = await this.client.bucketExists(bucket);
    if (!exists) {
      await this.client.makeBucket(bucket, this.configService.get<string>('media.minioRegion') || 'us-east-1');
      const policy = JSON.stringify({
        Version: '2012-10-17',
        Statement: [{
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucket}/public/*`],
        }],
      });
      await this.client.setBucketPolicy(bucket, policy);
      this.logger.log(`Bucket "${bucket}" created with public read policy`);
    }
    this.logger.log('MinIO client initialized');
  }

  onModuleDestroy() {
    // Cleanup if needed
  }

  async upload(buffer: Buffer, options: StorageUploadOptions): Promise<StorageUploadResult> {
    const result = await this.client.putObject(
      options.bucket,
      options.key,
      buffer,
      buffer.length,
      { 'Content-Type': options.contentType, ...options.metadata },
    );

    const url = await this.getSignedUrl({ bucket: options.bucket, key: options.key });

    return {
      key: options.key,
      bucket: options.bucket,
      url,
      size: buffer.length,
      etag: result.etag,
    };
  }

  async uploadStream(stream: NodeJS.ReadableStream, options: StorageUploadOptions): Promise<StorageUploadResult> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);
    return this.upload(buffer, options);
  }

  async delete(bucket: string, key: string): Promise<void> {
    await this.client.removeObject(bucket, key);
  }

  async getSignedUrl(options: SignedUrlOptions): Promise<string> {
    const expiresIn = options.expiresIn || 3600;
    return this.client.presignedGetObject(options.bucket, options.key, expiresIn);
  }

  getPublicUrl(bucket: string, key: string): string {
    const endpoint = this.configService.get<string>('media.minioEndpoint') || 'localhost';
    const port = this.configService.get<number>('media.minioPort') || 9000;
    const useSsl = this.configService.get<boolean>('media.minioUseSsl') || false;
    const protocol = useSsl ? 'https' : 'http';
    return `${protocol}://${endpoint}:${port}/${bucket}/${key}`;
  }

  async copy(srcBucket: string, srcKey: string, destBucket: string, destKey: string): Promise<void> {
    await this.client.copyObject(destBucket, destKey, `${srcBucket}/${srcKey}`);
  }
}
