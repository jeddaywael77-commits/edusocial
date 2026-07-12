import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingModule } from './logging.module';
import { RequestIdInterceptor } from './request-id.interceptor';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: (configService: ConfigService) => {
        return new RequestIdInterceptor();
      },
      inject: [ConfigService],
    },
  ],
})
export class ObservabilityModule {}
