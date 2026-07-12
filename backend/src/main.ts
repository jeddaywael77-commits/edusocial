import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const compression = require('compression');
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { SocketService } from './modules/socket/socket.service';
import { RolesGuard } from './common/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // Validate required secrets on startup
  const jwtSecret = configService.get<string>('jwt.secret');
  const jwtRefreshSecret = configService.get<string>('jwt.refreshSecret');
  if (!jwtSecret || jwtSecret.includes('fallback')) {
    throw new Error(
      'JWT_SECRET environment variable is required and must not contain "fallback". ' +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"',
    );
  }
  if (!jwtRefreshSecret || jwtRefreshSecret.includes('fallback')) {
    throw new Error(
      'JWT_REFRESH_SECRET environment variable is required and must not contain "fallback". ' +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"',
    );
  }

  // Security headers
  app.use(helmet({
    contentSecurityPolicy: nodeEnv === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: false,
  }));

  // Compression
  app.use(compression());

  // Global prefix
  const apiPrefix = configService.get<string>('app.apiPrefix') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // CORS
  app.enableCors({
    origin: configService.get<string>('app.corsOrigin'),
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global guards: RolesGuard
  const reflector = app.get('Reflector');
  app.useGlobalGuards(new RolesGuard(reflector));

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Swagger (disabled in production)
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('EduSocial API')
      .setDescription('The EduSocial educational social platform API')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          in: 'header',
        },
        'access-token',
      )
      .addTag('Auth', 'Authentication endpoints')
      .addTag('Users', 'User management')
      .addTag('Posts', 'Social feed posts')
      .addTag('Comments', 'Post comments')
      .addTag('Likes', 'Like system')
      .addTag('Stories', '24h stories')
      .addTag('Friends', 'Friend system')
      .addTag('Followers', 'Follow system')
      .addTag('Groups', 'Community groups')
      .addTag('Courses', 'Course management')
      .addTag('Lessons', 'Course lessons')
      .addTag('Assignments', 'Homework assignments')
      .addTag('Exams', 'Examinations')
      .addTag('Documents', 'Document management')
      .addTag('Chat', 'Messaging')
      .addTag('Notifications', 'User notifications')
      .addTag('Calendar', 'Calendar events')
      .addTag('Marketplace', 'Marketplace items')
      .addTag('Gamification', 'XP, badges, leaderboard')
      .addTag('Admin', 'Admin endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
    logger.log(`📚 Swagger docs: http://localhost:${configService.get<number>('app.port') || 3001}/docs`);
  }

  // WebSocket adapter with Redis
  const socketService = app.get(SocketService);
  const ioAdapter = new (await import('@nestjs/platform-socket.io')).IoAdapter(app);
  socketService.createRedisAdapter();
  ioAdapter.createIOServer = ((originalCreateIOServer: any) => {
    return (...args: any[]) => {
      const server = originalCreateIOServer.apply(ioAdapter, args);
      server.adapter(socketService.createRedisAdapter());
      return server;
    };
  })(ioAdapter.createIOServer.bind(ioAdapter));
  app.useWebSocketAdapter(ioAdapter);

  const port = configService.get<number>('app.port') || 3001;
  await app.listen(port);

  logger.log(`Application running on: http://localhost:${port}`);
}

bootstrap();
