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
var AiFeaturesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiFeaturesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../database/prisma.service");
const provider_factory_1 = require("./providers/provider.factory");
const prompt_registry_1 = require("./prompts/prompt-registry");
const ai_security_service_1 = require("./security/ai-security.service");
const ai_analytics_service_1 = require("./analytics/ai-analytics.service");
const rag_pipeline_service_1 = require("./rag/rag-pipeline.service");
let AiFeaturesService = AiFeaturesService_1 = class AiFeaturesService {
    prisma;
    providerFactory;
    securityService;
    analyticsService;
    ragPipeline;
    config;
    logger = new common_1.Logger(AiFeaturesService_1.name);
    constructor(prisma, providerFactory, securityService, analyticsService, ragPipeline, config) {
        this.prisma = prisma;
        this.providerFactory = providerFactory;
        this.securityService = securityService;
        this.analyticsService = analyticsService;
        this.ragPipeline = ragPipeline;
        this.config = config;
    }
    async aiTutor(userId, params) {
        const courseContext = params.courseId
            ? await this.getCourseContext(params.courseId)
            : 'General knowledge';
        const rendered = prompt_registry_1.PromptRegistry.render('ai-tutor', {
            topic: params.topic,
            question: params.question,
            courseContext,
        });
        return this.generateFeature(userId, 'ai-tutor', rendered, params);
    }
    async homeworkAssistant(userId, params) {
        const rendered = prompt_registry_1.PromptRegistry.render('homework-assistant', {
            assignment: params.assignment,
            subject: params.subject,
            studentAttempt: params.studentAttempt || 'No attempt yet',
        });
        return this.generateFeature(userId, 'homework-assistant', rendered, params);
    }
    async explainLesson(userId, params) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: params.lessonId },
            select: { title: true, content: true },
        });
        const rendered = prompt_registry_1.PromptRegistry.render('lesson-explainer', {
            lessonTitle: lesson?.title || 'Unknown Lesson',
            content: lesson?.content || 'No content available',
            level: params.level || 'intermediate',
        });
        return this.generateFeature(userId, 'lesson-explainer', rendered, params);
    }
    async generateQuiz(userId, params) {
        const material = params.material ||
            (await this.getRelevantMaterial(params.topic, params.subject));
        const rendered = prompt_registry_1.PromptRegistry.render('quiz-generator', {
            subject: params.subject,
            topic: params.topic,
            difficulty: params.difficulty,
            numQuestions: String(params.numQuestions),
            questionTypes: params.questionTypes,
            material,
        });
        return this.generateFeature(userId, 'quiz-generator', rendered, {
            ...params,
            format: 'json',
        });
    }
    async generateFlashcards(userId, params) {
        const material = params.material || (await this.getRelevantMaterial(params.topic));
        const rendered = prompt_registry_1.PromptRegistry.render('flashcard-generator', {
            topic: params.topic,
            numCards: String(params.numCards),
            material,
        });
        return this.generateFeature(userId, 'flashcard-generator', rendered, {
            ...params,
            format: 'json',
        });
    }
    async generateMindMap(userId, params) {
        const material = params.material || (await this.getRelevantMaterial(params.topic));
        const rendered = prompt_registry_1.PromptRegistry.render('mind-map-generator', {
            topic: params.topic,
            depth: params.depth || '3',
            material,
        });
        return this.generateFeature(userId, 'mind-map-generator', rendered, {
            ...params,
            format: 'json',
        });
    }
    async summarizeDocument(userId, params) {
        const docLog = await this.prisma.auditLog.findUnique({
            where: { id: params.documentId },
        });
        const docData = docLog?.newData;
        const content = docData?.content || docData?.text || 'No content available';
        const rendered = prompt_registry_1.PromptRegistry.render('pdf-summarizer', {
            title: docData?.filename || 'Document',
            content: content.slice(0, 10000),
            length: params.length || 'medium',
        });
        return this.generateFeature(userId, 'pdf-summarizer', rendered, params);
    }
    async generateStudyPlan(userId, params) {
        const rendered = prompt_registry_1.PromptRegistry.render('study-planner', {
            goals: params.goals,
            availableTime: params.availableTime,
            subjects: params.subjects,
            examDates: params.examDates,
            currentLevel: params.currentLevel,
        });
        return this.generateFeature(userId, 'study-planner', rendered, params);
    }
    async generateHomeworkFeedback(userId, params) {
        const rendered = prompt_registry_1.PromptRegistry.render('homework-feedback', {
            assignment: params.assignment,
            submission: params.submission,
            rubric: params.rubric || 'General quality assessment',
        });
        return this.generateFeature(userId, 'homework-feedback', rendered, params);
    }
    async generateLessonSummary(userId, params) {
        const messages = [
            {
                role: 'system',
                content: 'You are an expert educator. Create concise, clear summaries.',
            },
            {
                role: 'user',
                content: `Summarize the following content in ${params.maxLength || 200} words:\n\n${params.content}`,
            },
        ];
        return this.generateFromMessages(userId, 'lesson-summary', messages);
    }
    async predictDifficulty(userId, params) {
        const messages = [
            {
                role: 'system',
                content: 'You are an educational assessment expert. Analyze content difficulty.',
            },
            {
                role: 'user',
                content: `Analyze the difficulty of this ${params.subject} content and provide:
1. Difficulty level (1-10)
2. Prerequisites needed
3. Estimated study time
4. Key concepts

Content: ${params.content}`,
            },
        ];
        return this.generateFromMessages(userId, 'difficulty-prediction', messages);
    }
    async generateRecommendations(userId, params) {
        const messages = [
            {
                role: 'system',
                content: 'You are a personalized learning advisor.',
            },
            {
                role: 'user',
                content: `Based on these current topics: ${params.currentTopics.join(', ')}
${params.performance ? `Performance: ${params.performance}` : ''}
${params.goals ? `Goals: ${params.goals}` : ''}

Recommend:
1. Next topics to study
2. Resources to use
3. Practice exercises
4. Review schedule`,
            },
        ];
        return this.generateFromMessages(userId, 'recommendations', messages);
    }
    async generateFeature(userId, feature, rendered, params) {
        const startTime = Date.now();
        const provider = this.providerFactory.getActiveProvider();
        const messages = [];
        if (rendered.system)
            messages.push({ role: 'system', content: rendered.system });
        messages.push({ role: 'user', content: rendered.user });
        try {
            const response = await provider.chatCompletion({
                messages,
                temperature: this.config.get('ai.chatTemperature') || 0.7,
                maxTokens: this.config.get('ai.chatMaxTokens') || 4096,
            });
            const cost = this.analyticsService.calculateCost(response.usage.promptTokens, response.usage.completionTokens, {
                costInputPer1M: this.config.get('ai.costInputPer1M') || 0.15,
                costOutputPer1M: this.config.get('ai.costOutputPer1M') || 0.6,
            });
            await this.analyticsService.trackUsage({
                userId,
                provider: provider.name,
                model: response.model,
                feature,
                promptTokens: response.usage.promptTokens,
                completionTokens: response.usage.completionTokens,
                totalTokens: response.usage.totalTokens,
                latencyMs: Date.now() - startTime,
                costUsd: cost,
                success: true,
            });
            return {
                content: response.content,
                format: params?.format || 'text',
                usage: response.usage,
            };
        }
        catch (error) {
            await this.analyticsService.trackUsage({
                userId,
                provider: provider.name,
                model: 'unknown',
                feature,
                promptTokens: 0,
                completionTokens: 0,
                totalTokens: 0,
                latencyMs: Date.now() - startTime,
                costUsd: 0,
                success: false,
                errorMessage: error.message,
            });
            throw error;
        }
    }
    async generateFromMessages(userId, feature, messages) {
        const startTime = Date.now();
        const provider = this.providerFactory.getActiveProvider();
        try {
            const response = await provider.chatCompletion({
                messages,
                temperature: this.config.get('ai.chatTemperature') || 0.7,
                maxTokens: this.config.get('ai.chatMaxTokens') || 4096,
            });
            const cost = this.analyticsService.calculateCost(response.usage.promptTokens, response.usage.completionTokens, {
                costInputPer1M: this.config.get('ai.costInputPer1M') || 0.15,
                costOutputPer1M: this.config.get('ai.costOutputPer1M') || 0.6,
            });
            await this.analyticsService.trackUsage({
                userId,
                provider: provider.name,
                model: response.model,
                feature,
                promptTokens: response.usage.promptTokens,
                completionTokens: response.usage.completionTokens,
                totalTokens: response.usage.totalTokens,
                latencyMs: Date.now() - startTime,
                costUsd: cost,
                success: true,
            });
            return {
                content: response.content,
                format: 'text',
                usage: response.usage,
            };
        }
        catch (error) {
            await this.analyticsService.trackUsage({
                userId,
                provider: provider.name,
                model: 'unknown',
                feature,
                promptTokens: 0,
                completionTokens: 0,
                totalTokens: 0,
                latencyMs: Date.now() - startTime,
                costUsd: 0,
                success: false,
                errorMessage: error.message,
            });
            throw error;
        }
    }
    async getCourseContext(courseId) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
            select: { title: true, description: true, category: true },
        });
        return course
            ? `${course.title} (${course.category}): ${course.description || ''}`
            : 'General';
    }
    async getRelevantMaterial(topic, subject) {
        const courses = await this.prisma.course.findMany({
            where: subject ? { category: subject } : {},
            take: 3,
            include: {
                lessons: {
                    select: { title: true, content: true },
                    take: 5,
                },
            },
        });
        return (courses
            .flatMap((c) => c.lessons.map((l) => `${l.title}: ${l.content || ''}`))
            .join('\n\n')
            .slice(0, 5000) || 'No specific course materials available');
    }
};
exports.AiFeaturesService = AiFeaturesService;
exports.AiFeaturesService = AiFeaturesService = AiFeaturesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        provider_factory_1.ProviderFactory,
        ai_security_service_1.AiSecurityService,
        ai_analytics_service_1.AiAnalyticsService,
        rag_pipeline_service_1.RagPipelineService,
        config_1.ConfigService])
], AiFeaturesService);
//# sourceMappingURL=ai-features.service.js.map