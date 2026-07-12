declare const _default: (() => {
    host: string;
    apiKey: string;
    indexPrefix: string;
    defaultLimit: number;
    maxLimit: number;
    defaultAttributesToHighlight: string[];
    batchSize: number;
    syncIntervalMs: number;
    searchRateLimit: number;
    searchRateLimitTtl: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    host: string;
    apiKey: string;
    indexPrefix: string;
    defaultLimit: number;
    maxLimit: number;
    defaultAttributesToHighlight: string[];
    batchSize: number;
    syncIntervalMs: number;
    searchRateLimit: number;
    searchRateLimitTtl: number;
}>;
export default _default;
