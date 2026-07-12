"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SearchProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
const search_service_1 = require("../search.service");
const search_indexes_1 = require("../indexes/search-indexes");
let SearchProcessor = SearchProcessor_1 = class SearchProcessor extends bullmq_1.WorkerHost {
    prisma;
    searchService;
    logger = new common_1.Logger(SearchProcessor_1.name);
    constructor(prisma, searchService) {
        super();
        this.prisma = prisma;
        this.searchService = searchService;
    }
    async process(job) {
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
    async indexAll() {
        this.logger.log('Starting full re-indexing...');
        for (const key of Object.keys(search_indexes_1.SEARCH_INDEXES)) {
            await this.indexEntityType(key);
        }
        this.logger.log('Full re-indexing complete');
    }
    async indexEntityType(entityType) {
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
    async indexUsers(batchSize) {
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
    async indexPosts(batchSize) {
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
    async indexCourses(batchSize) {
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
    async indexGroups(batchSize) {
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
    async indexMarketplace(batchSize) {
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
    async indexDocuments(batchSize) {
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
    async indexLessons(batchSize) {
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
    async updateDocument(entityType, document) {
        await this.searchService.updateDocuments(entityType, [document]);
    }
    async deleteDocument(entityType, documentId) {
        await this.searchService.deleteDocument(entityType, documentId);
    }
    async deleteDocuments(entityType, documentIds) {
        await this.searchService.deleteDocuments(entityType, documentIds);
    }
};
exports.SearchProcessor = SearchProcessor;
exports.SearchProcessor = SearchProcessor = SearchProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('search-indexing', {
        concurrency: 2,
    }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        search_service_1.SearchService])
], SearchProcessor);
//# sourceMappingURL=search.processor.js.map