import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Posts (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    // Create test user and get token
    const email = `posts-test-${Date.now()}@example.com`;
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ name: 'Posts Tester', email, password: 'Password123', role: 'STUDENT' });
    authToken = res.body.tokens.accessToken;
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/posts', () => {
    it('should create a post', () => {
      return request(app.getHttpServer())
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Hello EduSocial!', type: 'TEXT', visibility: 'PUBLIC' })
        .expect(201)
        .expect((res) => {
          expect(res.body.content).toBe('Hello EduSocial!');
          expect(res.body.author).toBeDefined();
        });
    });

    it('should reject unauthenticated post creation', () => {
      return request(app.getHttpServer())
        .post('/api/v1/posts')
        .send({ content: 'Should fail', type: 'TEXT', visibility: 'PUBLIC' })
        .expect(401);
    });
  });

  describe('GET /api/v1/posts', () => {
    it('should return paginated posts', () => {
      return request(app.getHttpServer())
        .get('/api/v1/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
        });
    });
  });
});
