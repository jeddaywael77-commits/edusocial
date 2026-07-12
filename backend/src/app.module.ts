import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { APP_GUARD } from '@nestjs/core';
import config from './config';
import { PrismaModule } from './database/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { LikesModule } from './modules/likes/likes.module';
import { StoriesModule } from './modules/stories/stories.module';
import { FriendsModule } from './modules/friends/friends.module';
import { FollowersModule } from './modules/followers/followers.module';
import { GroupsModule } from './modules/groups/groups.module';
import { CoursesModule } from './modules/courses/courses.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { ExamsModule } from './modules/exams/exams.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { ChatModule } from './modules/chat/chat.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { SocketModule } from './modules/socket/socket.module';
import { MediaModule } from './modules/media/media.module';
import { SearchModule } from './modules/search/search.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Scheduled tasks
    ScheduleModule.forRoot(),

    // BullMQ queues
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('redis.host') || 'localhost',
          port: configService.get<number>('redis.port') || 6379,
        },
      }),
      inject: [ConfigService],
    }),

    // Database
    PrismaModule,

    // Health checks
    HealthModule,

    // Feature modules
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    LikesModule,
    StoriesModule,
    FriendsModule,
    FollowersModule,
    GroupsModule,
    CoursesModule,
    LessonsModule,
    AssignmentsModule,
    SubmissionsModule,
    ExamsModule,
    DocumentsModule,
    ChatModule,
    NotificationsModule,
    CalendarModule,
    MarketplaceModule,
    GamificationModule,
    LeaderboardModule,
    SocketModule,
    MediaModule,
    SearchModule,
    AiModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
