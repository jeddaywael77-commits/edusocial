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
var VectorStoreService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorStoreService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const js_client_rest_1 = require("@qdrant/js-client-rest");
let VectorStoreService = VectorStoreService_1 = class VectorStoreService {
    config;
    logger = new common_1.Logger(VectorStoreService_1.name);
    client;
    collectionPrefix;
    constructor(config) {
        this.config = config;
        const qdrantUrl = this.config.get('ai.qdrantUrl') || 'http://localhost:6333';
        const qdrantApiKey = this.config.get('ai.qdrantApiKey');
        this.collectionPrefix =
            this.config.get('ai.qdrantCollectionPrefix') || 'edusocial_';
        this.client = new js_client_rest_1.QdrantClient({
            url: qdrantUrl,
            apiKey: qdrantApiKey || undefined,
        });
        this.logger.log(`Qdrant client initialized: ${qdrantUrl}`);
    }
    getCollectionName(name) {
        return `${this.collectionPrefix}${name}`;
    }
    async ensureCollection(name, dimensions) {
        const collectionName = this.getCollectionName(name);
        try {
            await this.client.getCollection(collectionName);
        }
        catch {
            await this.client.createCollection(collectionName, {
                vectors: {
                    size: dimensions,
                    distance: 'Cosine',
                },
                optimizers_config: {
                    indexing_threshold: 20000,
                },
            });
            this.logger.log(`Created Qdrant collection: ${collectionName}`);
        }
    }
    async upsert(documents) {
        const grouped = new Map();
        for (const doc of documents) {
            const key = doc.collection;
            if (!grouped.has(key))
                grouped.set(key, []);
            grouped.get(key).push(doc);
        }
        for (const [collection, docs] of grouped) {
            const collectionName = this.getCollectionName(collection);
            await this.client.upsert(collectionName, {
                points: docs.map((doc) => ({
                    id: doc.id,
                    vector: doc.vector,
                    payload: doc.payload,
                })),
            });
            this.logger.debug(`Upserted ${docs.length} documents into ${collectionName}`);
        }
    }
    async search(collection, vector, options = {}) {
        const collectionName = this.getCollectionName(collection);
        const { limit = 10, filter, scoreThreshold = 0.5 } = options;
        const results = await this.client.search(collectionName, {
            vector,
            limit,
            filter: filter ? this.buildFilter(filter) : undefined,
            score_threshold: scoreThreshold,
            with_payload: true,
        });
        return results.map((r) => ({
            id: String(r.id),
            score: r.score,
            payload: r.payload,
        }));
    }
    async deleteByIds(collection, ids) {
        const collectionName = this.getCollectionName(collection);
        await this.client.delete(collectionName, {
            points: ids,
        });
    }
    async deleteByFilter(collection, filter) {
        const collectionName = this.getCollectionName(collection);
        await this.client.delete(collectionName, {
            filter: this.buildFilter(filter),
        });
    }
    async getCollectionInfo(collection) {
        const collectionName = this.getCollectionName(collection);
        try {
            const info = await this.client.getCollection(collectionName);
            return {
                pointsCount: info.points_count || 0,
                status: info.status || 'unknown',
            };
        }
        catch {
            return { pointsCount: 0, status: 'not_found' };
        }
    }
    buildFilter(filter) {
        const must = [];
        for (const [key, value] of Object.entries(filter)) {
            if (typeof value === 'string' ||
                typeof value === 'number' ||
                typeof value === 'boolean') {
                must.push({
                    key,
                    match: { value },
                });
            }
        }
        return { must };
    }
};
exports.VectorStoreService = VectorStoreService;
exports.VectorStoreService = VectorStoreService = VectorStoreService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], VectorStoreService);
//# sourceMappingURL=vector-store.service.js.map