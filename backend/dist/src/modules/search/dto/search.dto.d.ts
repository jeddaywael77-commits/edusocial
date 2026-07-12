export declare class GlobalSearchDto {
    q?: string;
    indexes?: string[];
    limit?: number;
    offset?: number;
    filters?: Record<string, string | number | boolean>;
}
export declare class AutocompleteDto {
    q?: string;
    index?: string;
    limit?: number;
}
export declare class IndexEntityDto {
    entityType?: string;
}
export declare class SearchConfigDto {
    entityType: string;
}
