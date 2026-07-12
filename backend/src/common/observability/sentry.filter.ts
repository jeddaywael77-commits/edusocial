import {
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SentryService } from './sentry.service';

@Catch()
export class SentryFilter implements ExceptionFilter {
  private readonly logger = new Logger(SentryFilter.name);

  constructor(private readonly sentryService: SentryService) {}

  catch(exception: unknown, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    if (status >= 500) {
      this.sentryService.captureException(exception as Error, {
        url: request.url,
        method: request.method,
        userId: (request.user as Record<string, unknown> | undefined)?.sub,
        requestId: (request as unknown as Record<string, unknown>)['requestId'],
      });
    }

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      requestId: (request as unknown as Record<string, unknown>)['requestId'],
    });
  }
}
