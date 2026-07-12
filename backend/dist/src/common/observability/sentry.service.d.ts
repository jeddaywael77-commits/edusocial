import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class SentryService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private readonly logger;
    private initialized;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    captureException(error: Error, context?: Record<string, any>): void;
    captureMessage(message: string, level?: 'info' | 'warning' | 'error'): void;
    setUser(user: {
        id: string;
        email?: string;
        role?: string;
    }): void;
}
