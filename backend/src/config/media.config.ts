import { registerAs } from '@nestjs/config';

export default registerAs('media', () => ({
  storageProvider: process.env.MEDIA_STORAGE_PROVIDER || 'local',
  maxFileSize: parseInt(process.env.MEDIA_MAX_FILE_SIZE || '52428800', 10),
  maxFilesPerUpload: parseInt(
    process.env.MEDIA_MAX_FILES_PER_UPLOAD || '10',
    10,
  ),
  allowedMimeTypes:
    process.env.MEDIA_ALLOWED_MIME_TYPES ||
    'image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.*,application/vnd.ms-excel,application/vnd.ms-powerpoint,text/plain',
  bucket: process.env.MEDIA_BUCKET || 'edusocial',

  // Local
  storageBaseUrl:
    process.env.MEDIA_STORAGE_BASE_URL ||
    `http://localhost:${process.env.PORT || 3001}/uploads`,

  // MinIO
  minioEndpoint: process.env.MINIO_ENDPOINT || 'localhost',
  minioPort: parseInt(process.env.MINIO_PORT || '9000', 10),
  minioUseSsl: process.env.MINIO_USE_SSL === 'true',
  minioAccessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  minioSecretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  minioBucket: process.env.MINIO_BUCKET || 'edusocial',
  minioRegion: process.env.MINIO_REGION || 'us-east-1',

  // AWS S3
  s3Region: process.env.AWS_S3_REGION || 'us-east-1',
  s3AccessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || '',
  s3SecretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || '',
  s3Bucket: process.env.AWS_S3_BUCKET || 'edusocial',
  s3Endpoint: process.env.AWS_S3_ENDPOINT || '',

  // Image processing
  thumbnailWidth: parseInt(process.env.MEDIA_THUMBNAIL_WIDTH || '300', 10),
  thumbnailHeight: parseInt(process.env.MEDIA_THUMBNAIL_HEIGHT || '300', 10),
  maxWidth: parseInt(process.env.MEDIA_MAX_WIDTH || '2048', 10),
  maxHeight: parseInt(process.env.MEDIA_MAX_HEIGHT || '2048', 10),
  imageQuality: parseInt(process.env.MEDIA_IMAGE_QUALITY || '80', 10),
  generateWebp: process.env.MEDIA_GENERATE_WEBP !== 'false',

  // Signed URL
  signedUrlExpiry: parseInt(process.env.MEDIA_SIGNED_URL_EXPIRY || '3600', 10),
}));
