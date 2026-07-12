import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: `test-${Date.now()}@example.com`,
          password: 'Password123',
          role: 'STUDENT',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.user).toBeDefined();
          expect(res.body.tokens).toBeDefined();
          expect(res.body.tokens.accessToken).toBeDefined();
          expect(res.body.tokens.refreshToken).toBeDefined();
          expect(res.body.user.email).toBeDefined();
          expect(res.body.user.password).toBeUndefined();
        });
    });

    it('should reject duplicate email', async () => {
      const email = `dup-${Date.now()}@example.com`;
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ name: 'First', email, password: 'Password123', role: 'STUDENT' })
        .expect(201);

      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ name: 'Second', email, password: 'Password123', role: 'STUDENT' })
        .expect(409);
    });

    it('should reject weak password', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          name: 'Weak',
          email: `weak-${Date.now()}@example.com`,
          password: 'weak',
          role: 'STUDENT',
        })
        .expect(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const email = `login-${Date.now()}@example.com`;
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ name: 'Login User', email, password: 'Password123', role: 'STUDENT' })
        .expect(201);

      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email, password: 'Password123' })
        .expect(200)
        .expect((res) => {
          expect(res.body.tokens.accessToken).toBeDefined();
          expect(res.body.user.email).toBe(email);
        });
    });

    it('should reject invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'wrong' })
        .expect(401);
    });
  });

  describe('GET /api/v1/auth/profile', () => {
    it('should return profile for authenticated user', async () => {
      const email = `profile-${Date.now()}@example.com`;
      const registerRes = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ name: 'Profile User', email, password: 'Password123', role: 'STUDENT' })
        .expect(201);

      const token = registerRes.body.tokens.accessToken;

      return request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe(email);
          expect(res.body.password).toBeUndefined();
        });
    });

    it('should reject unauthenticated request', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .expect(401);
    });
  });
});
