import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class StoriesService {
  private readonly logger = new Logger(StoriesService.name);
  constructor(private prisma: PrismaService) {}

  async create(authorId: string, data: { image: string; text?: string }) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    return this.prisma.story.create({
      data: { image: data.image, text: data.text, authorId, expiresAt },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    });
  }

  async findAll() {
    return this.prisma.story.findMany({
      where: { expiresAt: { gt: new Date() } },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        _count: { select: { viewers: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.story.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        viewers: { include: { user: { select: { id: true, name: true } } } },
      },
    });
  }

  async markAsViewed(storyId: string, userId: string) {
    return this.prisma.storyViewer.upsert({
      where: { storyId_userId: { storyId, userId } },
      update: { viewedAt: new Date() },
      create: { storyId, userId },
    });
  }

  async delete(id: string, userId: string) {
    const story = await this.prisma.story.findUnique({ where: { id } });
    if (!story || story.authorId !== userId) throw new Error('Not authorized');
    return this.prisma.story.delete({ where: { id } });
  }
}
