"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SearchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const meilisearch_1 = require("meilisearch");
const search_indexes_1 = require("./indexes/search-indexes");
let SearchService = SearchService_1 = class SearchService {
    config;
    logger = new common_1.Logger(SearchService_1.name);
    client;
    indexPrefix;
    constructor(config) {
        this.config = config;
        this.indexPrefix =
            this.config.get('search.indexPrefix') || 'edusocial_';
    }
    onModuleInit() {
        const host = this.config.get('search.host') || 'http://127.0.0.1:7700';
        const apiKey = this.config.get('search.apiKey') || '';
        this.client = new meilisearch_1.Meilisearch({ host, apiKey });
        this.logger.log(`Meilisearch client initialized: ${host}`);
    }
    getClient() {
        return this.client;
    }
    getIndexName(entityType) {
        return `${this.indexPrefix}${entityType}`;
    }
    getIndex(entityType) {
        return this.client.index(this.getIndexName(entityType));
    }
    async initializeIndexes() {
        for (const [key, config] of Object.entries(search_indexes_1.SEARCH_INDEXES)) {
            const indexName = this.getIndexName(key);
            try {
                await this.client.createIndex(indexName, {
                    primaryKey: config.primaryKey,
                });
                const index = this.client.index(indexName);
                await index.updateSearchableAttributes([
                    ...config.searchableAttributes,
                ]);
                await index.updateFilterableAttributes([
                    ...config.filterableAttributes,
                ]);
                await index.updateSortableAttributes([...config.sortableAttributes]);
                await index.updateRankingRules([...config.rankingRules]);
                this.logger.log(`Initialized index: ${indexName}`);
            }
            catch (error) {
                if (error?.code === 'index_already_exists') {
                    this.logger.debug(`Index already exists: ${indexName}`);
                }
                else {
                    this.logger.error(`Failed to initialize index ${indexName}:`, error);
                }
            }
        }
    }
    async search(query, options = {}) {
        const { indexes, limit = 20, offset = 0, filters } = options;
        const targetIndexes = indexes?.filter((i) => i in search_indexes_1.SEARCH_INDEXES) ||
            Object.keys(search_indexes_1.SEARCH_INDEXES);
        const results = {};
        const searchPromises = targetIndexes.map(async (indexName) => {
            try {
                const index = this.getIndex(indexName);
                const filterArray = filters
                    ? Object.entries(filters).map(([k, v]) => `${k} = ${typeof v === 'string' ? `"${v}"` : v}`)
                    : undefined;
                const searchResult = await index.search(query, {
                    limit,
                    offset,
                    filter: filterArray,
                    attributesToHighlight: ['*'],
                    highlightPreTag: '<mark>',
                    highlightPostTag: '</mark>',
                });
                results[indexName] = {
                    hits: searchResult.hits,
                    totalHits: searchResult.estimatedTotalHits || searchResult.hits.length,
                    processingTimeMs: searchResult.processingTimeMs,
                };
            }
            catch (error) {
                this.logger.warn(`Search failed for index ${indexName}:`, error);
                results[indexName] = { hits: [], totalHits: 0, processingTimeMs: 0 };
            }
        });
        await Promise.all(searchPromises);
        return results;
    }
    async autocomplete(query, options = {}) {
        const { index: indexName = 'users', limit = 5 } = options;
        const validIndex = indexName in search_indexes_1.SEARCH_INDEXES ? indexName : 'users';
        try {
            const index = this.getIndex(validIndex);
            const searchResult = await index.search(query, {
                limit,
                attributesToHighlight: ['*'],
                highlightPreTag: '<mark>',
                highlightPostTag: '</mark>',
            });
            return searchResult.hits;
        }
        catch (error) {
            this.logger.warn(`Autocomplete failed for index ${validIndex}:`, error);
            return [];
        }
    }
    async addDocuments(entityType, documents) {
        if (!documents.length)
            return;
        try {
            const index = this.getIndex(entityType);
            await index.addDocuments(documents);
            this.logger.debug(`Added ${documents.length} documents to ${entityType}`);
        }
        catch (error) {
            this.logger.error(`Failed to add documents to ${entityType}:`, error);
        }
    }
    async updateDocuments(entityType, documents) {
        if (!documents.length)
            return;
        try {
            const index = this.getIndex(entityType);
            await index.updateDocuments(documents);
            this.logger.debug(`Updated ${documents.length} documents in ${entityType}`);
        }
        catch (error) {
            this.logger.error(`Failed to update documents in ${entityType}:`, error);
        }
    }
    async deleteDocument(entityType, documentId) {
        try {
            const index = this.getIndex(entityType);
            await index.deleteDocument(documentId);
            this.logger.debug(`Deleted document ${documentId} from ${entityType}`);
        }
        catch (error) {
            this.logger.error(`Failed to delete document from ${entityType}:`, error);
        }
    }
    async deleteDocuments(entityType, documentIds) {
        if (!documentIds.length)
            return;
        try {
            const index = this.getIndex(entityType);
            await index.deleteDocuments(documentIds);
            this.logger.debug(`Deleted ${documentIds.length} documents from ${entityType}`);
        }
        catch (error) {
            this.logger.error(`Failed to delete documents from ${entityType}:`, error);
        }
    }
    async clearIndex(entityType) {
        try {
            const index = this.getIndex(entityType);
            await index.deleteAllDocuments();
            this.logger.log(`Cleared index: ${entityType}`);
        }
        catch (error) {
            this.logger.error(`Failed to clear index ${entityType}:`, error);
        }
    }
    async getIndexStats() {
        const stats = {};
        for (const key of Object.keys(search_indexes_1.SEARCH_INDEXES)) {
            try {
                const index = this.getIndex(key);
                const indexStats = await index.getStats();
                stats[key] = {
                    numberOfDocuments: indexStats.numberOfDocuments,
                    isIndexing: indexStats.isIndexing,
                };
            }
            catch (error) {
                stats[key] = { numberOfDocuments: 0, isIndexing: false };
            }
        }
        return stats;
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = SearchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SearchService);
//# sourceMappingURL=search.service.js.map