import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { RegisterRole } from './dto/register.dto';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: { findUnique: jest.Mock; create: jest.Mock; update: jest.Mock };
  };
  let jwt: { signAsync: jest.Mock };
  let config: { get: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };
    jwt = { signAsync: jest.fn().mockResolvedValue('mock-token') };
    config = { get: jest.fn((key: string, defaultVal?: any) => defaultVal) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('register', () => {
    it('should throw ConflictException if email exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing' });
      await expect(
        service.register({
          name: 'Test',
          email: 'test@test.com',
          password: 'Pass1234',
          role: RegisterRole.STUDENT,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create user with hashed password', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: '1',
        name: 'Test',
        email: 'test@test.com',
        role: RegisterRole.STUDENT,
        avatar: null,
        bio: null,
        school: null,
        department: null,
        xp: 0,
        level: 1,
        coins: 50,
        createdAt: new Date(),
      });
      prisma.user.update.mockResolvedValue({});

      const result = await service.register({
        name: 'Test',
        email: 'test@test.com',
        password: 'Pass1234',
        role: RegisterRole.STUDENT,
      });

      expect(result.user).toBeDefined();
      expect(result.tokens).toBeDefined();
      expect(prisma.user.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException for invalid credentials', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        password: 'hashed',
        role: RegisterRole.STUDENT,
        name: 'Test',
        isActive: false,
      });
      await expect(
        service.login({ email: 'test@test.com', password: 'Pass1234' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const hashedPassword = await bcrypt.hash('correct', 12);
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        password: hashedPassword,
        role: RegisterRole.STUDENT,
        name: 'Test',
        isActive: true,
      });
      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return tokens on successful login', async () => {
      const hashedPassword = await bcrypt.hash('Pass1234', 12);
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        password: hashedPassword,
        role: RegisterRole.STUDENT,
        name: 'Test',
        isActive: true,
      });
      prisma.user.update.mockResolvedValue({});

      const result = await service.login({
        email: 'test@test.com',
        password: 'Pass1234',
      });

      expect(result.user).toBeDefined();
      expect(result.tokens).toBeDefined();
      expect(result.user.password).toBeUndefined();
    });
  });

  describe('refreshTokens', () => {
    it('should throw UnauthorizedException if no stored refresh token', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        role: RegisterRole.STUDENT,
        refreshToken: null,
        isActive: true,
      });
      await expect(service.refreshTokens('1', 'some-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if refresh token does not match', async () => {
      const storedHash = await bcrypt.hash('correct-token', 12);
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        role: RegisterRole.STUDENT,
        refreshToken: storedHash,
        isActive: true,
      });
      await expect(service.refreshTokens('1', 'wrong-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return new tokens if refresh token matches', async () => {
      const storedHash = await bcrypt.hash('valid-token', 12);
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        role: RegisterRole.STUDENT,
        refreshToken: storedHash,
        isActive: true,
      });
      prisma.user.update.mockResolvedValue({});

      const result = await service.refreshTokens('1', 'valid-token');
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should invalidate all tokens on token reuse', async () => {
      const storedHash = await bcrypt.hash('valid-token', 12);
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        role: RegisterRole.STUDENT,
        refreshToken: storedHash,
        isActive: true,
      });
      prisma.user.update.mockResolvedValue({});

      await service.refreshTokens('1', 'different-token');

      // Should have been called to null out the refresh token
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { refreshToken: null },
        }),
      );
    });
  });

  describe('logout', () => {
    it('should clear refresh token and mark offline', async () => {
      prisma.user.update.mockResolvedValue({});
      await service.logout('user-1');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { refreshToken: null, isOnline: false },
      });
    });
  });
});
