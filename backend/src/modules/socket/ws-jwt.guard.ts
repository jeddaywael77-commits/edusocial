import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PrismaService } from '../../database/prisma.service';
import { WsJwtPayload, WsUser } from './ws-user.interface';

interface TypedSocket extends Socket {
  data: { user: WsUser };
}

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<TypedSocket>();
    const token = this.extractToken(client);

    if (!token) {
      throw new WsException('Unauthorized: No token provided');
    }

    try {
      const secret =
        this.configService.get<string>('jwt.secret') || 'fallback-secret';
      const payload = await this.jwtService.verifyAsync<WsJwtPayload>(token, {
        secret,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          isActive: true,
        },
      });

      if (!user || !user.isActive) {
        throw new WsException('Unauthorized: User not found or inactive');
      }

      client.data.user = {
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      };
      return true;
    } catch (error) {
      if (error instanceof WsException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`WS auth failed: ${message}`);
      throw new WsException('Unauthorized: Invalid token');
    }
  }

  private extractToken(client: Socket): string | null {
    const token =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.replace('Bearer ', '') ||
      client.handshake.query?.token;
    return typeof token === 'string' ? token : null;
  }
}
