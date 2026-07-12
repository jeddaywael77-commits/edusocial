import { ExceptionFilter, ExecutionContext } from '@nestjs/common';
import { SentryService } from './sentry.service';
export declare class SentryFilter implements ExceptionFilter {
    private readonly sentryService;
    private readonly logger;
    constructor(sentryService: SentryService);
    catch(exception: unknown, context: ExecutionContext): void;
}
