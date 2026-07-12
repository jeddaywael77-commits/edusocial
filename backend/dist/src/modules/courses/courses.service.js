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
var CoursesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let CoursesService = CoursesService_1 = class CoursesService {
    prisma;
    logger = new common_1.Logger(CoursesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(teacherId, data) {
        return this.prisma.course.create({
            data: {
                title: data.title,
                description: data.description,
                category: data.category,
                level: data.level || 'BEGINNER',
                thumbnail: data.thumbnail,
                teacherId,
            },
            include: { teacher: { select: { id: true, name: true, avatar: true } } },
        });
    }
    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const take = Math.min(limit, 50);
        const [courses, total] = await Promise.all([
            this.prisma.course.findMany({
                include: {
                    teacher: { select: { id: true, name: true, avatar: true } },
                    _count: {
                        select: { lessons: true, assignments: true, enrollments: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.course.count(),
        ]);
        return {
            data: courses,
            meta: { total, page, limit: take, totalPages: Math.ceil(total / take) },
        };
    }
    async findById(id) {
        return this.prisma.course.findUnique({
            where: { id },
            include: {
                teacher: { select: { id: true, name: true, avatar: true } },
                lessons: { orderBy: { order: 'asc' } },
                assignments: true,
                _count: { select: { enrollments: true } },
            },
        });
    }
    async update(id, userId, data) {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course || course.teacherId !== userId)
            throw new common_1.ForbiddenException('Not authorized');
        return this.prisma.course.update({ where: { id }, data });
    }
    async delete(id, userId) {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course || course.teacherId !== userId)
            throw new common_1.ForbiddenException('Not authorized');
        return this.prisma.course.delete({ where: { id } });
    }
    async enroll(courseId, userId) {
        return this.prisma.enrollment.create({
            data: { courseId, userId },
        });
    }
    async getEnrollments(courseId, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const take = Math.min(limit, 100);
        const [enrollments, total] = await Promise.all([
            this.prisma.enrollment.findMany({
                where: { courseId },
                include: { user: { select: { id: true, name: true, avatar: true } } },
                skip,
                take,
                orderBy: { enrolledAt: 'desc' },
            }),
            this.prisma.enrollment.count({ where: { courseId } }),
        ]);
        return {
            data: enrollments,
            meta: { total, page, limit: take, totalPages: Math.ceil(total / take) },
        };
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = CoursesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map