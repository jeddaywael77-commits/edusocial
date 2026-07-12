import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { Request, Response } from 'express';
import { RequestIdInterceptor } from './request-id.interceptor';
import { SentryFilter } from './sentry.filter';
import { MetricsService } from './metrics.service';
import { SentryService } from './sentry.service';
import { TracingService } from './tracing.service';
import { MetricsController } from './metrics.controller';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        pinoHttp: {
          level:
            process.env.LOG_LEVEL ||
            (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
          transport:
            process.env.NODE_ENV === 'production'
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: { colorize: true, singleLine: true },
                },
          autoLogging: {
            ignore: (req: Request) =>
              req.url === '/health' ||
              req.url === '/health/live' ||
              req.url === '/metrics',
          },
          serializers: {
            req: (req: Request) => {
              const r = req as unknown as Record<string, unknown>;
              const user = r.user as Record<string, unknown> | undefined;
              return {
                id: r.id,
                method: req.method,
                url: req.url,
                userId: user?.sub,
                ip: req.ip,
              };
            },
            res: (res: Response) => ({
              statusCode: res.statusCode,
            }),
          },
          customLogLevel: (_req: Request, res: Response, err?: Error) => {
            if (res.statusCode >= 500 || err) return 'error';
            if (res.statusCode >= 400) return 'warn';
            return 'info';
          },
        },
      }),
    }),
  ],
  controllers: [MetricsController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestIdInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: SentryFilter,
    },
    MetricsService,
    SentryService,
    TracingService,
  ],
  exports: [MetricsService, SentryService, TracingService],
})
export class ObservabilityModule {}
