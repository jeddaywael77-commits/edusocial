"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const logger = new common_1.Logger('Bootstrap');
    const apiPrefix = configService.get('app.apiPrefix') || 'api/v1';
    app.setGlobalPrefix(apiPrefix);
    app.enableCors({
        origin: configService.get('app.corsOrigin'),
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new http_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(), new transform_interceptor_1.TransformInterceptor());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('EduSocial API')
        .setDescription('The EduSocial educational social platform API')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
    }, 'access-token')
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    const port = configService.get('app.port') || 3001;
    await app.listen(port);
    logger.log(`🚀 Application running on: http://localhost:${port}`);
    logger.log(`📚 Swagger docs: http://localhost:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map