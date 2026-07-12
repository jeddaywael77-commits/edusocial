import { MediaService } from './media.service';
import { MediaCategory } from '../../common/enums';
import { QueryMediaDto, BulkDeleteDto } from './dto/media.dto';
import { ConfigService } from '@nestjs/config';
export declare class MediaController {
    private readonly mediaService;
    private configService;
    constructor(mediaService: MediaService, configService: ConfigService);
    uploadFile(userId: string, file: Express.Multer.File, category?: MediaCategory): Promise<{
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
    uploadMultiple(userId: string, files: Express.Multer.File[], category?: MediaCategory): Promise<any[]>;
    getMyMedia(userId: string, query: QueryMediaDto): Promise<{
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
    findOne(id: string, userId: string): Promise<{
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
    bulkDelete(userId: string, role: string, dto: BulkDeleteDto): Promise<{
        id: string;
        success: boolean;
        error?: string;
    }[]>;
}
