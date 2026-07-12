import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AssignmentsService {
  private readonly logger = new Logger(AssignmentsService.name);
  constructor(private prisma: PrismaService) {}

  async create(
    authorId: string,
    data: {
      title: string;
      description?: string;
      dueDate: string;
      maxScore?: number;
      courseId?: string;
    },
  ) {
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

  async findById(id: string) {
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

  async update(
    id: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      dueDate?: string;
      maxScore?: number;
    },
  ) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
    });
    if (!assignment || assignment.authorId !== userId)
      throw new Error('Not authorized');
    const updateData: any = { ...data };
    if (data.dueDate) updateData.dueDate = new Date(data.dueDate);
    return this.prisma.assignment.update({ where: { id }, data: updateData });
  }

  async delete(id: string, userId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
    });
    if (!assignment || assignment.authorId !== userId)
      throw new Error('Not authorized');
    return this.prisma.assignment.delete({ where: { id } });
  }
}
