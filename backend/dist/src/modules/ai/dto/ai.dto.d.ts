export declare class CreateConversationDto {
    title?: string;
    model?: string;
}
export declare class SendMessageDto {
    content: string;
    systemPrompt?: string;
    useRAG?: boolean;
    ragCollection?: string;
    temperature?: number;
    maxTokens?: number;
}
export declare class AiTutorDto {
    topic: string;
    question: string;
    courseId?: string;
    level?: string;
}
export declare class HomeworkAssistantDto {
    assignment: string;
    subject: string;
    studentAttempt?: string;
}
export declare class GenerateQuizDto {
    subject: string;
    topic: string;
    difficulty: string;
    numQuestions: number;
    questionTypes: string;
    material?: string;
}
export declare class GenerateFlashcardsDto {
    topic: string;
    numCards: number;
    material?: string;
}
export declare class GenerateMindMapDto {
    topic: string;
    depth?: string;
    material?: string;
}
export declare class SummarizeDocumentDto {
    documentId: string;
    length?: string;
}
export declare class StudyPlanDto {
    goals: string;
    availableTime: string;
    subjects: string;
    examDates: string;
    currentLevel: string;
}
export declare class HomeworkFeedbackDto {
    assignment: string;
    submission: string;
    rubric?: string;
}
export declare class RagQueryDto {
    query: string;
    collection: string;
    topK?: number;
    systemPrompt?: string;
}
export declare class IndexDocumentDto {
    collection: string;
}
export declare class ReindexDto {
    entityType?: string;
}
