import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AIProvider } from './ai-provider.interface';
import { OpenAIProvider } from './openai.provider';
import { GroqProvider } from './groq.provider';
import { OllamaProvider } from './ollama.provider';
import { GeminiProvider } from './gemini.provider';

@Injectable()
export class ProviderFactory {
  private readonly logger = new Logger(ProviderFactory.name);
  private providers: Map<string, AIProvider> = new Map();
  private activeProvider: AIProvider;

  constructor(private readonly config: ConfigService) {
    this.initializeProviders();
    this.activeProvider = this.getProvider(
      this.config.get<string>('ai.provider') || 'openai',
    );
    this.logger.log(`Active AI provider: ${this.activeProvider.name}`);
  }

  private initializeProviders() {
    // OpenAI
    const openaiKey = this.config.get<string>('ai.openaiApiKey');
    if (openaiKey) {
      this.providers.set(
        'openai',
        new OpenAIProvider({
          apiKey: openaiKey,
          baseUrl:
            this.config.get<string>('ai.openaiBaseUrl') ||
            'https://api.openai.com/v1',
          model: this.config.get<string>('ai.openaiModel') || 'gpt-4o-mini',
          embeddingModel:
            this.config.get<string>('ai.embeddingModel') ||
            'text-embedding-3-small',
        }),
      );
    }

    // Groq
    const groqKey = this.config.get<string>('ai.groqApiKey');
    if (groqKey) {
      this.providers.set(
        'groq',
        new GroqProvider({
          apiKey: groqKey,
          baseUrl:
            this.config.get<string>('ai.groqBaseUrl') ||
            'https://api.groq.com/openai/v1',
          model:
            this.config.get<string>('ai.groqModel') ||
            'llama-3.3-70b-versatile',
        }),
      );
    }

    // Ollama (always available if running)
    this.providers.set(
      'ollama',
      new OllamaProvider({
        baseUrl:
          this.config.get<string>('ai.ollamaBaseUrl') ||
          'http://localhost:11434',
        model: this.config.get<string>('ai.ollamaModel') || 'llama3.1',
      }),
    );

    // Gemini
    const geminiKey = this.config.get<string>('ai.geminiApiKey');
    if (geminiKey) {
      this.providers.set(
        'gemini',
        new GeminiProvider({
          apiKey: geminiKey,
          model:
            this.config.get<string>('ai.geminiModel') || 'gemini-2.0-flash',
        }),
      );
    }

    this.logger.log(
      `Initialized providers: ${[...this.providers.keys()].join(', ')}`,
    );
  }

  getProvider(name?: string): AIProvider {
    const providerName =
      name || this.config.get<string>('ai.provider') || 'openai';
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(
        `AI provider "${providerName}" not available. Available: ${[...this.providers.keys()].join(', ')}`,
      );
    }
    return provider;
  }

  getActiveProvider(): AIProvider {
    return this.activeProvider;
  }

  setActiveProvider(name: string): void {
    this.activeProvider = this.getProvider(name);
    this.logger.log(`Active AI provider changed to: ${name}`);
  }

  getAvailableProviders(): string[] {
    return [...this.providers.keys()];
  }
}
