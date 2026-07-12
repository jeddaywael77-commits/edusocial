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
var SubmissionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let SubmissionsService = SubmissionsService_1 = class SubmissionsService {
    prisma;
    logger = new common_1.Logger(SubmissionsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(studentId, data) {
        return this.prisma.submission.create({
            data: {
                assignmentId: data.assignmentId,
                studentId,
                content: data.content,
                fileUrl: data.fileUrl,
                status: 'SUBMITTED',
            },
            include: {
                assignment: { select: { id: true, title: true } },
                student: { select: { id: true, name: true, avatar: true } },
            },
        });
    }
    async findAll() {
        return this.prisma.submission.findMany({
            include: {
                assignment: { select: { id: true, title: true } },
                student: { select: { id: true, name: true, avatar: true } },
            },
            orderBy: { submittedAt: 'desc' },
        });
    }
    async findById(id) {
        return this.prisma.submission.findUnique({
            where: { id },
            include: {
                assignment: { select: { id: true, title: true, maxScore: true } },
                student: { select: { id: true, name: true, avatar: true } },
            },
        });
    }
    async findByAssignmentId(assignmentId) {
        return this.prisma.submission.findMany({
            where: { assignmentId },
            include: { student: { select: { id: true, name: true, avatar: true } } },
            orderBy: { submittedAt: 'desc' },
        });
    }
    async grade(id, userId, data) {
        const submission = await this.prisma.submission.findUnique({ where: { id }, include: { assignment: true } });
        if (!submission)
            throw new Error('Submission not found');
        return this.prisma.submission.update({
            where: { id },
            data: { score: data.score, feedback: data.feedback, status: 'GRADED', gradedAt: new Date() },
        });
    }
};
exports.SubmissionsService = SubmissionsService;
exports.SubmissionsService = SubmissionsService = SubmissionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubmissionsService);
//# sourceMappingURL=submissions.service.js.map