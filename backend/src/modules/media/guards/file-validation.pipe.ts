import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

const ALLOWED_MIME_PREFIXES: Record<string, string[]> = {
  image: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
  ],
  video: [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
  ],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
  ],
};

const BLOCKED_MIME_TYPES = [
  'application/x-executable',
  'application/x-sharedlib',
  'application/x-msdownload',
  'application/x-bat',
  'application/x-sh',
  'application/x-script',
  'application/x-perl',
  'application/x-python',
];

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(
    private options: {
      maxSize?: number;
      allowedCategories?: string[];
    } = {},
  ) {}

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (BLOCKED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type "${file.mimetype}" is not allowed for security reasons`,
      );
    }

    const maxSize = this.options.maxSize || 50 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File size exceeds maximum of ${Math.round(maxSize / 1024 / 1024)}MB`,
      );
    }

    if (this.options.allowedCategories?.length) {
      const isAllowed = this.options.allowedCategories.some((cat) => {
        const prefixes = ALLOWED_MIME_PREFIXES[cat] || [];
        return prefixes.some(
          (mime) =>
            file.mimetype === mime ||
            file.mimetype.startsWith(mime.split('/')[0]),
        );
      });
      if (!isAllowed) {
        throw new BadRequestException(
          `File type "${file.mimetype}" is not allowed for this category`,
        );
      }
    }

    return file;
  }
}

@Injectable()
export class MultiFileValidationPipe implements PipeTransform {
  constructor(
    private options: {
      maxSize?: number;
      maxFiles?: number;
      allowedCategories?: string[];
    } = {},
  ) {}

  transform(files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const maxFiles = this.options.maxFiles || 10;
    if (files.length > maxFiles) {
      throw new BadRequestException(
        `Maximum ${maxFiles} files allowed per upload`,
      );
    }

    const maxSize = this.options.maxSize || 50 * 1024 * 1024;
    for (const file of files) {
      if (BLOCKED_MIME_TYPES.includes(file.mimetype)) {
        throw new BadRequestException(
          `File type "${file.mimetype}" is not allowed for security reasons`,
        );
      }
      if (file.size > maxSize) {
        throw new BadRequestException(
          `File "${file.originalname}" exceeds maximum size of ${Math.round(maxSize / 1024 / 1024)}MB`,
        );
      }
    }

    return files;
  }
}

export function getFileCategory(mimetype: string): string {
  for (const [category, mimes] of Object.entries(ALLOWED_MIME_PREFIXES)) {
    if (
      mimes.some((m) => mimetype === m || mimetype.startsWith(m.split('/')[0]))
    ) {
      return category;
    }
  }
  return 'other';
}

export function getAllowedMimeTypes(): string[] {
  return Object.values(ALLOWED_MIME_PREFIXES).flat();
}
