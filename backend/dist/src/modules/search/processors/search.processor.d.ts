import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { SearchService } from '../search.service';
import { SearchIndexName } from '../indexes/search-indexes';
export declare class SearchProcessor extends WorkerHost {
    private readonly prisma;
    private readonly searchService;
    private readonly logger;
    constructor(prisma: PrismaService, searchService: SearchService);
    process(job: Job<any, any, string>): Promise<any>;
    indexAll(): Promise<void>;
    indexEntityType(entityType: SearchIndexName): Promise<void>;
    private indexUsers;
    private indexPosts;
    private indexCourses;
    private indexGroups;
    private indexMarketplace;
    private indexDocuments;
    private indexLessons;
    private updateDocument;
    private deleteDocument;
    private deleteDocuments;
}
