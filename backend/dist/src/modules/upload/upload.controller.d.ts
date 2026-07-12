import { UploadService } from './upload.service';
import { MediaCategory } from '../../common/enums';
import { QueryUploadsDto, BatchDeleteUploadsDto } from './dto/upload.dto';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadSingle(userId: string, file: Express.Multer.File, category?: MediaCategory): Promise<{
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
    uploadMultiple(userId: string, files: Express.Multer.File[], category?: MediaCategory): Promise<{
        data: Record<string, unknown>[];
        total: number;
        uploadType: string;
    }>;
    getHistory(userId: string, query: QueryUploadsDto): Promise<{
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
    getStats(userId: string): Promise<{
        totalMedia: number;
        totalSize: number;
        byCategory: Record<string, number>;
        byType: Record<string, number>;
    }>;
    getQuota(userId: string): Promise<{
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
    getRecent(userId: string, limit?: number): Promise<{
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
    getById(id: string, userId: string): Promise<{
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
    getSignedUrl(id: string, userId: string, expiresIn?: number): Promise<{
        url: string;
        expiresIn: number;
    }>;
    replace(id: string, userId: string, file: Express.Multer.File): Promise<{
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
    delete(id: string, userId: string, role: string): Promise<{
        success: boolean;
        id: string;
    }>;
    batchDelete(userId: string, role: string, dto: BatchDeleteUploadsDto): Promise<{
        id: string;
        success: boolean;
        error?: string;
    }[]>;
}
