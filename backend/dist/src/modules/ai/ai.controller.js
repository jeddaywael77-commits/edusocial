"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const enums_1 = require("../../common/enums");
const ai_chat_service_1 = require("./chat/ai-chat.service");
const ai_features_service_1 = require("./ai-features.service");
const ai_analytics_service_1 = require("./analytics/ai-analytics.service");
const provider_factory_1 = require("./providers/provider.factory");
const ai_dto_1 = require("./dto/ai.dto");
let AiController = class AiController {
    chatService;
    featuresService;
    analyticsService;
    providerFactory;
    constructor(chatService, featuresService, analyticsService, providerFactory) {
        this.chatService = chatService;
        this.featuresService = featuresService;
        this.analyticsService = analyticsService;
        this.providerFactory = providerFactory;
    }
    async getProviders() {
        return {
            available: this.providerFactory.getAvailableProviders(),
            active: this.providerFactory.getActiveProvider().name,
        };
    }
    async switchProvider(name) {
        this.providerFactory.setActiveProvider(name);
        return { active: name };
    }
    async createConversation(req, dto) {
        return this.chatService.createConversation(req.user.id, dto.title, dto.model);
    }
    async getConversations(req) {
        return this.chatService.getConversations(req.user.id);
    }
    async getMessages(id) {
        return this.chatService.getMessages(id);
    }
    async sendMessage(req, conversationId, dto) {
        return this.chatService.sendMessage(conversationId, req.user.id, dto.content, {
            systemPrompt: dto.systemPrompt,
            useRAG: dto.useRAG,
            ragCollection: dto.ragCollection,
            temperature: dto.temperature,
            maxTokens: dto.maxTokens,
        });
    }
    async streamMessage(req, conversationId, dto, res) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        let closed = false;
        const timeout = setTimeout(() => {
            if (!closed) {
                res.write('data: {"error":"Stream timeout after 120s"}\n\n');
                res.end();
                closed = true;
            }
        }, 120_000);
        req.on('close', () => {
            closed = true;
            clearTimeout(timeout);
        });
        try {
            const stream = this.chatService.sendMessageStream(conversationId, req.user.id, dto.content, {
                systemPrompt: dto.systemPrompt,
                useRAG: dto.useRAG,
                ragCollection: dto.ragCollection,
                temperature: dto.temperature,
                maxTokens: dto.maxTokens,
            });
            for await (const chunk of stream) {
                if (closed)
                    break;
                if (!res.writableEnded) {
                    res.write(`data: ${JSON.stringify(chunk)}\n\n`);
                }
                if (chunk.finishReason)
                    break;
            }
            if (!closed) {
                res.write('data: [DONE]\n\n');
                res.end();
            }
        }
        catch (error) {
            if (!closed) {
                res.write(`data: {"error":"Streaming error"}\n\n`);
                res.end();
            }
        }
        finally {
            clearTimeout(timeout);
        }
    }
    async deleteConversation(req, id) {
        await this.chatService.deleteConversation(id, req.user.id);
        return { deleted: true };
    }
    async aiTutor(req, dto) {
        return this.featuresService.aiTutor(req.user.id, dto);
    }
    async homeworkAssistant(req, dto) {
        return this.featuresService.homeworkAssistant(req.user.id, dto);
    }
    async generateQuiz(req, dto) {
        return this.featuresService.generateQuiz(req.user.id, dto);
    }
    async generateFlashcards(req, dto) {
        return this.featuresService.generateFlashcards(req.user.id, dto);
    }
    async generateMindMap(req, dto) {
        return this.featuresService.generateMindMap(req.user.id, dto);
    }
    async summarizeDocument(req, dto) {
        return this.featuresService.summarizeDocument(req.user.id, dto);
    }
    async generateStudyPlan(req, dto) {
        return this.featuresService.generateStudyPlan(req.user.id, dto);
    }
    async generateFeedback(req, dto) {
        return this.featuresService.generateHomeworkFeedback(req.user.id, dto);
    }
    async explainLesson(req, lessonId) {
        return this.featuresService.explainLesson(req.user.id, { lessonId });
    }
    async getUserStats(req, days) {
        return this.analyticsService.getUserStats(req.user.id, days ? parseInt(days) : 30);
    }
    async getGlobalStats(days) {
        return this.analyticsService.getGlobalStats(days ? parseInt(days) : 7);
    }
    async getSuggestedQuestions() {
        return [
            {
                category: 'Tutoring',
                questions: [
                    'Explain photosynthesis',
                    'How does photosynthesis work?',
                    'What are the steps of mitosis?',
                ],
            },
            {
                category: 'Homework',
                questions: [
                    'Help me solve this math problem',
                    'Check my essay for errors',
                    'Explain this concept',
                ],
            },
            {
                category: 'Study',
                questions: [
                    'Create flashcards for Chapter 5',
                    'Make a mind map of the water cycle',
                    'Generate a quiz on World War II',
                ],
            },
            {
                category: 'Planning',
                questions: [
                    'Create a study plan for my exams',
                    'Summarize this PDF',
                    'What should I study next?',
                ],
            },
        ];
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Get)('providers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get available AI providers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getProviders", null);
__decorate([
    (0, common_1.Put)('providers/:name'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Switch active AI provider (admin only)' }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "switchProvider", null);
__decorate([
    (0, common_1.Post)('chat/conversations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new AI chat conversation' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ai_dto_1.CreateConversationDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "createConversation", null);
__decorate([
    (0, common_1.Get)('chat/conversations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'List AI chat conversations' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Get)('chat/conversations/:id/messages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get conversation messages' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('chat/conversations/:id/messages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Send a message to AI' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ai_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)('chat/conversations/:id/stream'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Stream AI response (SSE)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ai_dto_1.SendMessageDto, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "streamMessage", null);
__decorate([
    (0, common_1.Delete)('chat/conversations/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a conversation' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "deleteConversation", null);
__decorate([
    (0, common_1.Post)('features/tutor'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'AI Tutor - Ask a question' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ai_dto_1.AiTutorDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "aiTutor", null);
__decorate([
    (0, common_1.Post)('features/homework'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Homework Assistant' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ai_dto_1.HomeworkAssistantDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "homeworkAssistant", null);
__decorate([
    (0, common_1.Post)('features/quiz'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a quiz' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ai_dto_1.GenerateQuizDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateQuiz", null);
__decorate([
    (0, common_1.Post)('features/flashcards'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate flashcards' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ai_dto_1.GenerateFlashcardsDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateFlashcards", null);
__decorate([
    (0, common_1.Post)('features/mind-map'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a mind map' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ai_dto_1.GenerateMindMapDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateMindMap", null);
__decorate([
    (0, common_1.Post)('features/summarize'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Summarize a document' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ai_dto_1.SummarizeDocumentDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "summarizeDocument", null);
__decorate([
    (0, common_1.Post)('features/study-plan'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a study plan' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ai_dto_1.StudyPlanDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateStudyPlan", null);
__decorate([
    (0, common_1.Post)('features/feedback'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get homework feedback' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ai_dto_1.HomeworkFeedbackDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateFeedback", null);
__decorate([
    (0, common_1.Post)('features/explain-lesson/:lessonId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Explain a lesson' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "explainLesson", null);
__decorate([
    (0, common_1.Get)('analytics/stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user AI usage stats' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Get)('analytics/global'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get global AI usage stats (admin only)' }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getGlobalStats", null);
__decorate([
    (0, common_1.Get)('suggested-questions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get suggested AI questions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getSuggestedQuestions", null);
exports.AiController = AiController = __decorate([
    (0, swagger_1.ApiTags)('AI'),
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_chat_service_1.AiChatService,
        ai_features_service_1.AiFeaturesService,
        ai_analytics_service_1.AiAnalyticsService,
        provider_factory_1.ProviderFactory])
], AiController);
//# sourceMappingURL=ai.controller.js.map