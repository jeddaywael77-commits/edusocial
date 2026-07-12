import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  IStorageProvider,
  StorageUploadResult,
  StorageUploadOptions,
  SignedUrlOptions,
} from './storage-provider.interface';

@Injectable()
export class S3StorageProvider implements IStorageProvider, OnModuleInit {
  private readonly logger = new Logger(S3StorageProvider.name);
  private client: S3Client;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = new S3Client({
      region: this.configService.get<string>('media.s3Region') || 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get<string>('media.s3AccessKeyId') || '',
        secretAccessKey: this.configService.get<string>('media.s3SecretAccessKey') || '',
      },
      ...(this.configService.get<string>('media.s3Endpoint') && {
        endpoint: this.configService.get<string>('media.s3Endpoint'),
        forcePathStyle: true,
      }),
    });
    this.logger.log('S3 client initialized');
  }

  async upload(buffer: Buffer, options: StorageUploadOptions): Promise<StorageUploadResult> {
    const command = new PutObjectCommand({
      Bucket: options.bucket,
      Key: options.key,
      Body: buffer,
      ContentType: options.contentType,
      Metadata: options.metadata,
    });

    const result = await this.client.send(command);

    return {
      key: options.key,
      bucket: options.bucket,
      url: this.getPublicUrl(options.bucket, options.key),
      size: buffer.length,
      etag: result.ETag,
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
    await this.client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  }

  async getSignedUrl(options: SignedUrlOptions): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: options.bucket,
      Key: options.key,
    });
    return getSignedUrl(this.client, command, { expiresIn: options.expiresIn || 3600 });
  }

  getPublicUrl(bucket: string, key: string): string {
    const endpoint = this.configService.get<string>('media.s3Endpoint');
    if (endpoint) {
      return `${endpoint}/${bucket}/${key}`;
    }
    return `https://${bucket}.s3.amazonaws.com/${key}`;
  }

  async copy(srcBucket: string, srcKey: string, destBucket: string, destKey: string): Promise<void> {
    await this.client.send(new CopyObjectCommand({
      Bucket: destBucket,
      Key: destKey,
      CopySource: `${srcBucket}/${srcKey}`,
    }));
  }
}
