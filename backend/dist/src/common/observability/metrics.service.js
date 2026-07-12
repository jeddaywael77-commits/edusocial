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
var MetricsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prom_client_1 = require("prom-client");
let MetricsService = MetricsService_1 = class MetricsService {
    configService;
    logger = new common_1.Logger(MetricsService_1.name);
    register;
    httpRequestDuration;
    httpRequestTotal;
    httpErrorsTotal;
    activeConnections;
    slowRequestTotal;
    aiRequestDuration;
    aiRequestTotal;
    aiTokensUsed;
    aiProviderErrors;
    socketConnections;
    socketMessagesTotal;
    socketErrorsTotal;
    dbQueryDuration;
    dbQueryTotal;
    dbSlowQueryTotal;
    searchRequestDuration;
    searchRequestTotal;
    mediaUploadTotal;
    mediaUploadSize;
    constructor(configService) {
        this.configService = configService;
        this.register = new prom_client_1.Registry();
        (0, prom_client_1.collectDefaultMetrics)({ register: this.register, prefix: 'edusocial_' });
        this.httpRequestDuration = new prom_client_1.Histogram({
            name: 'edusocial_http_request_duration_seconds',
            help: 'Duration of HTTP requests in seconds',
            labelNames: ['method', 'route', 'status_code'],
            buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
            registers: [this.register],
        });
        this.httpRequestTotal = new prom_client_1.Counter({
            name: 'edusocial_http_requests_total',
            help: 'Total number of HTTP requests',
            labelNames: ['method', 'route', 'status_code'],
            registers: [this.register],
        });
        this.httpErrorsTotal = new prom_client_1.Counter({
            name: 'edusocial_http_errors_total',
            help: 'Total number of HTTP errors (4xx and 5xx)',
            labelNames: ['method', 'route', 'status_code'],
            registers: [this.register],
        });
        this.activeConnections = new prom_client_1.Gauge({
            name: 'edusocial_active_connections',
            help: 'Number of active connections',
            registers: [this.register],
        });
        this.slowRequestTotal = new prom_client_1.Counter({
            name: 'edusocial_slow_requests_total',
            help: 'Total number of slow requests (>1s)',
            labelNames: ['method', 'route'],
            registers: [this.register],
        });
        this.aiRequestDuration = new prom_client_1.Histogram({
            name: 'edusocial_ai_request_duration_seconds',
            help: 'Duration of AI requests in seconds',
            labelNames: ['provider', 'feature'],
            buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60],
            registers: [this.register],
        });
        this.aiRequestTotal = new prom_client_1.Counter({
            name: 'edusocial_ai_requests_total',
            help: 'Total number of AI requests',
            labelNames: ['provider', 'feature', 'status'],
            registers: [this.register],
        });
        this.aiTokensUsed = new prom_client_1.Counter({
            name: 'edusocial_ai_tokens_used_total',
            help: 'Total tokens consumed by AI',
            labelNames: ['provider', 'feature'],
            registers: [this.register],
        });
        this.aiProviderErrors = new prom_client_1.Counter({
            name: 'edusocial_ai_provider_errors_total',
            help: 'Total AI provider errors',
            labelNames: ['provider', 'error_type'],
            registers: [this.register],
        });
        this.socketConnections = new prom_client_1.Gauge({
            name: 'edusocial_socket_connections',
            help: 'Number of active WebSocket connections',
            registers: [this.register],
        });
        this.socketMessagesTotal = new prom_client_1.Counter({
            name: 'edusocial_socket_messages_total',
            help: 'Total WebSocket messages',
            labelNames: ['event', 'direction'],
            registers: [this.register],
        });
        this.socketErrorsTotal = new prom_client_1.Counter({
            name: 'edusocial_socket_errors_total',
            help: 'Total WebSocket errors',
            labelNames: ['error_type'],
            registers: [this.register],
        });
        this.dbQueryDuration = new prom_client_1.Histogram({
            name: 'edusocial_db_query_duration_seconds',
            help: 'Duration of database queries in seconds',
            labelNames: ['operation', 'model'],
            buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
            registers: [this.register],
        });
        this.dbQueryTotal = new prom_client_1.Counter({
            name: 'edusocial_db_query_total',
            help: 'Total number of database queries',
            labelNames: ['operation', 'model'],
            registers: [this.register],
        });
        this.dbSlowQueryTotal = new prom_client_1.Counter({
            name: 'edusocial_db_slow_queries_total',
            help: 'Total number of slow database queries (>500ms)',
            labelNames: ['operation', 'model'],
            registers: [this.register],
        });
        this.searchRequestDuration = new prom_client_1.Histogram({
            name: 'edusocial_search_request_duration_seconds',
            help: 'Duration of search requests in seconds',
            labelNames: ['index'],
            buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2],
            registers: [this.register],
        });
        this.searchRequestTotal = new prom_client_1.Counter({
            name: 'edusocial_search_requests_total',
            help: 'Total number of search requests',
            labelNames: ['index', 'status'],
            registers: [this.register],
        });
        this.mediaUploadTotal = new prom_client_1.Counter({
            name: 'edusocial_media_uploads_total',
            help: 'Total number of media uploads',
            labelNames: ['category', 'status'],
            registers: [this.register],
        });
        this.mediaUploadSize = new prom_client_1.Histogram({
            name: 'edusocial_media_upload_size_bytes',
            help: 'Size of media uploads in bytes',
            labelNames: ['category'],
            buckets: [1024, 10240, 102400, 1048576, 10485760, 52428800],
            registers: [this.register],
        });
    }
    onModuleInit() {
        this.logger.log('Metrics service initialized');
    }
    recordHttpRequest(method, route, statusCode, durationMs) {
        const durationSec = durationMs / 1000;
        const labels = { method, route, status_code: statusCode.toString() };
        this.httpRequestDuration.observe(labels, durationSec);
        this.httpRequestTotal.inc(labels);
        if (statusCode >= 400) {
            this.httpErrorsTotal.inc(labels);
        }
    }
    recordSlowRequest(method, route, durationMs) {
        this.slowRequestTotal.inc({ method, route });
    }
    recordAiRequest(provider, feature, durationMs, status, tokens) {
        const durationSec = durationMs / 1000;
        this.aiRequestDuration.observe({ provider, feature }, durationSec);
        this.aiRequestTotal.inc({ provider, feature, status });
        if (tokens) {
            this.aiTokensUsed.inc({ provider, feature }, tokens);
        }
    }
    recordAiError(provider, errorType) {
        this.aiProviderErrors.inc({ provider, error_type: errorType });
    }
    recordSocketConnection(connected) {
        if (connected) {
            this.socketConnections.inc();
        }
        else {
            this.socketConnections.dec();
        }
    }
    recordSocketMessage(event, direction) {
        this.socketMessagesTotal.inc({ event, direction });
    }
    recordSocketError(errorType) {
        this.socketErrorsTotal.inc({ error_type: errorType });
    }
    recordDbQuery(operation, model, durationMs) {
        const durationSec = durationMs / 1000;
        this.dbQueryDuration.observe({ operation, model }, durationSec);
        this.dbQueryTotal.inc({ operation, model });
        if (durationMs > 500) {
            this.dbSlowQueryTotal.inc({ operation, model });
        }
    }
    recordSearchRequest(index, durationMs, status) {
        const durationSec = durationMs / 1000;
        this.searchRequestDuration.observe({ index }, durationSec);
        this.searchRequestTotal.inc({ index, status });
    }
    recordMediaUpload(category, sizeBytes, status) {
        this.mediaUploadTotal.inc({ category, status });
        this.mediaUploadSize.observe({ category }, sizeBytes);
    }
    async getMetrics() {
        return this.register.metrics();
    }
    async getMetricsJson() {
        const metrics = await this.register.getMetricsAsJSON();
        return metrics;
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = MetricsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MetricsService);
//# sourceMappingURL=metrics.service.js.map