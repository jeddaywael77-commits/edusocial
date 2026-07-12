import { DocumentsService } from './documents.service';
declare class CreateDocumentDto {
    name: string;
    type: string;
    size: number;
    url: string;
    thumbnail?: string;
    tags?: string[];
}
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    create(userId: string, dto: CreateDocumentDto): Promise<{
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
    findMine(userId: string): Promise<{
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
export {};
