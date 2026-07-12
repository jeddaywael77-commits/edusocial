import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';
import {
  IStorageProvider,
  StorageUploadResult,
  StorageUploadOptions,
  SignedUrlOptions,
} from './storage-provider.interface';

@Injectable()
export class LocalStorageProvider implements IStorageProvider {
  private readonly logger = new Logger(LocalStorageProvider.name);
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('app.uploadDir') || './uploads';
    this.baseUrl = this.configService.get<string>('app.storageBaseUrl') || `http://localhost:${this.configService.get<number>('app.port') || 3001}/uploads`;
  }

  private async ensureDir(dirPath: string) {
    await fs.mkdir(dirPath, { recursive: true });
  }

  async upload(buffer: Buffer, options: StorageUploadOptions): Promise<StorageUploadResult> {
    const filePath = path.join(this.uploadDir, options.key);
    const dir = path.dirname(filePath);
    await this.ensureDir(dir);
    await fs.writeFile(filePath, buffer);

    return {
      key: options.key,
      bucket: options.bucket,
      url: `${this.baseUrl}/${options.key}`,
      size: buffer.length,
    };
  }

  async uploadStream(stream: NodeJS.ReadableStream, options: StorageUploadOptions): Promise<StorageUploadResult> {
    const filePath = path.join(this.uploadDir, options.key);
    const dir = path.dirname(filePath);
    await this.ensureDir(dir);

    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);
    await fs.writeFile(filePath, buffer);

    return {
      key: options.key,
      bucket: options.bucket,
      url: `${this.baseUrl}/${options.key}`,
      size: buffer.length,
    };
  }

  async delete(bucket: string, key: string): Promise<void> {
    const filePath = path.join(this.uploadDir, key);
    try {
      await fs.unlink(filePath);
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        this.logger.error(`Failed to delete file: ${filePath}`, err.message);
      }
    }
  }

  async getSignedUrl(options: SignedUrlOptions): Promise<string> {
    return `${this.baseUrl}/${options.key}`;
  }

  getPublicUrl(bucket: string, key: string): string {
    return `${this.baseUrl}/${key}`;
  }

  async copy(srcBucket: string, srcKey: string, destBucket: string, destKey: string): Promise<void> {
    const srcPath = path.join(this.uploadDir, srcKey);
    const destPath = path.join(this.uploadDir, destKey);
    await this.ensureDir(path.dirname(destPath));
    await fs.copyFile(srcPath, destPath);
  }
}
