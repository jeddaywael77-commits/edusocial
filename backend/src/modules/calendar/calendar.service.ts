import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { title: string; description?: string; date: string; startTime: string; endTime?: string; type?: string; color?: string; courseId?: string }) {
    return this.prisma.calendarEvent.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        startTime: new Date(data.startTime),
        endTime: data.endTime ? new Date(data.endTime) : undefined,
        type: (data.type as any) || 'EVENT',
        color: data.color ?? '#3B82F6',
        userId,
        courseId: data.courseId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.calendarEvent.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.calendarEvent.findUnique({
      where: { id },
      include: { course: { select: { id: true, title: true } } },
    });
  }

  async findByDateRange(userId: string, start: string, end: string) {
    return this.prisma.calendarEvent.findMany({
      where: {
        userId,
        date: { gte: new Date(start), lte: new Date(end) },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async update(id: string, userId: string, data: { title?: string; description?: string; date?: string; startTime?: string; endTime?: string; type?: string; color?: string }) {
    const event = await this.prisma.calendarEvent.findUnique({ where: { id } });
    if (!event || event.userId !== userId) throw new Error('Not authorized');
    const updateData: any = { ...data };
    if (data.date) updateData.date = new Date(data.date);
    if (data.startTime) updateData.startTime = new Date(data.startTime);
    if (data.endTime) updateData.endTime = new Date(data.endTime);
    return this.prisma.calendarEvent.update({ where: { id }, data: updateData });
  }

  async delete(id: string, userId: string) {
    const event = await this.prisma.calendarEvent.findUnique({ where: { id } });
    if (!event || event.userId !== userId) throw new Error('Not authorized');
    return this.prisma.calendarEvent.delete({ where: { id } });
  }
}
