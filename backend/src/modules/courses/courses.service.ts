import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);
  constructor(private prisma: PrismaService) {}

  async create(
    teacherId: string,
    data: {
      title: string;
      description?: string;
      category: string;
      level?: string;
      thumbnail?: string;
    },
  ) {
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

  async update(
    id: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      thumbnail?: string;
      isPublished?: boolean;
    },
  ) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course || course.teacherId !== userId)
      throw new ForbiddenException('Not authorized');
    return this.prisma.course.update({ where: { id }, data });
  }

  async delete(id: string, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course || course.teacherId !== userId)
      throw new ForbiddenException('Not authorized');
    return this.prisma.course.delete({ where: { id } });
  }

  async enroll(courseId: string, userId: string) {
    return this.prisma.enrollment.create({
      data: { courseId, userId },
    });
  }

  async getEnrollments(courseId: string, page = 1, limit = 50) {
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
}
