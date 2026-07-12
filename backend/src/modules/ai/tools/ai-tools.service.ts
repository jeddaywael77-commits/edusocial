import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { EmbeddingService } from '../embeddings/embedding.service';
import { ConfigService } from '@nestjs/config';

export interface AiTool {
  name: string;
  description: string;
  execute: (params: any, userId: string) => Promise<string>;
}

@Injectable()
export class AiToolsService {
  private readonly logger = new Logger(AiToolsService.name);
  private tools: Map<string, AiTool> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingService: EmbeddingService,
    private readonly config: ConfigService,
  ) {
    this.registerBuiltinTools();
  }

  private registerBuiltinTools() {
    this.tools.set('search_documents', {
      name: 'search_documents',
      description: 'Search through uploaded documents for relevant content',
      execute: async (params: { query: string; limit?: number }, userId: string) => {
        const results = await this.embeddingService.searchSimilar(
          params.query,
          `user_${userId}`,
          { limit: params.limit || 5 },
        );
        return results.map((r) => `[${r.payload.source}]: ${r.payload.content}`).join('\n\n');
      },
    });

    this.tools.set('get_course_materials', {
      name: 'get_course_materials',
      description: 'Get course materials and lessons for a specific course',
      execute: async (params: { courseId: string }) => {
        const lessons = await this.prisma.lesson.findMany({
          where: { courseId: params.courseId, isPublished: true },
          orderBy: { order: 'asc' },
          select: { title: true, content: true, order: true },
        });
        return lessons.map((l) => `Lesson ${l.order}: ${l.title}\n${l.content || 'No content'}`).join('\n\n');
      },
    });

    this.tools.set('get_assignments', {
      name: 'get_assignments',
      description: 'Get assignments for a course',
      execute: async (params: { courseId: string }) => {
        const assignments = await this.prisma.assignment.findMany({
          where: { courseId: params.courseId },
          orderBy: { dueDate: 'asc' },
          select: { title: true, description: true, dueDate: true, maxScore: true },
        });
        return assignments.map((a) => `${a.title} (Due: ${a.dueDate.toISOString().split('T')[0]}, Max: ${a.maxScore})\n${a.description || 'No description'}`).join('\n\n');
      },
    });

    this.tools.set('get_user_profile', {
      name: 'get_user_profile',
      description: 'Get the current user profile information',
      execute: async (params: any, userId: string) => {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { name: true, email: true, bio: true, school: true, role: true, level: true, xp: true },
        });
        if (!user) return 'User not found';
        return `Name: ${user.name}\nRole: ${user.role}\nSchool: ${user.school || 'Not set'}\nBio: ${user.bio || 'Not set'}\nLevel: ${user.level}\nXP: ${user.xp}`;
      },
    });

    this.tools.set('get_calendar_events', {
      name: 'get_calendar_events',
      description: 'Get upcoming calendar events',
      execute: async (params: { days?: number }, userId: string) => {
        const days = params.days || 7;
        const until = new Date();
        until.setDate(until.getDate() + days);
        const events = await this.prisma.calendarEvent.findMany({
          where: { userId, date: { gte: new Date(), lte: until } },
          orderBy: { date: 'asc' },
          select: { title: true, date: true, startTime: true, type: true, description: true },
        });
        return events.map((e) => `${e.date.toISOString().split('T')[0]} ${e.title} (${e.type})\n${e.description || ''}`).join('\n\n') || 'No upcoming events';
      },
    });

    this.tools.set('search_knowledge_base', {
      name: 'search_knowledge_base',
      description: 'Search the general knowledge base (all indexed documents)',
      execute: async (params: { query: string; limit?: number }) => {
        const results = await this.embeddingService.searchSimilar(
          params.query,
          'knowledge_base',
          { limit: params.limit || 5 },
        );
        return results.map((r) => `[${r.payload.source}]: ${r.payload.content}`).join('\n\n') || 'No relevant documents found';
      },
    });
  }

  getTool(name: string): AiTool | undefined {
    return this.tools.get(name);
  }

  getToolDefinitions(): { name: string; description: string; parameters: any }[] {
    return [
      {
        name: 'search_documents',
        description: 'Search through uploaded documents for relevant content',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query' },
            limit: { type: 'number', description: 'Max results', default: 5 },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_course_materials',
        description: 'Get course materials and lessons for a specific course',
        parameters: {
          type: 'object',
          properties: {
            courseId: { type: 'string', description: 'Course ID' },
          },
          required: ['courseId'],
        },
      },
      {
        name: 'get_assignments',
        description: 'Get assignments for a course',
        parameters: {
          type: 'object',
          properties: {
            courseId: { type: 'string', description: 'Course ID' },
          },
          required: ['courseId'],
        },
      },
      {
        name: 'get_user_profile',
        description: 'Get the current user profile information',
        parameters: { type: 'object', properties: {} },
      },
      {
        name: 'get_calendar_events',
        description: 'Get upcoming calendar events',
        parameters: {
          type: 'object',
          properties: {
            days: { type: 'number', description: 'Number of days ahead', default: 7 },
          },
        },
      },
      {
        name: 'search_knowledge_base',
        description: 'Search the general knowledge base',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query' },
            limit: { type: 'number', description: 'Max results', default: 5 },
          },
          required: ['query'],
        },
      },
    ];
  }

  async executeTool(name: string, params: any, userId: string): Promise<string> {
    const tool = this.tools.get(name);
    if (!tool) return `Tool "${name}" not found`;
    try {
      return await tool.execute(params, userId);
    } catch (error) {
      this.logger.error(`Tool execution failed: ${name}`, error);
      return `Error executing tool "${name}": ${error.message}`;
    }
  }
}
