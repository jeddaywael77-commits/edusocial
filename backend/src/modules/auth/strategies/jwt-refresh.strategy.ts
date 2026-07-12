import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../database/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshSecret')!,
    });
  }

  async validate(payload: any, done: (err: any, user?: any) => void) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, refreshToken: true, isActive: true },
      });

      if (!user || !user.isActive || !user.refreshToken) {
        return done(new UnauthorizedException('Invalid refresh token'));
      }

      // Attach the raw token from the request so AuthService can verify it against the hash
      return done(null, { sub: user.id });
    } catch (error) {
      return done(error);
    }
  }
}
