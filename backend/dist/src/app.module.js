"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const schedule_1 = require("@nestjs/schedule");
const config_2 = __importDefault(require("./config"));
const prisma_module_1 = require("./database/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const posts_module_1 = require("./modules/posts/posts.module");
const comments_module_1 = require("./modules/comments/comments.module");
const likes_module_1 = require("./modules/likes/likes.module");
const stories_module_1 = require("./modules/stories/stories.module");
const friends_module_1 = require("./modules/friends/friends.module");
const followers_module_1 = require("./modules/followers/followers.module");
const groups_module_1 = require("./modules/groups/groups.module");
const courses_module_1 = require("./modules/courses/courses.module");
const lessons_module_1 = require("./modules/lessons/lessons.module");
const assignments_module_1 = require("./modules/assignments/assignments.module");
const submissions_module_1 = require("./modules/submissions/submissions.module");
const exams_module_1 = require("./modules/exams/exams.module");
const documents_module_1 = require("./modules/documents/documents.module");
const chat_module_1 = require("./modules/chat/chat.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const calendar_module_1 = require("./modules/calendar/calendar.module");
const marketplace_module_1 = require("./modules/marketplace/marketplace.module");
const gamification_module_1 = require("./modules/gamification/gamification.module");
const leaderboard_module_1 = require("./modules/leaderboard/leaderboard.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: config_2.default,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            posts_module_1.PostsModule,
            comments_module_1.CommentsModule,
            likes_module_1.LikesModule,
            stories_module_1.StoriesModule,
            friends_module_1.FriendsModule,
            followers_module_1.FollowersModule,
            groups_module_1.GroupsModule,
            courses_module_1.CoursesModule,
            lessons_module_1.LessonsModule,
            assignments_module_1.AssignmentsModule,
            submissions_module_1.SubmissionsModule,
            exams_module_1.ExamsModule,
            documents_module_1.DocumentsModule,
            chat_module_1.ChatModule,
            notifications_module_1.NotificationsModule,
            calendar_module_1.CalendarModule,
            marketplace_module_1.MarketplaceModule,
            gamification_module_1.GamificationModule,
            leaderboard_module_1.LeaderboardModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map