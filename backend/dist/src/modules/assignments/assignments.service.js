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
var AssignmentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let AssignmentsService = AssignmentsService_1 = class AssignmentsService {
    prisma;
    logger = new common_1.Logger(AssignmentsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(authorId, data) {
        return this.prisma.assignment.create({
            data: {
                title: data.title,
                description: data.description,
                dueDate: new Date(data.dueDate),
                maxScore: data.maxScore ?? 100,
                courseId: data.courseId,
                authorId,
            },
            include: {
                course: { select: { id: true, title: true } },
                author: { select: { id: true, name: true, avatar: true } },
            },
        });
    }
    async findAll() {
        return this.prisma.assignment.findMany({
            include: {
                course: { select: { id: true, title: true } },
                author: { select: { id: true, name: true, avatar: true } },
                _count: { select: { submissions: true } },
            },
            orderBy: { dueDate: 'asc' },
        });
    }
    async findById(id) {
        return this.prisma.assignment.findUnique({
            where: { id },
            include: {
                course: { select: { id: true, title: true } },
                author: { select: { id: true, name: true, avatar: true } },
                submissions: {
                    include: {
                        student: { select: { id: true, name: true, avatar: true } },
                    },
                },
            },
        });
    }
    async update(id, userId, data) {
        const assignment = await this.prisma.assignment.findUnique({
            where: { id },
        });
        if (!assignment || assignment.authorId !== userId)
            throw new Error('Not authorized');
        const updateData = { ...data };
        if (data.dueDate)
            updateData.dueDate = new Date(data.dueDate);
        return this.prisma.assignment.update({ where: { id }, data: updateData });
    }
    async delete(id, userId) {
        const assignment = await this.prisma.assignment.findUnique({
            where: { id },
        });
        if (!assignment || assignment.authorId !== userId)
            throw new Error('Not authorized');
        return this.prisma.assignment.delete({ where: { id } });
    }
};
exports.AssignmentsService = AssignmentsService;
exports.AssignmentsService = AssignmentsService = AssignmentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssignmentsService);
//# sourceMappingURL=assignments.service.js.map