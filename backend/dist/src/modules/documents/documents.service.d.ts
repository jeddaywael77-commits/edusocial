import { PrismaService } from '../../database/prisma.service';
export declare class DocumentsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(uploadedById: string, data: {
        name: string;
        type: string;
        size: number;
        url: string;
        thumbnail?: string;
        tags?: string[];
    }): Promise<{
        uploadedBy: {
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        url: string;
        type: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        thumbnail: string | null;
        size: number;
        version: number;
        uploadedById: string;
    }>;
    findAll(): Promise<({
        uploadedBy: {
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        url: string;
        type: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        thumbnail: string | null;
        size: number;
        version: number;
        uploadedById: string;
    })[]>;
    findById(id: string): Promise<({
        uploadedBy: {
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        url: string;
        type: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        thumbnail: string | null;
        size: number;
        version: number;
        uploadedById: string;
    }) | null>;
    findByUserId(userId: string): Promise<{
        url: string;
        type: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        thumbnail: string | null;
        size: number;
        version: number;
        uploadedById: string;
    }[]>;
    delete(id: string, userId: string): Promise<{
        url: string;
        type: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        thumbnail: string | null;
        size: number;
        version: number;
        uploadedById: string;
    }>;
}
