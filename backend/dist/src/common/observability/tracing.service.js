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
var TracingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TracingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let TracingService = TracingService_1 = class TracingService {
    configService;
    logger = new common_1.Logger(TracingService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    async onModuleInit() {
        const enabled = this.configService.get('OTEL_ENABLED') === 'true';
        if (!enabled) {
            this.logger.log('OpenTelemetry disabled (set OTEL_ENABLED=true to enable)');
            return;
        }
        try {
            const { NodeSDK } = await import('@opentelemetry/sdk-node');
            const { getNodeAutoInstrumentations } = await import('@opentelemetry/auto-instrumentations-node');
            const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
            const { OTLPMetricExporter } = await import('@opentelemetry/exporter-metrics-otlp-http');
            const { PeriodicExportingMetricReader } = await import('@opentelemetry/sdk-metrics');
            const endpoint = this.configService.get('OTEL_EXPORTER_OTLP_ENDPOINT') ||
                'http://localhost:4318';
            const traceExporter = new OTLPTraceExporter({
                url: `${endpoint}/v1/traces`,
            });
            const metricExporter = new OTLPMetricExporter({
                url: `${endpoint}/v1/metrics`,
            });
            const sdk = new NodeSDK({
                traceExporter,
                metricReader: new PeriodicExportingMetricReader({
                    exporter: metricExporter,
                    exportIntervalMillis: 15000,
                }),
                instrumentations: [
                    getNodeAutoInstrumentations({
                        '@opentelemetry/instrumentation-http': { enabled: true },
                        '@opentelemetry/instrumentation-express': { enabled: true },
                    }),
                ],
            });
            sdk.start();
            this.logger.log(`OpenTelemetry initialized, exporting to ${endpoint}`);
        }
        catch (error) {
            this.logger.error('Failed to initialize OpenTelemetry', error);
        }
    }
};
exports.TracingService = TracingService;
exports.TracingService = TracingService = TracingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TracingService);
//# sourceMappingURL=tracing.service.js.map