export interface StorageUploadResult {
  key: string;
  bucket: string;
  url: string;
  size: number;
  etag?: string;
}

export interface StorageUploadOptions {
  bucket: string;
  key: string;
  contentType: string;
  metadata?: Record<string, string>;
}

export interface SignedUrlOptions {
  bucket: string;
  key: string;
  expiresIn?: number;
}

export interface IStorageProvider {
  upload(buffer: Buffer, options: StorageUploadOptions): Promise<StorageUploadResult>;
  uploadStream(stream: NodeJS.ReadableStream, options: StorageUploadOptions): Promise<StorageUploadResult>;
  delete(bucket: string, key: string): Promise<void>;
  getSignedUrl(options: SignedUrlOptions): Promise<string>;
  getPublicUrl(bucket: string, key: string): string;
  copy(srcBucket: string, srcKey: string, destBucket: string, destKey: string): Promise<void>;
}
