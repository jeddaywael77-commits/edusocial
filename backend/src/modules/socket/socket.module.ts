import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { WsJwtGuard } from './ws-jwt.guard';
import { ChatModule } from '../chat/chat.module';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
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
