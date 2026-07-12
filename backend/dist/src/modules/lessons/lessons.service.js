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
var LessonsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let LessonsService = LessonsService_1 = class LessonsService {
    prisma;
    logger = new common_1.Logger(LessonsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(authorId, data) {
        return this.prisma.lesson.create({
            data: {
                title: data.title,
                content: data.content,
                courseId: data.courseId,
                authorId,
                videoUrl: data.videoUrl,
                pdfUrl: data.pdfUrl,
                duration: data.duration,
                order: data.order ?? 0,
            },
            include: { course: { select: { id: true, title: true } } },
        });
    }
    async findAll() {
        return this.prisma.lesson.findMany({
            include: {
                course: { select: { id: true, title: true } },
                author: { select: { id: true, name: true, avatar: true } },
            },
            orderBy: { order: 'asc' },
        });
    }
    async findById(id) {
        return this.prisma.lesson.findUnique({
            where: { id },
            include: {
                course: { select: { id: true, title: true } },
                author: { select: { id: true, name: true, avatar: true } },
            },
        });
    }
    async findByCourseId(courseId) {
        return this.prisma.lesson.findMany({
            where: { courseId },
            orderBy: { order: 'asc' },
            include: { author: { select: { id: true, name: true } } },
        });
    }
    async update(id, userId, data) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id } });
        if (!lesson || lesson.authorId !== userId)
            throw new Error('Not authorized');
        return this.prisma.lesson.update({ where: { id }, data });
    }
    async delete(id, userId) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id } });
        if (!lesson || lesson.authorId !== userId)
            throw new Error('Not authorized');
        return this.prisma.lesson.delete({ where: { id } });
    }
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = LessonsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LessonsService);
//# sourceMappingURL=lessons.service.js.map