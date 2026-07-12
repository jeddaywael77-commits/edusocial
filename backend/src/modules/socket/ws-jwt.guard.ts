import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = this.extractToken(client);

    if (!token) {
      throw new WsException('Unauthorized: No token provided');
    }

    try {
      const secret = this.configService.get<string>('jwt.secret') || 'fallback-secret';
      const payload = await this.jwtService.verifyAsync(token, { secret });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, role: true, name: true, isActive: true },
      });

      if (!user || !user.isActive) {
        throw new WsException('Unauthorized: User not found or inactive');
      }

      const wsUser = {
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      };

      client.data.user = wsUser;
      return true;
    } catch (error) {
      if (error instanceof WsException) {
        throw error;
      }
      this.logger.warn(`WS auth failed: ${error.message}`);
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
