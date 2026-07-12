import { AiChatService } from './chat/ai-chat.service';
import { AiFeaturesService } from './ai-features.service';
import { AiAnalyticsService } from './analytics/ai-analytics.service';
import { ProviderFactory } from './providers/provider.factory';
import { CreateConversationDto, SendMessageDto, AiTutorDto, HomeworkAssistantDto, GenerateQuizDto, GenerateFlashcardsDto, GenerateMindMapDto, SummarizeDocumentDto, StudyPlanDto, HomeworkFeedbackDto } from './dto/ai.dto';
export declare class AiController {
    private readonly chatService;
    private readonly featuresService;
    private readonly analyticsService;
    private readonly providerFactory;
    constructor(chatService: AiChatService, featuresService: AiFeaturesService, analyticsService: AiAnalyticsService, providerFactory: ProviderFactory);
    getProviders(): Promise<{
        available: string[];
        active: string;
    }>;
    switchProvider(name: string): Promise<{
        active: string;
    }>;
    createConversation(req: any, dto: CreateConversationDto): Promise<import("./chat/ai-chat.service").AiChatConversation>;
    getConversations(req: any): Promise<import("./chat/ai-chat.service").AiChatConversation[]>;
    getMessages(id: string): Promise<import("./chat/ai-chat.service").AiChatMessage[]>;
    sendMessage(req: any, conversationId: string, dto: SendMessageDto): Promise<{
        message: import("./chat/ai-chat.service").AiChatMessage;
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    }>;
    streamMessage(req: any, conversationId: string, dto: SendMessageDto, res: any): Promise<void>;
    deleteConversation(req: any, id: string): Promise<{
        deleted: boolean;
    }>;
    aiTutor(req: any, dto: AiTutorDto): Promise<import("./ai-features.service").AiFeatureResult>;
    homeworkAssistant(req: any, dto: HomeworkAssistantDto): Promise<import("./ai-features.service").AiFeatureResult>;
    generateQuiz(req: any, dto: GenerateQuizDto): Promise<import("./ai-features.service").AiFeatureResult>;
    generateFlashcards(req: any, dto: GenerateFlashcardsDto): Promise<import("./ai-features.service").AiFeatureResult>;
    generateMindMap(req: any, dto: GenerateMindMapDto): Promise<import("./ai-features.service").AiFeatureResult>;
    summarizeDocument(req: any, dto: SummarizeDocumentDto): Promise<import("./ai-features.service").AiFeatureResult>;
    generateStudyPlan(req: any, dto: StudyPlanDto): Promise<import("./ai-features.service").AiFeatureResult>;
    generateFeedback(req: any, dto: HomeworkFeedbackDto): Promise<import("./ai-features.service").AiFeatureResult>;
    explainLesson(req: any, lessonId: string): Promise<import("./ai-features.service").AiFeatureResult>;
    getUserStats(req: any, days?: string): Promise<{
        totalRequests: number;
        totalTokens: number;
        totalCostUsd: number;
        byProvider: Record<string, {
            requests: number;
            tokens: number;
            cost: number;
        }>;
        byFeature: Record<string, {
            requests: number;
            tokens: number;
            cost: number;
        }>;
        avgLatencyMs: number;
        successRate: number;
    }>;
    getGlobalStats(days?: string): Promise<{
        totalRequests: number;
        totalTokens: number;
        totalCostUsd: number;
        uniqueUsers: number;
        byModel: Record<string, number>;
    }>;
    getSuggestedQuestions(): Promise<{
        category: string;
        questions: string[];
    }[]>;
}
