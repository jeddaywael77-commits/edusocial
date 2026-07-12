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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestIdInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const uuid_1 = require("uuid");
const metrics_service_1 = require("./metrics.service");
let RequestIdInterceptor = class RequestIdInterceptor {
    metricsService;
    constructor(metricsService) {
        this.metricsService = metricsService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const requestId = request.headers['x-request-id'] ||
            request.headers['x-correlation-id'] ||
            (0, uuid_1.v4)();
        const correlationId = request.headers['x-correlation-id'] || requestId;
        const startTime = Date.now();
        request['requestId'] = requestId;
        request['correlationId'] = correlationId;
        response.setHeader('X-Request-Id', requestId);
        response.setHeader('X-Correlation-Id', correlationId);
        const method = request.method;
        const req = request;
        const route = String(req.route && req.route.path) || request.url;
        return next.handle().pipe((0, rxjs_1.tap)({
            next: () => {
                const duration = Date.now() - startTime;
                const status = response.statusCode;
                this.metricsService.recordHttpRequest(method, route, status, duration);
                if (duration > 1000) {
                    this.metricsService.recordSlowRequest(method, route, duration);
                }
            },
            error: (err) => {
                const duration = Date.now() - startTime;
                const status = err.status || err.statusCode || 500;
                this.metricsService.recordHttpRequest(method, route, status, duration);
            },
        }));
    }
};
exports.RequestIdInterceptor = RequestIdInterceptor;
exports.RequestIdInterceptor = RequestIdInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [metrics_service_1.MetricsService])
], RequestIdInterceptor);
//# sourceMappingURL=request-id.interceptor.js.map