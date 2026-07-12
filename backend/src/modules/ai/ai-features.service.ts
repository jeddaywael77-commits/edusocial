import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { ProviderFactory } from './providers/provider.factory';
import { PromptRegistry } from './prompts/prompt-registry';
import { AiSecurityService } from './security/ai-security.service';
import { AiAnalyticsService } from './analytics/ai-analytics.service';
import { RagPipelineService } from './rag/rag-pipeline.service';
import type { ChatMessage } from './providers/ai-provider.interface';

export interface AiFeatureResult {
  content: string;
  format: 'text' | 'json' | 'markdown';
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

@Injectable()
export class AiFeaturesService {
  private readonly logger = new Logger(AiFeaturesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly providerFactory: ProviderFactory,
    private readonly securityService: AiSecurityService,
    private readonly analyticsService: AiAnalyticsService,
    private readonly ragPipeline: RagPipelineService,
    private readonly config: ConfigService,
  ) {}

  async aiTutor(
    userId: string,
    params: {
      topic: string;
      question: string;
      courseId?: string;
      level?: string;
    },
  ): Promise<AiFeatureResult> {
    const courseContext = params.courseId
      ? await this.getCourseContext(params.courseId)
      : 'General knowledge';

    const rendered = PromptRegistry.render('ai-tutor', {
      topic: params.topic,
      question: params.question,
      courseContext,
    });

    return this.generateFeature(userId, 'ai-tutor', rendered, params);
  }

  async homeworkAssistant(
    userId: string,
    params: {
      assignment: string;
      subject: string;
      studentAttempt?: string;
    },
  ): Promise<AiFeatureResult> {
    const rendered = PromptRegistry.render('homework-assistant', {
      assignment: params.assignment,
      subject: params.subject,
      studentAttempt: params.studentAttempt || 'No attempt yet',
    });

    return this.generateFeature(userId, 'homework-assistant', rendered, params);
  }

  async explainLesson(
    userId: string,
    params: {
      lessonId: string;
      level?: string;
    },
  ): Promise<AiFeatureResult> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: params.lessonId },
      select: { title: true, content: true },
    });

    const rendered = PromptRegistry.render('lesson-explainer', {
      lessonTitle: lesson?.title || 'Unknown Lesson',
      content: lesson?.content || 'No content available',
      level: params.level || 'intermediate',
    });

    return this.generateFeature(userId, 'lesson-explainer', rendered, params);
  }

  async generateQuiz(
    userId: string,
    params: {
      subject: string;
      topic: string;
      difficulty: string;
      numQuestions: number;
      questionTypes: string;
      material?: string;
    },
  ): Promise<AiFeatureResult> {
    const material =
      params.material ||
      (await this.getRelevantMaterial(params.topic, params.subject));

    const rendered = PromptRegistry.render('quiz-generator', {
      subject: params.subject,
      topic: params.topic,
      difficulty: params.difficulty,
      numQuestions: String(params.numQuestions),
      questionTypes: params.questionTypes,
      material,
    });

    return this.generateFeature(userId, 'quiz-generator', rendered, {
      ...params,
      format: 'json' as const,
    });
  }

  async generateFlashcards(
    userId: string,
    params: {
      topic: string;
      numCards: number;
      material?: string;
    },
  ): Promise<AiFeatureResult> {
    const material =
      params.material || (await this.getRelevantMaterial(params.topic));

    const rendered = PromptRegistry.render('flashcard-generator', {
      topic: params.topic,
      numCards: String(params.numCards),
      material,
    });

    return this.generateFeature(userId, 'flashcard-generator', rendered, {
      ...params,
      format: 'json' as const,
    });
  }

  async generateMindMap(
    userId: string,
    params: {
      topic: string;
      depth?: string;
      material?: string;
    },
  ): Promise<AiFeatureResult> {
    const material =
      params.material || (await this.getRelevantMaterial(params.topic));

    const rendered = PromptRegistry.render('mind-map-generator', {
      topic: params.topic,
      depth: params.depth || '3',
      material,
    });

    return this.generateFeature(userId, 'mind-map-generator', rendered, {
      ...params,
      format: 'json' as const,
    });
  }

  async summarizeDocument(
    userId: string,
    params: {
      documentId: string;
      length?: string;
    },
  ): Promise<AiFeatureResult> {
    // Get document content from audit logs
    const docLog = await this.prisma.auditLog.findUnique({
      where: { id: params.documentId },
    });

    const docData = docLog?.newData as any;
    const content = docData?.content || docData?.text || 'No content available';

    const rendered = PromptRegistry.render('pdf-summarizer', {
      title: docData?.filename || 'Document',
      content: content.slice(0, 10000),
      length: params.length || 'medium',
    });

    return this.generateFeature(userId, 'pdf-summarizer', rendered, params);
  }

  async generateStudyPlan(
    userId: string,
    params: {
      goals: string;
      availableTime: string;
      subjects: string;
      examDates: string;
      currentLevel: string;
    },
  ): Promise<AiFeatureResult> {
    const rendered = PromptRegistry.render('study-planner', {
      goals: params.goals,
      availableTime: params.availableTime,
      subjects: params.subjects,
      examDates: params.examDates,
      currentLevel: params.currentLevel,
    });

    return this.generateFeature(userId, 'study-planner', rendered, params);
  }

  async generateHomeworkFeedback(
    userId: string,
    params: {
      assignment: string;
      submission: string;
      rubric?: string;
    },
  ): Promise<AiFeatureResult> {
    const rendered = PromptRegistry.render('homework-feedback', {
      assignment: params.assignment,
      submission: params.submission,
      rubric: params.rubric || 'General quality assessment',
    });

    return this.generateFeature(userId, 'homework-feedback', rendered, params);
  }

  async generateLessonSummary(
    userId: string,
    params: {
      content: string;
      maxLength?: number;
    },
  ): Promise<AiFeatureResult> {
    const messages: ChatMessage[] = [
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

  async predictDifficulty(
    userId: string,
    params: {
      content: string;
      subject: string;
    },
  ): Promise<AiFeatureResult> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content:
          'You are an educational assessment expert. Analyze content difficulty.',
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

  async generateRecommendations(
    userId: string,
    params: {
      currentTopics: string[];
      performance?: string;
      goals?: string;
    },
  ): Promise<AiFeatureResult> {
    const messages: ChatMessage[] = [
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

  private async generateFeature(
    userId: string,
    feature: string,
    rendered: { system: string; user: string },
    params: any,
  ): Promise<AiFeatureResult> {
    const startTime = Date.now();
    const provider = this.providerFactory.getActiveProvider();

    const messages: ChatMessage[] = [];
    if (rendered.system)
      messages.push({ role: 'system', content: rendered.system });
    messages.push({ role: 'user', content: rendered.user });

    try {
      const response = await provider.chatCompletion({
        messages,
        temperature: this.config.get<number>('ai.chatTemperature') || 0.7,
        maxTokens: this.config.get<number>('ai.chatMaxTokens') || 4096,
      });

      const cost = this.analyticsService.calculateCost(
        response.usage.promptTokens,
        response.usage.completionTokens,
        {
          costInputPer1M: this.config.get<number>('ai.costInputPer1M') || 0.15,
          costOutputPer1M: this.config.get<number>('ai.costOutputPer1M') || 0.6,
        },
      );

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
    } catch (error) {
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

  private async generateFromMessages(
    userId: string,
    feature: string,
    messages: ChatMessage[],
  ): Promise<AiFeatureResult> {
    const startTime = Date.now();
    const provider = this.providerFactory.getActiveProvider();

    try {
      const response = await provider.chatCompletion({
        messages,
        temperature: this.config.get<number>('ai.chatTemperature') || 0.7,
        maxTokens: this.config.get<number>('ai.chatMaxTokens') || 4096,
      });

      const cost = this.analyticsService.calculateCost(
        response.usage.promptTokens,
        response.usage.completionTokens,
        {
          costInputPer1M: this.config.get<number>('ai.costInputPer1M') || 0.15,
          costOutputPer1M: this.config.get<number>('ai.costOutputPer1M') || 0.6,
        },
      );

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
    } catch (error) {
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

  private async getCourseContext(courseId: string): Promise<string> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true, description: true, category: true },
    });
    return course
      ? `${course.title} (${course.category}): ${course.description || ''}`
      : 'General';
  }

  private async getRelevantMaterial(
    topic: string,
    subject?: string,
  ): Promise<string> {
    // Search for relevant course materials
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

    return (
      courses
        .flatMap((c) => c.lessons.map((l) => `${l.title}: ${l.content || ''}`))
        .join('\n\n')
        .slice(0, 5000) || 'No specific course materials available'
    );
  }
}
