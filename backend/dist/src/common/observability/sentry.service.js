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
var SentryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let SentryService = SentryService_1 = class SentryService {
    configService;
    logger = new common_1.Logger(SentryService_1.name);
    initialized = false;
    constructor(configService) {
        this.configService = configService;
    }
    async onModuleInit() {
        const dsn = this.configService.get('SENTRY_DSN');
        if (!dsn) {
            this.logger.log('Sentry DSN not configured, skipping initialization');
            return;
        }
        try {
            const Sentry = await import('@sentry/nestjs');
            Sentry.init({
                dsn,
                environment: this.configService.get('NODE_ENV') || 'development',
                release: this.configService.get('APP_VERSION') || '1.0.0',
                tracesSampleRate: parseFloat(this.configService.get('SENTRY_TRACES_SAMPLE_RATE') || '0.1'),
                profilesSampleRate: parseFloat(this.configService.get('SENTRY_PROFILES_SAMPLE_RATE') ||
                    '0.1'),
                beforeSend: (event) => {
                    if (event.request?.headers) {
                        const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
                        for (const header of sensitiveHeaders) {
                            if (event.request.headers[header]) {
                                event.request.headers[header] = '[Filtered]';
                            }
                        }
                    }
                    return event;
                },
            });
            this.initialized = true;
            this.logger.log('Sentry initialized');
        }
        catch (error) {
            this.logger.error('Failed to initialize Sentry', error);
        }
    }
    async onModuleDestroy() {
        if (this.initialized) {
            try {
                const Sentry = await import('@sentry/nestjs');
                await Sentry.close(2000);
            }
            catch {
            }
        }
    }
    captureException(error, context) {
        if (!this.initialized)
            return;
        void import('@sentry/nestjs').then((Sentry) => {
            Sentry.withScope((scope) => {
                if (context) {
                    Object.entries(context).forEach(([key, value]) => {
                        scope.setExtra(key, value);
                    });
                }
                Sentry.captureException(error);
            });
        });
    }
    captureMessage(message, level = 'info') {
        if (!this.initialized)
            return;
        void import('@sentry/nestjs').then((Sentry) => {
            Sentry.captureMessage(message, level);
        });
    }
    setUser(user) {
        if (!this.initialized)
            return;
        void import('@sentry/nestjs').then((Sentry) => {
            Sentry.setUser({ id: user.id, email: user.email, username: user.role });
        });
    }
};
exports.SentryService = SentryService;
exports.SentryService = SentryService = SentryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SentryService);
//# sourceMappingURL=sentry.service.js.map