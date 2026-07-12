import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);
  constructor(private prisma: PrismaService) {}

  async create(uploadedById: string, data: { name: string; type: string; size: number; url: string; thumbnail?: string; tags?: string[] }) {
    return this.prisma.document.create({
      data: {
        name: data.name,
        type: data.type,
        size: data.size,
        url: data.url,
        thumbnail: data.thumbnail,
        tags: data.tags ?? [],
        uploadedById,
      },
      include: { uploadedBy: { select: { id: true, name: true, avatar: true } } },
    });
  }

  async findAll() {
    return this.prisma.document.findMany({
      include: { uploadedBy: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.document.findUnique({
      where: { id },
      include: { uploadedBy: { select: { id: true, name: true, avatar: true } } },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.document.findMany({
      where: { uploadedById: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string, userId: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc || doc.uploadedById !== userId) throw new Error('Not authorized');
    return this.prisma.document.delete({ where: { id } });
  }
}
