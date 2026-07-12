import { MediaCategory } from '../../../common/enums';
export declare class UploadMediaDto {
    category?: MediaCategory;
    description?: string;
}
export declare class BulkUploadMediaDto {
    category?: MediaCategory;
}
export declare class QueryMediaDto {
    search?: string;
    category?: MediaCategory;
    mimeType?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class BulkDeleteDto {
    ids: string[];
}
