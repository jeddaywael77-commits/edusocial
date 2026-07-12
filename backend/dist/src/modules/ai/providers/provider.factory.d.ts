import { ConfigService } from '@nestjs/config';
import type { AIProvider } from './ai-provider.interface';
export declare class ProviderFactory {
    private readonly config;
    private readonly logger;
    private providers;
    private activeProvider;
    constructor(config: ConfigService);
    private initializeProviders;
    getProvider(name?: string): AIProvider;
    getActiveProvider(): AIProvider;
    setActiveProvider(name: string): void;
    getAvailableProviders(): string[];
}
