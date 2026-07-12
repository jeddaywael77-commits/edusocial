import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class LessonsService {
  private readonly logger = new Logger(LessonsService.name);
  constructor(private prisma: PrismaService) {}

  async create(authorId: string, data: { title: string; content?: string; courseId: string; videoUrl?: string; pdfUrl?: string; duration?: number; order?: number }) {
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

  async findById(id: string) {
    return this.prisma.lesson.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, title: true } },
        author: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async findByCourseId(courseId: string) {
    return this.prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: { author: { select: { id: true, name: true } } },
    });
  }

  async update(id: string, userId: string, data: { title?: string; content?: string; videoUrl?: string; pdfUrl?: string; duration?: number; order?: number; isPublished?: boolean }) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson || lesson.authorId !== userId) throw new Error('Not authorized');
    return this.prisma.lesson.update({ where: { id }, data });
  }

  async delete(id: string, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson || lesson.authorId !== userId) throw new Error('Not authorized');
    return this.prisma.lesson.delete({ where: { id } });
  }
}
