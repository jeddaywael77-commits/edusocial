import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';
import { AiChatService } from './chat/ai-chat.service';
import { AiFeaturesService } from './ai-features.service';
import { AiAnalyticsService } from './analytics/ai-analytics.service';
import { ProviderFactory } from './providers/provider.factory';
import {
  CreateConversationDto,
  SendMessageDto,
  AiTutorDto,
  HomeworkAssistantDto,
  GenerateQuizDto,
  GenerateFlashcardsDto,
  GenerateMindMapDto,
  SummarizeDocumentDto,
  StudyPlanDto,
  HomeworkFeedbackDto,
} from './dto/ai.dto';
import { Observable, Observer } from 'rxjs';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(
    private readonly chatService: AiChatService,
    private readonly featuresService: AiFeaturesService,
    private readonly analyticsService: AiAnalyticsService,
    private readonly providerFactory: ProviderFactory,
  ) {}

  // === Provider Management ===

  @Get('providers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get available AI providers' })
  async getProviders() {
    return {
      available: this.providerFactory.getAvailableProviders(),
      active: this.providerFactory.getActiveProvider().name,
    };
  }

  @Put('providers/:name')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Switch active AI provider (admin only)' })
  async switchProvider(@Param('name') name: string) {
    this.providerFactory.setActiveProvider(name);
    return { active: name };
  }

  // === Chat ===

  @Post('chat/conversations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new AI chat conversation' })
  async createConversation(@Req() req: any, @Body() dto: CreateConversationDto) {
    return this.chatService.createConversation(req.user.id, dto.title, dto.model);
  }

  @Get('chat/conversations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List AI chat conversations' })
  async getConversations(@Req() req: any) {
    return this.chatService.getConversations(req.user.id);
  }

  @Get('chat/conversations/:id/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get conversation messages' })
  async getMessages(@Param('id') id: string) {
    return this.chatService.getMessages(id);
  }

  @Post('chat/conversations/:id/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send a message to AI' })
  async sendMessage(
    @Req() req: any,
    @Param('id') conversationId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(conversationId, req.user.id, dto.content, {
      systemPrompt: dto.systemPrompt,
      useRAG: dto.useRAG,
      ragCollection: dto.ragCollection,
      temperature: dto.temperature,
      maxTokens: dto.maxTokens,
    });
  }

  @Post('chat/conversations/:id/stream')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Stream AI response (SSE)' })
  async streamMessage(
    @Req() req: any,
    @Param('id') conversationId: string,
    @Body() dto: SendMessageDto,
    @Res() res: any,
  ) {
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
      const stream = this.chatService.sendMessageStream(
        conversationId,
        req.user.id,
        dto.content,
        {
          systemPrompt: dto.systemPrompt,
          useRAG: dto.useRAG,
          ragCollection: dto.ragCollection,
          temperature: dto.temperature,
          maxTokens: dto.maxTokens,
        },
      );

      for await (const chunk of stream) {
        if (closed) break;
        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }
        if (chunk.finishReason) break;
      }

      if (!closed) {
        res.write('data: [DONE]\n\n');
        res.end();
      }
    } catch (error) {
      if (!closed) {
        res.write(`data: {"error":"Streaming error"}\n\n`);
        res.end();
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  @Delete('chat/conversations/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a conversation' })
  async deleteConversation(@Req() req: any, @Param('id') id: string) {
    await this.chatService.deleteConversation(id, req.user.id);
    return { deleted: true };
  }

  // === AI Features ===

  @Post('features/tutor')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'AI Tutor - Ask a question' })
  async aiTutor(@Req() req: any, @Body() dto: AiTutorDto) {
    return this.featuresService.aiTutor(req.user.id, dto);
  }

  @Post('features/homework')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Homework Assistant' })
  async homeworkAssistant(@Req() req: any, @Body() dto: HomeworkAssistantDto) {
    return this.featuresService.homeworkAssistant(req.user.id, dto);
  }

  @Post('features/quiz')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate a quiz' })
  async generateQuiz(@Req() req: any, @Body() dto: GenerateQuizDto) {
    return this.featuresService.generateQuiz(req.user.id, dto);
  }

  @Post('features/flashcards')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate flashcards' })
  async generateFlashcards(@Req() req: any, @Body() dto: GenerateFlashcardsDto) {
    return this.featuresService.generateFlashcards(req.user.id, dto);
  }

  @Post('features/mind-map')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate a mind map' })
  async generateMindMap(@Req() req: any, @Body() dto: GenerateMindMapDto) {
    return this.featuresService.generateMindMap(req.user.id, dto);
  }

  @Post('features/summarize')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Summarize a document' })
  async summarizeDocument(@Req() req: any, @Body() dto: SummarizeDocumentDto) {
    return this.featuresService.summarizeDocument(req.user.id, dto);
  }

  @Post('features/study-plan')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate a study plan' })
  async generateStudyPlan(@Req() req: any, @Body() dto: StudyPlanDto) {
    return this.featuresService.generateStudyPlan(req.user.id, dto);
  }

  @Post('features/feedback')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get homework feedback' })
  async generateFeedback(@Req() req: any, @Body() dto: HomeworkFeedbackDto) {
    return this.featuresService.generateHomeworkFeedback(req.user.id, dto);
  }

  @Post('features/explain-lesson/:lessonId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Explain a lesson' })
  async explainLesson(@Req() req: any, @Param('lessonId') lessonId: string) {
    return this.featuresService.explainLesson(req.user.id, { lessonId });
  }

  // === Analytics ===

  @Get('analytics/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user AI usage stats' })
  async getUserStats(@Req() req: any, @Query('days') days?: string) {
    return this.analyticsService.getUserStats(req.user.id, days ? parseInt(days) : 30);
  }

  @Get('analytics/global')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get global AI usage stats (admin only)' })
  async getGlobalStats(@Query('days') days?: string) {
    return this.analyticsService.getGlobalStats(days ? parseInt(days) : 7);
  }

  // === Suggested Questions ===

  @Get('suggested-questions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get suggested AI questions' })
  async getSuggestedQuestions() {
    return [
      { category: 'Tutoring', questions: ['Explain photosynthesis', 'How does photosynthesis work?', 'What are the steps of mitosis?'] },
      { category: 'Homework', questions: ['Help me solve this math problem', 'Check my essay for errors', 'Explain this concept'] },
      { category: 'Study', questions: ['Create flashcards for Chapter 5', 'Make a mind map of the water cycle', 'Generate a quiz on World War II'] },
      { category: 'Planning', questions: ['Create a study plan for my exams', 'Summarize this PDF', 'What should I study next?'] },
    ];
  }
}
