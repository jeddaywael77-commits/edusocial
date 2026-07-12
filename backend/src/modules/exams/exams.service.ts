import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ExamsService {
  private readonly logger = new Logger(ExamsService.name);
  constructor(private prisma: PrismaService) {}

  async create(authorId: string, data: { title: string; description?: string; courseId: string; timeLimit: number; dueDate: string; questions?: any }) {
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

  async findById(id: string) {
    return this.prisma.exam.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, title: true } },
        author: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async findByCourseId(courseId: string) {
    return this.prisma.exam.findMany({
      where: { courseId },
      include: { author: { select: { id: true, name: true } } },
      orderBy: { dueDate: 'asc' },
    });
  }

  async update(id: string, userId: string, data: { title?: string; description?: string; timeLimit?: number; dueDate?: string; questions?: any }) {
    const exam = await this.prisma.exam.findUnique({ where: { id } });
    if (!exam || exam.authorId !== userId) throw new Error('Not authorized');
    const updateData: any = { ...data };
    if (data.dueDate) updateData.dueDate = new Date(data.dueDate);
    return this.prisma.exam.update({ where: { id }, data: updateData });
  }

  async delete(id: string, userId: string) {
    const exam = await this.prisma.exam.findUnique({ where: { id } });
    if (!exam || exam.authorId !== userId) throw new Error('Not authorized');
    return this.prisma.exam.delete({ where: { id } });
  }
}
