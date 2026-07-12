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
var AiToolsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiToolsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
const embedding_service_1 = require("../embeddings/embedding.service");
const config_1 = require("@nestjs/config");
let AiToolsService = AiToolsService_1 = class AiToolsService {
    prisma;
    embeddingService;
    config;
    logger = new common_1.Logger(AiToolsService_1.name);
    tools = new Map();
    constructor(prisma, embeddingService, config) {
        this.prisma = prisma;
        this.embeddingService = embeddingService;
        this.config = config;
        this.registerBuiltinTools();
    }
    registerBuiltinTools() {
        this.tools.set('search_documents', {
            name: 'search_documents',
            description: 'Search through uploaded documents for relevant content',
            execute: async (params, userId) => {
                const results = await this.embeddingService.searchSimilar(params.query, `user_${userId}`, { limit: params.limit || 5 });
                return results
                    .map((r) => `[${r.payload.source}]: ${r.payload.content}`)
                    .join('\n\n');
            },
        });
        this.tools.set('get_course_materials', {
            name: 'get_course_materials',
            description: 'Get course materials and lessons for a specific course',
            execute: async (params) => {
                const lessons = await this.prisma.lesson.findMany({
                    where: { courseId: params.courseId, isPublished: true },
                    orderBy: { order: 'asc' },
                    select: { title: true, content: true, order: true },
                });
                return lessons
                    .map((l) => `Lesson ${l.order}: ${l.title}\n${l.content || 'No content'}`)
                    .join('\n\n');
            },
        });
        this.tools.set('get_assignments', {
            name: 'get_assignments',
            description: 'Get assignments for a course',
            execute: async (params) => {
                const assignments = await this.prisma.assignment.findMany({
                    where: { courseId: params.courseId },
                    orderBy: { dueDate: 'asc' },
                    select: {
                        title: true,
                        description: true,
                        dueDate: true,
                        maxScore: true,
                    },
                });
                return assignments
                    .map((a) => `${a.title} (Due: ${a.dueDate.toISOString().split('T')[0]}, Max: ${a.maxScore})\n${a.description || 'No description'}`)
                    .join('\n\n');
            },
        });
        this.tools.set('get_user_profile', {
            name: 'get_user_profile',
            description: 'Get the current user profile information',
            execute: async (params, userId) => {
                const user = await this.prisma.user.findUnique({
                    where: { id: userId },
                    select: {
                        name: true,
                        email: true,
                        bio: true,
                        school: true,
                        role: true,
                        level: true,
                        xp: true,
                    },
                });
                if (!user)
                    return 'User not found';
                return `Name: ${user.name}\nRole: ${user.role}\nSchool: ${user.school || 'Not set'}\nBio: ${user.bio || 'Not set'}\nLevel: ${user.level}\nXP: ${user.xp}`;
            },
        });
        this.tools.set('get_calendar_events', {
            name: 'get_calendar_events',
            description: 'Get upcoming calendar events',
            execute: async (params, userId) => {
                const days = params.days || 7;
                const until = new Date();
                until.setDate(until.getDate() + days);
                const events = await this.prisma.calendarEvent.findMany({
                    where: { userId, date: { gte: new Date(), lte: until } },
                    orderBy: { date: 'asc' },
                    select: {
                        title: true,
                        date: true,
                        startTime: true,
                        type: true,
                        description: true,
                    },
                });
                return (events
                    .map((e) => `${e.date.toISOString().split('T')[0]} ${e.title} (${e.type})\n${e.description || ''}`)
                    .join('\n\n') || 'No upcoming events');
            },
        });
        this.tools.set('search_knowledge_base', {
            name: 'search_knowledge_base',
            description: 'Search the general knowledge base (all indexed documents)',
            execute: async (params) => {
                const results = await this.embeddingService.searchSimilar(params.query, 'knowledge_base', { limit: params.limit || 5 });
                return (results
                    .map((r) => `[${r.payload.source}]: ${r.payload.content}`)
                    .join('\n\n') || 'No relevant documents found');
            },
        });
    }
    getTool(name) {
        return this.tools.get(name);
    }
    getToolDefinitions() {
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
                        days: {
                            type: 'number',
                            description: 'Number of days ahead',
                            default: 7,
                        },
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
    async executeTool(name, params, userId) {
        const tool = this.tools.get(name);
        if (!tool)
            return `Tool "${name}" not found`;
        try {
            return await tool.execute(params, userId);
        }
        catch (error) {
            this.logger.error(`Tool execution failed: ${name}`, error);
            return `Error executing tool "${name}": ${error.message}`;
        }
    }
};
exports.AiToolsService = AiToolsService;
exports.AiToolsService = AiToolsService = AiToolsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        embedding_service_1.EmbeddingService,
        config_1.ConfigService])
], AiToolsService);
//# sourceMappingURL=ai-tools.service.js.map