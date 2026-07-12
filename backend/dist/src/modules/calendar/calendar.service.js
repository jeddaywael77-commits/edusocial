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
var CalendarService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let CalendarService = CalendarService_1 = class CalendarService {
    prisma;
    logger = new common_1.Logger(CalendarService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        return this.prisma.calendarEvent.create({
            data: {
                title: data.title,
                description: data.description,
                date: new Date(data.date),
                startTime: new Date(data.startTime),
                endTime: data.endTime ? new Date(data.endTime) : undefined,
                type: data.type || 'EVENT',
                color: data.color ?? '#3B82F6',
                userId,
                courseId: data.courseId,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.calendarEvent.findMany({
            where: { userId },
            orderBy: { date: 'asc' },
        });
    }
    async findById(id) {
        return this.prisma.calendarEvent.findUnique({
            where: { id },
            include: { course: { select: { id: true, title: true } } },
        });
    }
    async findByDateRange(userId, start, end) {
        return this.prisma.calendarEvent.findMany({
            where: {
                userId,
                date: { gte: new Date(start), lte: new Date(end) },
            },
            orderBy: { startTime: 'asc' },
        });
    }
    async update(id, userId, data) {
        const event = await this.prisma.calendarEvent.findUnique({ where: { id } });
        if (!event || event.userId !== userId)
            throw new Error('Not authorized');
        const updateData = { ...data };
        if (data.date)
            updateData.date = new Date(data.date);
        if (data.startTime)
            updateData.startTime = new Date(data.startTime);
        if (data.endTime)
            updateData.endTime = new Date(data.endTime);
        return this.prisma.calendarEvent.update({
            where: { id },
            data: updateData,
        });
    }
    async delete(id, userId) {
        const event = await this.prisma.calendarEvent.findUnique({ where: { id } });
        if (!event || event.userId !== userId)
            throw new Error('Not authorized');
        return this.prisma.calendarEvent.delete({ where: { id } });
    }
};
exports.CalendarService = CalendarService;
exports.CalendarService = CalendarService = CalendarService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CalendarService);
//# sourceMappingURL=calendar.service.js.map