import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { MetricsService } from './metrics.service';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const requestId =
      request.headers['x-request-id'] ||
      request.headers['x-correlation-id'] ||
      uuid();
    const correlationId = request.headers['x-correlation-id'] || requestId;
    const startTime = Date.now();

    request['requestId'] = requestId;
    request['correlationId'] = correlationId;
    response.setHeader('X-Request-Id', requestId);
    response.setHeader('X-Correlation-Id', correlationId);

    const method = request.method;
    const req = request as unknown as Record<string, unknown>;
    const route: string =
      String(req.route && (req.route as { path?: string }).path) || request.url;

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const status = response.statusCode;

          this.metricsService.recordHttpRequest(
            method,
            route,
            status,
            duration,
          );

          if (duration > 1000) {
            this.metricsService.recordSlowRequest(method, route, duration);
          }
        },
        error: (err: Error & { status?: number; statusCode?: number }) => {
          const duration = Date.now() - startTime;
          const status = err.status || err.statusCode || 500;

          this.metricsService.recordHttpRequest(
            method,
            route,
            status,
            duration,
          );
        },
      }),
    );
  }
}
