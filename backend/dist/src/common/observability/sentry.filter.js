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
var SentryFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryFilter = void 0;
const common_1 = require("@nestjs/common");
const sentry_service_1 = require("./sentry.service");
let SentryFilter = SentryFilter_1 = class SentryFilter {
    sentryService;
    logger = new common_1.Logger(SentryFilter_1.name);
    constructor(sentryService) {
        this.sentryService = sentryService;
    }
    catch(exception, context) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const status = exception instanceof common_1.HttpException ? exception.getStatus() : 500;
        if (status >= 500) {
            this.sentryService.captureException(exception, {
                url: request.url,
                method: request.method,
                userId: request.user?.sub,
                requestId: request['requestId'],
            });
        }
        const message = exception instanceof common_1.HttpException
            ? exception.message
            : 'Internal server error';
        response.status(status).json({
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            requestId: request['requestId'],
        });
    }
};
exports.SentryFilter = SentryFilter;
exports.SentryFilter = SentryFilter = SentryFilter_1 = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [sentry_service_1.SentryService])
], SentryFilter);
//# sourceMappingURL=sentry.filter.js.map