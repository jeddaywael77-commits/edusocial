import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SubmissionsService {
  private readonly logger = new Logger(SubmissionsService.name);
  constructor(private prisma: PrismaService) {}

  async create(
    studentId: string,
    data: { assignmentId: string; content?: string; fileUrl?: string },
  ) {
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

  async findById(id: string) {
    return this.prisma.submission.findUnique({
      where: { id },
      include: {
        assignment: { select: { id: true, title: true, maxScore: true } },
        student: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async findByAssignmentId(assignmentId: string) {
    return this.prisma.submission.findMany({
      where: { assignmentId },
      include: { student: { select: { id: true, name: true, avatar: true } } },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async grade(
    id: string,
    userId: string,
    data: { score: number; feedback?: string },
  ) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: { assignment: true },
    });
    if (!submission) throw new Error('Submission not found');
    return this.prisma.submission.update({
      where: { id },
      data: {
        score: data.score,
        feedback: data.feedback,
        status: 'GRADED',
        gradedAt: new Date(),
      },
    });
  }
}
