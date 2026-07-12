"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservabilityModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nestjs_pino_1 = require("nestjs-pino");
const core_1 = require("@nestjs/core");
const request_id_interceptor_1 = require("./request-id.interceptor");
const sentry_filter_1 = require("./sentry.filter");
const metrics_service_1 = require("./metrics.service");
const sentry_service_1 = require("./sentry.service");
const tracing_service_1 = require("./tracing.service");
const metrics_controller_1 = require("./metrics.controller");
let ObservabilityModule = class ObservabilityModule {
};
exports.ObservabilityModule = ObservabilityModule;
exports.ObservabilityModule = ObservabilityModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            nestjs_pino_1.LoggerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: () => ({
                    pinoHttp: {
                        level: process.env.LOG_LEVEL ||
                            (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
                        transport: process.env.NODE_ENV === 'production'
                            ? undefined
                            : {
                                target: 'pino-pretty',
                                options: { colorize: true, singleLine: true },
                            },
                        autoLogging: {
                            ignore: (req) => req.url === '/health' ||
                                req.url === '/health/live' ||
                                req.url === '/metrics',
                        },
                        serializers: {
                            req: (req) => {
                                const r = req;
                                const user = r.user;
                                return {
                                    id: r.id,
                                    method: req.method,
                                    url: req.url,
                                    userId: user?.sub,
                                    ip: req.ip,
                                };
                            },
                            res: (res) => ({
                                statusCode: res.statusCode,
                            }),
                        },
                        customLogLevel: (_req, res, err) => {
                            if (res.statusCode >= 500 || err)
                                return 'error';
                            if (res.statusCode >= 400)
                                return 'warn';
                            return 'info';
                        },
                    },
                }),
            }),
        ],
        controllers: [metrics_controller_1.MetricsController],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: request_id_interceptor_1.RequestIdInterceptor,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: sentry_filter_1.SentryFilter,
            },
            metrics_service_1.MetricsService,
            sentry_service_1.SentryService,
            tracing_service_1.TracingService,
        ],
        exports: [metrics_service_1.MetricsService, sentry_service_1.SentryService, tracing_service_1.TracingService],
    })
], ObservabilityModule);
//# sourceMappingURL=observability.module.js.map