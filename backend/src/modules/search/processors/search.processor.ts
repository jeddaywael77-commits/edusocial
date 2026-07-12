import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { SearchService } from '../search.service';
import { SEARCH_INDEXES, SearchIndexName } from '../indexes/search-indexes';

@Processor('search-indexing', {
  concurrency: 2,
})
export class SearchProcessor extends WorkerHost {
  private readonly logger = new Logger(SearchProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly searchService: SearchService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'index-all':
        return this.indexAll();
      case 'index-entity':
        return this.indexEntityType(job.data.entityType);
      case 'update-document':
        return this.updateDocument(job.data.entityType, job.data.document);
      case 'delete-document':
        return this.deleteDocument(job.data.entityType, job.data.documentId);
      case 'delete-documents':
        return this.deleteDocuments(job.data.entityType, job.data.documentIds);
      default:
        this.logger.warn(`Unknown job: ${job.name}`);
    }
  }

  async indexAll(): Promise<void> {
    this.logger.log('Starting full re-indexing...');
    for (const key of Object.keys(SEARCH_INDEXES) as SearchIndexName[]) {
      await this.indexEntityType(key);
    }
    this.logger.log('Full re-indexing complete');
  }

  async indexEntityType(entityType: SearchIndexName): Promise<void> {
    this.logger.log(`Indexing entity: ${entityType}`);
    const batchSize = 500;

    switch (entityType) {
      case 'users':
        await this.indexUsers(batchSize);
        break;
      case 'posts':
        await this.indexPosts(batchSize);
        break;
      case 'courses':
        await this.indexCourses(batchSize);
        break;
      case 'groups':
        await this.indexGroups(batchSize);
        break;
      case 'marketplace':
        await this.indexMarketplace(batchSize);
        break;
      case 'documents':
        await this.indexDocuments(batchSize);
        break;
      case 'lessons':
        await this.indexLessons(batchSize);
        break;
    }
  }

  private async indexUsers(batchSize: number): Promise<void> {
    let skip = 0;
    let hasMore = true;

    while (hasMore) {
      const users = await this.prisma.user.findMany({
        skip,
        take: batchSize,
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          school: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          _count: { select: { followers: true } },
        },
      });

      if (users.length === 0) {
        hasMore = false;
        break;
      }

      const documents = users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        bio: u.bio || '',
        school: u.school || '',
        role: u.role,
        isVerified: u.emailVerified,
        createdAt: u.createdAt.toISOString(),
        followersCount: u._count.followers,
      }));

      await this.searchService.addDocuments('users', documents);
      skip += batchSize;
    }
  }

  private async indexPosts(batchSize: number): Promise<void> {
    let skip = 0;
    let hasMore = true;

    while (hasMore) {
      const posts = await this.prisma.post.findMany({
        skip,
        take: batchSize,
        select: {
          id: true,
          content: true,
          visibility: true,
          createdAt: true,
          authorId: true,
          author: {
            select: { id: true, name: true },
          },
          _count: { select: { reactions: true, comments: true } },
        },
      });

      if (posts.length === 0) {
        hasMore = false;
        break;
      }

      const documents = posts.map((p) => ({
        id: p.id,
        content: p.content,
        authorId: p.author.id,
        authorName: p.author.name,
        visibility: p.visibility,
        hasMedia: false,
        createdAt: p.createdAt.toISOString(),
        likesCount: p._count.reactions,
        commentsCount: p._count.comments,
      }));

      await this.searchService.addDocuments('posts', documents);
      skip += batchSize;
    }
  }

  private async indexCourses(batchSize: number): Promise<void> {
    let skip = 0;
    let hasMore = true;

    while (hasMore) {
      const courses = await this.prisma.course.findMany({
        skip,
        take: batchSize,
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          level: true,
          isPublished: true,
          createdAt: true,
          teacher: {
            select: { id: true, name: true },
          },
          _count: { select: { enrollments: true } },
        },
      });

      if (courses.length === 0) {
        hasMore = false;
        break;
      }

      const documents = courses.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description || '',
        category: c.category,
        level: c.level,
        isPublished: c.isPublished,
        teacherId: c.teacher.id,
        teacherName: c.teacher.name,
        createdAt: c.createdAt.toISOString(),
        enrolledCount: c._count.enrollments,
        rating: 0,
      }));

      await this.searchService.addDocuments('courses', documents);
      skip += batchSize;
    }
  }

  private async indexGroups(batchSize: number): Promise<void> {
    let skip = 0;
    let hasMore = true;

    while (hasMore) {
      const groups = await this.prisma.group.findMany({
        skip,
        take: batchSize,
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          isPublic: true,
          createdAt: true,
          admin: {
            select: { id: true },
          },
          _count: { select: { members: true } },
        },
      });

      if (groups.length === 0) {
        hasMore = false;
        break;
      }

      const documents = groups.map((g) => ({
        id: g.id,
        name: g.name,
        description: g.description || '',
        category: g.type,
        privacy: g.isPublic ? 'PUBLIC' : 'PRIVATE',
        creatorId: g.admin.id,
        createdAt: g.createdAt.toISOString(),
        membersCount: g._count.members,
      }));

      await this.searchService.addDocuments('groups', documents);
      skip += batchSize;
    }
  }

  private async indexMarketplace(batchSize: number): Promise<void> {
    let skip = 0;
    let hasMore = true;

    while (hasMore) {
      const items = await this.prisma.marketplaceItem.findMany({
        skip,
        take: batchSize,
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          condition: true,
          isAvailable: true,
          price: true,
          createdAt: true,
          seller: {
            select: { id: true, name: true },
          },
        },
      });

      if (items.length === 0) {
        hasMore = false;
        break;
      }

      const documents = items.map((i) => ({
        id: i.id,
        title: i.title,
        description: i.description || '',
        category: i.category,
        condition: i.condition,
        isAvailable: i.isAvailable,
        sellerId: i.seller.id,
        price: i.price,
        createdAt: i.createdAt.toISOString(),
        viewsCount: 0,
      }));

      await this.searchService.addDocuments('marketplace', documents);
      skip += batchSize;
    }
  }

  private async indexDocuments(batchSize: number): Promise<void> {
    let skip = 0;
    let hasMore = true;

    while (hasMore) {
      const docs = await this.prisma.document.findMany({
        skip,
        take: batchSize,
        select: {
          id: true,
          name: true,
          type: true,
          tags: true,
          createdAt: true,
          uploadedBy: {
            select: { id: true, name: true },
          },
        },
      });

      if (docs.length === 0) {
        hasMore = false;
        break;
      }

      const documents = docs.map((d) => ({
        id: d.id,
        name: d.name,
        description: d.type,
        category: d.type,
        tags: d.tags.join(', '),
        visibility: 'PUBLIC',
        ownerId: d.uploadedBy.id,
        createdAt: d.createdAt.toISOString(),
        downloadsCount: 0,
        viewsCount: 0,
      }));

      await this.searchService.addDocuments('documents', documents);
      skip += batchSize;
    }
  }

  private async indexLessons(batchSize: number): Promise<void> {
    let skip = 0;
    let hasMore = true;

    while (hasMore) {
      const lessons = await this.prisma.lesson.findMany({
        skip,
        take: batchSize,
        select: {
          id: true,
          title: true,
          content: true,
          order: true,
          createdAt: true,
          courseId: true,
        },
      });

      if (lessons.length === 0) {
        hasMore = false;
        break;
      }

      const documents = lessons.map((l) => ({
        id: l.id,
        title: l.title,
        content: l.content || '',
        courseId: l.courseId,
        createdAt: l.createdAt.toISOString(),
        order: l.order,
      }));

      await this.searchService.addDocuments('lessons', documents);
      skip += batchSize;
    }
  }

  private async updateDocument(entityType: SearchIndexName, document: any): Promise<void> {
    await this.searchService.updateDocuments(entityType, [document]);
  }

  private async deleteDocument(entityType: SearchIndexName, documentId: string): Promise<void> {
    await this.searchService.deleteDocument(entityType, documentId);
  }

  private async deleteDocuments(entityType: SearchIndexName, documentIds: string[]): Promise<void> {
    await this.searchService.deleteDocuments(entityType, documentIds);
  }
}
