import { PrismaService } from '../../database/prisma.service';
export declare class StoriesService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(authorId: string, data: {
        image: string;
        text?: string;
    }): Promise<{
        author: {
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        authorId: string;
        image: string;
        text: string | null;
        expiresAt: Date;
    }>;
    findAll(): Promise<({
        _count: {
            viewers: number;
        };
        author: {
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        authorId: string;
        image: string;
        text: string | null;
        expiresAt: Date;
    })[]>;
    findById(id: string): Promise<({
        author: {
            name: string;
            id: string;
            avatar: string | null;
        };
        viewers: ({
            user: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            userId: string;
            storyId: string;
            viewedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        authorId: string;
        image: string;
        text: string | null;
        expiresAt: Date;
    }) | null>;
    markAsViewed(storyId: string, userId: string): Promise<{
        id: string;
        userId: string;
        storyId: string;
        viewedAt: Date;
    }>;
    delete(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        authorId: string;
        image: string;
        text: string | null;
        expiresAt: Date;
    }>;
}
