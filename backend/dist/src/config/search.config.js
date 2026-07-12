"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('search', () => ({
    host: process.env.MEILI_HOST || 'http://127.0.0.1:7700',
    apiKey: process.env.MEILI_MASTER_KEY || '',
    indexPrefix: process.env.MEILI_INDEX_PREFIX || 'edusocial_',
    defaultLimit: parseInt(process.env.SEARCH_DEFAULT_LIMIT || '20', 10),
    maxLimit: parseInt(process.env.SEARCH_MAX_LIMIT || '100', 10),
    defaultAttributesToHighlight: ['*'],
    batchSize: parseInt(process.env.SEARCH_INDEX_BATCH_SIZE || '1000', 10),
    syncIntervalMs: parseInt(process.env.SEARCH_SYNC_INTERVAL_MS || '300000', 10),
    searchRateLimit: parseInt(process.env.SEARCH_RATE_LIMIT || '30', 10),
    searchRateLimitTtl: parseInt(process.env.SEARCH_RATE_LIMIT_TTL || '60', 10),
}));
//# sourceMappingURL=search.config.js.map