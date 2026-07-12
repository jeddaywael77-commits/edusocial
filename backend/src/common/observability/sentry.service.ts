import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SentryService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SentryService.name);
  private initialized = false;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const dsn = this.configService.get<string>('SENTRY_DSN');
    if (!dsn) {
      this.logger.log('Sentry DSN not configured, skipping initialization');
      return;
    }

    try {
      const Sentry = await import('@sentry/nestjs');
      Sentry.init({
        dsn,
        environment:
          this.configService.get<string>('NODE_ENV') || 'development',
        release: this.configService.get<string>('APP_VERSION') || '1.0.0',
        tracesSampleRate: parseFloat(
          this.configService.get<string>('SENTRY_TRACES_SAMPLE_RATE') || '0.1',
        ),
        profilesSampleRate: parseFloat(
          this.configService.get<string>('SENTRY_PROFILES_SAMPLE_RATE') ||
            '0.1',
        ),
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
    } catch (error) {
      this.logger.error('Failed to initialize Sentry', error);
    }
  }

  async onModuleDestroy() {
    if (this.initialized) {
      try {
        const Sentry = await import('@sentry/nestjs');
        await Sentry.close(2000);
      } catch {
        // ignore
      }
    }
  }

  captureException(error: Error, context?: Record<string, any>) {
    if (!this.initialized) return;
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

  captureMessage(
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
  ) {
    if (!this.initialized) return;
    void import('@sentry/nestjs').then((Sentry) => {
      Sentry.captureMessage(message, level);
    });
  }

  setUser(user: { id: string; email?: string; role?: string }) {
    if (!this.initialized) return;
    void import('@sentry/nestjs').then((Sentry) => {
      Sentry.setUser({ id: user.id, email: user.email, username: user.role });
    });
  }
}
