import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MarketplaceService {
  private readonly logger = new Logger(MarketplaceService.name);
  constructor(private prisma: PrismaService) {}

  async create(
    sellerId: string,
    data: {
      title: string;
      description?: string;
      price: number;
      category: string;
      images?: string[];
      condition?: string;
      currency?: string;
    },
  ) {
    return this.prisma.marketplaceItem.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        images: data.images ?? [],
        condition: data.condition ?? 'used',
        currency: data.currency ?? 'USD',
        sellerId,
      },
      include: { seller: { select: { id: true, name: true, avatar: true } } },
    });
  }

  async findAll() {
    return this.prisma.marketplaceItem.findMany({
      where: { isAvailable: true },
      include: { seller: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.marketplaceItem.findUnique({
      where: { id },
      include: {
        seller: {
          select: { id: true, name: true, avatar: true, isOnline: true },
        },
      },
    });
  }

  async findBySeller(sellerId: string) {
    return this.prisma.marketplaceItem.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(
    id: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      price?: number;
      isAvailable?: boolean;
      images?: string[];
    },
  ) {
    const item = await this.prisma.marketplaceItem.findUnique({
      where: { id },
    });
    if (!item || item.sellerId !== userId) throw new Error('Not authorized');
    return this.prisma.marketplaceItem.update({ where: { id }, data });
  }

  async delete(id: string, userId: string) {
    const item = await this.prisma.marketplaceItem.findUnique({
      where: { id },
    });
    if (!item || item.sellerId !== userId) throw new Error('Not authorized');
    return this.prisma.marketplaceItem.delete({ where: { id } });
  }
}
