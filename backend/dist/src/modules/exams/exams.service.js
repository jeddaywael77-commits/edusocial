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
var ExamsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ExamsService = ExamsService_1 = class ExamsService {
    prisma;
    logger = new common_1.Logger(ExamsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(authorId, data) {
        return this.prisma.exam.create({
            data: {
                title: data.title,
                description: data.description,
                courseId: data.courseId,
                authorId,
                timeLimit: data.timeLimit,
                dueDate: new Date(data.dueDate),
                questions: data.questions ?? [],
            },
            include: { course: { select: { id: true, title: true } } },
        });
    }
    async findAll() {
        return this.prisma.exam.findMany({
            include: {
                course: { select: { id: true, title: true } },
                author: { select: { id: true, name: true, avatar: true } },
            },
            orderBy: { dueDate: 'asc' },
        });
    }
    async findById(id) {
        return this.prisma.exam.findUnique({
            where: { id },
            include: {
                course: { select: { id: true, title: true } },
                author: { select: { id: true, name: true, avatar: true } },
            },
        });
    }
    async findByCourseId(courseId) {
        return this.prisma.exam.findMany({
            where: { courseId },
            include: { author: { select: { id: true, name: true } } },
            orderBy: { dueDate: 'asc' },
        });
    }
    async update(id, userId, data) {
        const exam = await this.prisma.exam.findUnique({ where: { id } });
        if (!exam || exam.authorId !== userId)
            throw new Error('Not authorized');
        const updateData = { ...data };
        if (data.dueDate)
            updateData.dueDate = new Date(data.dueDate);
        return this.prisma.exam.update({ where: { id }, data: updateData });
    }
    async delete(id, userId) {
        const exam = await this.prisma.exam.findUnique({ where: { id } });
        if (!exam || exam.authorId !== userId)
            throw new Error('Not authorized');
        return this.prisma.exam.delete({ where: { id } });
    }
};
exports.ExamsService = ExamsService;
exports.ExamsService = ExamsService = ExamsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExamsService);
//# sourceMappingURL=exams.service.js.map