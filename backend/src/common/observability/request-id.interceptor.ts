import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  private readonly logger = new Logger('RequestId');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const requestId = request.headers['x-request-id'] || uuid();
    const startTime = Date.now();

    request['requestId'] = requestId;

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const userId = request.user?.sub || 'anonymous';
        const method = request.method;
        const url = request.url;
        const status = context.switchToHttp().getResponse().statusCode;

        if (duration > 1000) {
          this.logger.warn(
            `${method} ${url} ${status} ${duration}ms [${requestId}] user:${userId} SLOW`,
          );
        }
      }),
    );
  }
}
