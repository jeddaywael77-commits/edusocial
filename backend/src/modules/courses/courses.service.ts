import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);
  constructor(private prisma: PrismaService) {}

  async create(teacherId: string, data: { title: string; description?: string; category: string; level?: string; thumbnail?: string }) {
    return this.prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        level: (data.level as any) || 'BEGINNER',
        thumbnail: data.thumbnail,
        teacherId,
      },
      include: { teacher: { select: { id: true, name: true, avatar: true } } },
    });
  }

  async findAll() {
    return this.prisma.course.findMany({
      include: {
        teacher: { select: { id: true, name: true, avatar: true } },
        _count: { select: { lessons: true, assignments: true, enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
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

  async update(id: string, userId: string, data: { title?: string; description?: string; thumbnail?: string; isPublished?: boolean }) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course || course.teacherId !== userId) throw new Error('Not authorized');
    return this.prisma.course.update({ where: { id }, data });
  }

  async delete(id: string, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course || course.teacherId !== userId) throw new Error('Not authorized');
    return this.prisma.course.delete({ where: { id } });
  }

  async enroll(courseId: string, userId: string) {
    return this.prisma.enrollment.create({
      data: { courseId, userId },
    });
  }

  async getEnrollments(courseId: string) {
    return this.prisma.enrollment.findMany({
      where: { courseId },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
  }
}
