import { MediaCategory } from '../../../common/enums';
export declare class SimpleUploadDto {
    category?: MediaCategory;
    description?: string;
}
export declare class QueryUploadsDto {
    search?: string;
    category?: MediaCategory;
    mimeType?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class BulkUploadMetadataDto {
    category?: MediaCategory;
    description?: string;
}
export declare class BatchDeleteUploadsDto {
    ids: string[];
}
