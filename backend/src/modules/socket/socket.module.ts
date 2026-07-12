import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SocketService } from './socket.service.js';
import { SocketGateway } from './socket.gateway.js';
import { WsJwtGuard } from './ws-jwt.guard.js';
import { ChatModule } from '../chat/chat.module.js';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret') || 'fallback-secret',
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiration', '15m') as any,
        },
      }),
      inject: [ConfigService],
    }),
    ChatModule,
  ],
  providers: [SocketService, SocketGateway, WsJwtGuard],
  exports: [SocketService, SocketGateway],
})
export class SocketModule {}
