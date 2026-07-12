import { PaginationQuery } from '../interfaces/pagination.interface';
export declare function buildPaginationArgs(query: PaginationQuery): {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
};
export declare function buildPaginatedResponse<T>(data: T[], total: number, page: number, limit: number): {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
};
