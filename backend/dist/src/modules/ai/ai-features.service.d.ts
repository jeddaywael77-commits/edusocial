import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { ProviderFactory } from './providers/provider.factory';
import { AiSecurityService } from './security/ai-security.service';
import { AiAnalyticsService } from './analytics/ai-analytics.service';
import { RagPipelineService } from './rag/rag-pipeline.service';
export interface AiFeatureResult {
    content: string;
    format: 'text' | 'json' | 'markdown';
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}
export declare class AiFeaturesService {
    private readonly prisma;
    private readonly providerFactory;
    private readonly securityService;
    private readonly analyticsService;
    private readonly ragPipeline;
    private readonly config;
    private readonly logger;
    constructor(prisma: PrismaService, providerFactory: ProviderFactory, securityService: AiSecurityService, analyticsService: AiAnalyticsService, ragPipeline: RagPipelineService, config: ConfigService);
    aiTutor(userId: string, params: {
        topic: string;
        question: string;
        courseId?: string;
        level?: string;
    }): Promise<AiFeatureResult>;
    homeworkAssistant(userId: string, params: {
        assignment: string;
        subject: string;
        studentAttempt?: string;
    }): Promise<AiFeatureResult>;
    explainLesson(userId: string, params: {
        lessonId: string;
        level?: string;
    }): Promise<AiFeatureResult>;
    generateQuiz(userId: string, params: {
        subject: string;
        topic: string;
        difficulty: string;
        numQuestions: number;
        questionTypes: string;
        material?: string;
    }): Promise<AiFeatureResult>;
    generateFlashcards(userId: string, params: {
        topic: string;
        numCards: number;
        material?: string;
    }): Promise<AiFeatureResult>;
    generateMindMap(userId: string, params: {
        topic: string;
        depth?: string;
        material?: string;
    }): Promise<AiFeatureResult>;
    summarizeDocument(userId: string, params: {
        documentId: string;
        length?: string;
    }): Promise<AiFeatureResult>;
    generateStudyPlan(userId: string, params: {
        goals: string;
        availableTime: string;
        subjects: string;
        examDates: string;
        currentLevel: string;
    }): Promise<AiFeatureResult>;
    generateHomeworkFeedback(userId: string, params: {
        assignment: string;
        submission: string;
        rubric?: string;
    }): Promise<AiFeatureResult>;
    generateLessonSummary(userId: string, params: {
        content: string;
        maxLength?: number;
    }): Promise<AiFeatureResult>;
    predictDifficulty(userId: string, params: {
        content: string;
        subject: string;
    }): Promise<AiFeatureResult>;
    generateRecommendations(userId: string, params: {
        currentTopics: string[];
        performance?: string;
        goals?: string;
    }): Promise<AiFeatureResult>;
    private generateFeature;
    private generateFromMessages;
    private getCourseContext;
    private getRelevantMaterial;
}
