import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Counter,
  Histogram,
  Gauge,
  Registry,
  collectDefaultMetrics,
} from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly logger = new Logger(MetricsService.name);
  readonly register: Registry;

  readonly httpRequestDuration: Histogram<string>;
  readonly httpRequestTotal: Counter<string>;
  readonly httpErrorsTotal: Counter<string>;
  readonly activeConnections: Gauge<string>;
  readonly slowRequestTotal: Counter<string>;

  readonly aiRequestDuration: Histogram<string>;
  readonly aiRequestTotal: Counter<string>;
  readonly aiTokensUsed: Counter<string>;
  readonly aiProviderErrors: Counter<string>;

  readonly socketConnections: Gauge<string>;
  readonly socketMessagesTotal: Counter<string>;
  readonly socketErrorsTotal: Counter<string>;

  readonly dbQueryDuration: Histogram<string>;
  readonly dbQueryTotal: Counter<string>;
  readonly dbSlowQueryTotal: Counter<string>;

  readonly searchRequestDuration: Histogram<string>;
  readonly searchRequestTotal: Counter<string>;

  readonly mediaUploadTotal: Counter<string>;
  readonly mediaUploadSize: Histogram<string>;

  constructor(private configService: ConfigService) {
    this.register = new Registry();

    collectDefaultMetrics({ register: this.register, prefix: 'edusocial_' });

    this.httpRequestDuration = new Histogram({
      name: 'edusocial_http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [this.register],
    });

    this.httpRequestTotal = new Counter({
      name: 'edusocial_http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.register],
    });

    this.httpErrorsTotal = new Counter({
      name: 'edusocial_http_errors_total',
      help: 'Total number of HTTP errors (4xx and 5xx)',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.register],
    });

    this.activeConnections = new Gauge({
      name: 'edusocial_active_connections',
      help: 'Number of active connections',
      registers: [this.register],
    });

    this.slowRequestTotal = new Counter({
      name: 'edusocial_slow_requests_total',
      help: 'Total number of slow requests (>1s)',
      labelNames: ['method', 'route'],
      registers: [this.register],
    });

    this.aiRequestDuration = new Histogram({
      name: 'edusocial_ai_request_duration_seconds',
      help: 'Duration of AI requests in seconds',
      labelNames: ['provider', 'feature'],
      buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60],
      registers: [this.register],
    });

    this.aiRequestTotal = new Counter({
      name: 'edusocial_ai_requests_total',
      help: 'Total number of AI requests',
      labelNames: ['provider', 'feature', 'status'],
      registers: [this.register],
    });

    this.aiTokensUsed = new Counter({
      name: 'edusocial_ai_tokens_used_total',
      help: 'Total tokens consumed by AI',
      labelNames: ['provider', 'feature'],
      registers: [this.register],
    });

    this.aiProviderErrors = new Counter({
      name: 'edusocial_ai_provider_errors_total',
      help: 'Total AI provider errors',
      labelNames: ['provider', 'error_type'],
      registers: [this.register],
    });

    this.socketConnections = new Gauge({
      name: 'edusocial_socket_connections',
      help: 'Number of active WebSocket connections',
      registers: [this.register],
    });

    this.socketMessagesTotal = new Counter({
      name: 'edusocial_socket_messages_total',
      help: 'Total WebSocket messages',
      labelNames: ['event', 'direction'],
      registers: [this.register],
    });

    this.socketErrorsTotal = new Counter({
      name: 'edusocial_socket_errors_total',
      help: 'Total WebSocket errors',
      labelNames: ['error_type'],
      registers: [this.register],
    });

    this.dbQueryDuration = new Histogram({
      name: 'edusocial_db_query_duration_seconds',
      help: 'Duration of database queries in seconds',
      labelNames: ['operation', 'model'],
      buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
      registers: [this.register],
    });

    this.dbQueryTotal = new Counter({
      name: 'edusocial_db_query_total',
      help: 'Total number of database queries',
      labelNames: ['operation', 'model'],
      registers: [this.register],
    });

    this.dbSlowQueryTotal = new Counter({
      name: 'edusocial_db_slow_queries_total',
      help: 'Total number of slow database queries (>500ms)',
      labelNames: ['operation', 'model'],
      registers: [this.register],
    });

    this.searchRequestDuration = new Histogram({
      name: 'edusocial_search_request_duration_seconds',
      help: 'Duration of search requests in seconds',
      labelNames: ['index'],
      buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2],
      registers: [this.register],
    });

    this.searchRequestTotal = new Counter({
      name: 'edusocial_search_requests_total',
      help: 'Total number of search requests',
      labelNames: ['index', 'status'],
      registers: [this.register],
    });

    this.mediaUploadTotal = new Counter({
      name: 'edusocial_media_uploads_total',
      help: 'Total number of media uploads',
      labelNames: ['category', 'status'],
      registers: [this.register],
    });

    this.mediaUploadSize = new Histogram({
      name: 'edusocial_media_upload_size_bytes',
      help: 'Size of media uploads in bytes',
      labelNames: ['category'],
      buckets: [1024, 10240, 102400, 1048576, 10485760, 52428800],
      registers: [this.register],
    });
  }

  onModuleInit() {
    this.logger.log('Metrics service initialized');
  }

  recordHttpRequest(
    method: string,
    route: string,
    statusCode: number,
    durationMs: number,
  ) {
    const durationSec = durationMs / 1000;
    const labels = { method, route, status_code: statusCode.toString() };
    this.httpRequestDuration.observe(labels, durationSec);
    this.httpRequestTotal.inc(labels);
    if (statusCode >= 400) {
      this.httpErrorsTotal.inc(labels);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  recordSlowRequest(method: string, route: string, durationMs: number) {
    this.slowRequestTotal.inc({ method, route });
  }

  recordAiRequest(
    provider: string,
    feature: string,
    durationMs: number,
    status: string,
    tokens?: number,
  ) {
    const durationSec = durationMs / 1000;
    this.aiRequestDuration.observe({ provider, feature }, durationSec);
    this.aiRequestTotal.inc({ provider, feature, status });
    if (tokens) {
      this.aiTokensUsed.inc({ provider, feature }, tokens);
    }
  }

  recordAiError(provider: string, errorType: string) {
    this.aiProviderErrors.inc({ provider, error_type: errorType });
  }

  recordSocketConnection(connected: boolean) {
    if (connected) {
      this.socketConnections.inc();
    } else {
      this.socketConnections.dec();
    }
  }

  recordSocketMessage(event: string, direction: 'inbound' | 'outbound') {
    this.socketMessagesTotal.inc({ event, direction });
  }

  recordSocketError(errorType: string) {
    this.socketErrorsTotal.inc({ error_type: errorType });
  }

  recordDbQuery(operation: string, model: string, durationMs: number) {
    const durationSec = durationMs / 1000;
    this.dbQueryDuration.observe({ operation, model }, durationSec);
    this.dbQueryTotal.inc({ operation, model });
    if (durationMs > 500) {
      this.dbSlowQueryTotal.inc({ operation, model });
    }
  }

  recordSearchRequest(index: string, durationMs: number, status: string) {
    const durationSec = durationMs / 1000;
    this.searchRequestDuration.observe({ index }, durationSec);
    this.searchRequestTotal.inc({ index, status });
  }

  recordMediaUpload(category: string, sizeBytes: number, status: string) {
    this.mediaUploadTotal.inc({ category, status });
    this.mediaUploadSize.observe({ category }, sizeBytes);
  }

  async getMetrics(): Promise<string> {
    return this.register.metrics();
  }

  async getMetricsJson() {
    const metrics = await this.register.getMetricsAsJSON();
    return metrics;
  }
}
