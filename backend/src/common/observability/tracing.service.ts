import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TracingService implements OnModuleInit {
  private readonly logger = new Logger(TracingService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const enabled = this.configService.get<string>('OTEL_ENABLED') === 'true';
    if (!enabled) {
      this.logger.log(
        'OpenTelemetry disabled (set OTEL_ENABLED=true to enable)',
      );
      return;
    }

    try {
      const { NodeSDK } = await import('@opentelemetry/sdk-node');
      const { getNodeAutoInstrumentations } =
        await import('@opentelemetry/auto-instrumentations-node');
      const { OTLPTraceExporter } =
        await import('@opentelemetry/exporter-trace-otlp-http');
      const { OTLPMetricExporter } =
        await import('@opentelemetry/exporter-metrics-otlp-http');
      const { PeriodicExportingMetricReader } =
        await import('@opentelemetry/sdk-metrics');

      const endpoint =
        this.configService.get<string>('OTEL_EXPORTER_OTLP_ENDPOINT') ||
        'http://localhost:4318';

      const traceExporter = new OTLPTraceExporter({
        url: `${endpoint}/v1/traces`,
      });
      const metricExporter = new OTLPMetricExporter({
        url: `${endpoint}/v1/metrics`,
      });

      const sdk = new NodeSDK({
        traceExporter,
        metricReader: new PeriodicExportingMetricReader({
          exporter: metricExporter,
          exportIntervalMillis: 15000,
        }),
        instrumentations: [
          getNodeAutoInstrumentations({
            '@opentelemetry/instrumentation-http': { enabled: true },
            '@opentelemetry/instrumentation-express': { enabled: true },
          }),
        ],
      });

      sdk.start();
      this.logger.log(`OpenTelemetry initialized, exporting to ${endpoint}`);
    } catch (error) {
      this.logger.error('Failed to initialize OpenTelemetry', error);
    }
  }
}
