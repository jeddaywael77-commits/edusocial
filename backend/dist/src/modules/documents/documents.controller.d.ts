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
    findMine(userId: string): Promise<{
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
export {};
