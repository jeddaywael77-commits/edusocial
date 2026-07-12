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
            id: string;
            name: string;
            avatar: string | null;
        };
    } & {
        url: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        thumbnail: string | null;
        tags: string[];
        size: number;
        version: number;
        uploadedById: string;
    }>;
    findAll(): Promise<({
        uploadedBy: {
            id: string;
            name: string;
            avatar: string | null;
        };
    } & {
        url: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        thumbnail: string | null;
        tags: string[];
        size: number;
        version: number;
        uploadedById: string;
    })[]>;
    findById(id: string): Promise<({
        uploadedBy: {
            id: string;
            name: string;
            avatar: string | null;
        };
    } & {
        url: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        thumbnail: string | null;
        tags: string[];
        size: number;
        version: number;
        uploadedById: string;
    }) | null>;
    findByUserId(userId: string): Promise<{
        url: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        thumbnail: string | null;
        tags: string[];
        size: number;
        version: number;
        uploadedById: string;
    }[]>;
    delete(id: string, userId: string): Promise<{
        url: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        thumbnail: string | null;
        tags: string[];
        size: number;
        version: number;
        uploadedById: string;
    }>;
}
