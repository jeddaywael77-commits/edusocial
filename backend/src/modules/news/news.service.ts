import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { QueryNewsDto } from './dto/query-news.dto';

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor(private prisma: PrismaService) {}

  async create(authorId: string, dto: CreateArticleDto) {
    const slug = this.slugify(dto.title);

    const article = await this.prisma.newsArticle.create({
      data: {
        title: dto.title,
        slug,
        content: dto.content,
        summary: dto.summary,
        coverImage: dto.coverImage,
        category: dto.category || 'general',
        isPublished: dto.isPublished ?? true,
        authorId,
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, role: true },
        },
        _count: { select: { comments: true, likes: true } },
      },
    });

    this.logger.log(`News article created: ${article.id}`);
    return article;
  }

  async findAll(query: QueryNewsDto, userId?: string) {
    const limit = Math.min(50, Math.max(1, query.limit || 20));

    const where: Prisma.NewsArticleWhereInput = {
      isDeleted: false,
      isPublished: true,
      ...(query.category && { category: query.category }),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' } },
          { content: { contains: query.search, mode: 'insensitive' } },
          { summary: { contains: query.search, mode: 'insensitive' } },
        ],
      }),
    };

    const articles = await this.prisma.newsArticle.findMany({
      where,
      take: limit,
      ...(query.cursor && {
        skip: 1,
        cursor: { id: query.cursor },
      }),
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, role: true },
        },
        _count: { select: { comments: true, likes: true } },
        ...(userId && {
          likes: { where: { userId }, select: { id: true } },
        }),
      },
    });

    return {
      data: articles.map((a) => ({
        ...a,
        isLiked: userId ? a.likes?.length > 0 : false,
        likes: undefined,
      })),
      nextCursor:
        articles.length === limit ? articles[articles.length - 1].id : null,
    };
  }

  async findLatest(limit = 5) {
    return this.prisma.newsArticle.findMany({
      where: { isDeleted: false, isPublished: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, role: true },
        },
        _count: { select: { comments: true, likes: true } },
      },
    });
  }

  async findById(id: string, userId?: string) {
    const article = await this.prisma.newsArticle.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, role: true },
        },
        _count: { select: { comments: true, likes: true } },
        ...(userId && {
          likes: { where: { userId }, select: { id: true } },
        }),
      },
    });

    if (!article || article.isDeleted) {
      throw new NotFoundException('Article not found');
    }

    await this.prisma.newsArticle.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return {
      ...article,
      isLiked: userId ? (article as any).likes?.length > 0 : false,
      likes: undefined,
      viewCount: article.viewCount + 1,
    };
  }

  async update(id: string, userId: string, dto: UpdateArticleDto) {
    const article = await this.prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!article || article.isDeleted) {
      throw new NotFoundException('Article not found');
    }

    if (article.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own articles');
    }

    return this.prisma.newsArticle.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.content && { content: dto.content }),
        ...(dto.summary !== undefined && { summary: dto.summary }),
        ...(dto.coverImage !== undefined && { coverImage: dto.coverImage }),
        ...(dto.category && { category: dto.category }),
        ...(dto.isPublished !== undefined && { isPublished: dto.isPublished }),
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, role: true },
        },
        _count: { select: { comments: true, likes: true } },
      },
    });
  }

  async delete(id: string, userId: string) {
    const article = await this.prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!article || article.isDeleted) {
      throw new NotFoundException('Article not found');
    }

    if (article.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own articles');
    }

    await this.prisma.newsArticle.update({
      where: { id },
      data: { isDeleted: true },
    });

    return { message: 'Article deleted' };
  }

  async toggleLike(articleId: string, userId: string) {
    const article = await this.prisma.newsArticle.findUnique({
      where: { id: articleId },
    });

    if (!article || article.isDeleted) {
      throw new NotFoundException('Article not found');
    }

    const existing = await this.prisma.newsLike.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });

    if (existing) {
      await this.prisma.newsLike.delete({
        where: { id: existing.id },
      });
      return { liked: false };
    }

    await this.prisma.newsLike.create({
      data: { userId, articleId },
    });
    return { liked: true };
  }

  async addComment(articleId: string, authorId: string, content: string) {
    const article = await this.prisma.newsArticle.findUnique({
      where: { id: articleId },
    });

    if (!article || article.isDeleted) {
      throw new NotFoundException('Article not found');
    }

    return this.prisma.newsComment.create({
      data: { content, authorId, articleId },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, role: true },
        },
      },
    });
  }

  async getComments(articleId: string, cursor?: string) {
    return this.prisma.newsComment.findMany({
      where: { articleId },
      take: 20,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, role: true },
        },
      },
    });
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.prisma.newsComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.prisma.newsComment.delete({ where: { id: commentId } });
    return { message: 'Comment deleted' };
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 100);
  }
}
