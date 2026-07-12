import { PrismaService } from '../../database/prisma.service';
import { MediaService } from '../media/media.service';
import { MediaCategory } from '../../common/enums';
import { QueryUploadsDto } from './dto/upload.dto';
export declare class UploadService {
    private prisma;
    private mediaService;
    private readonly logger;
    constructor(prisma: PrismaService, mediaService: MediaService);
    uploadSingle(userId: string, file: Express.Multer.File, category?: MediaCategory, description?: string): Promise<{
        description: string | undefined;
        uploadType: string;
        url: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: import("@prisma/client").$Enums.MediaCategory;
        status: import("@prisma/client").$Enums.MediaStatus;
        isDeleted: boolean;
        deletedAt: Date | null;
        storageProvider: string;
        bucket: string | null;
        key: string;
        duration: number | null;
        size: number;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        mimeType: string;
        ownerId: string;
        extension: string;
        originalName: string | null;
        width: number | null;
        height: number | null;
        checksum: string | null;
        thumbnailUrl: string | null;
        webpUrl: string | null;
        compressedUrl: string | null;
        pageCount: number | null;
    }>;
    uploadMultiple(userId: string, files: Express.Multer.File[], category?: MediaCategory, description?: string): Promise<{
        data: Record<string, unknown>[];
        total: number;
        uploadType: string;
    }>;
    getUploadHistory(userId: string, query: QueryUploadsDto): Promise<{
        data: ({
            owner: {
                id: string;
                name: string;
                avatar: string | null;
            };
        } & {
            url: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            category: import("@prisma/client").$Enums.MediaCategory;
            status: import("@prisma/client").$Enums.MediaStatus;
            isDeleted: boolean;
            deletedAt: Date | null;
            storageProvider: string;
            bucket: string | null;
            key: string;
            duration: number | null;
            size: number;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            mimeType: string;
            ownerId: string;
            extension: string;
            originalName: string | null;
            width: number | null;
            height: number | null;
            checksum: string | null;
            thumbnailUrl: string | null;
            webpUrl: string | null;
            compressedUrl: string | null;
            pageCount: number | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getUploadStats(userId: string): Promise<{
        totalMedia: number;
        totalSize: number;
        byCategory: Record<string, number>;
        byType: Record<string, number>;
    }>;
    getUploadById(userId: string, mediaId: string): Promise<{
        owner: {
            id: string;
            name: string;
            avatar: string | null;
        };
    } & {
        url: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: import("@prisma/client").$Enums.MediaCategory;
        status: import("@prisma/client").$Enums.MediaStatus;
        isDeleted: boolean;
        deletedAt: Date | null;
        storageProvider: string;
        bucket: string | null;
        key: string;
        duration: number | null;
        size: number;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        mimeType: string;
        ownerId: string;
        extension: string;
        originalName: string | null;
        width: number | null;
        height: number | null;
        checksum: string | null;
        thumbnailUrl: string | null;
        webpUrl: string | null;
        compressedUrl: string | null;
        pageCount: number | null;
    }>;
    deleteUpload(userId: string, mediaId: string, userRole?: string): Promise<{
        success: boolean;
        id: string;
    }>;
    batchDeleteUploads(userId: string, mediaIds: string[], userRole?: string): Promise<{
        id: string;
        success: boolean;
        error?: string;
    }[]>;
    getSignedUrl(userId: string, mediaId: string, expiresIn?: number): Promise<{
        url: string;
        expiresIn: number;
    }>;
    replaceUpload(userId: string, mediaId: string, file: Express.Multer.File): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: import("@prisma/client").$Enums.MediaCategory;
        status: import("@prisma/client").$Enums.MediaStatus;
        isDeleted: boolean;
        deletedAt: Date | null;
        storageProvider: string;
        bucket: string | null;
        key: string;
        duration: number | null;
        size: number;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        mimeType: string;
        ownerId: string;
        extension: string;
        originalName: string | null;
        width: number | null;
        height: number | null;
        checksum: string | null;
        thumbnailUrl: string | null;
        webpUrl: string | null;
        compressedUrl: string | null;
        pageCount: number | null;
    }>;
    getRecentUploads(userId: string, limit?: number): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        category: import("@prisma/client").$Enums.MediaCategory;
        status: import("@prisma/client").$Enums.MediaStatus;
        size: number;
        mimeType: string;
        extension: string;
        originalName: string | null;
        thumbnailUrl: string | null;
    }[]>;
    getUploadQuota(userId: string): Promise<{
        used: {
            uploads: number;
            bytes: number;
        };
        limit: {
            uploads: number;
            bytes: number;
        };
        remaining: {
            uploads: number;
            bytes: number;
        };
        percentage: {
            uploads: number;
            bytes: number;
        };
    }>;
}
