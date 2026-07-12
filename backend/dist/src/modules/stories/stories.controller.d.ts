import { StoriesService } from './stories.service';
declare class CreateStoryDto {
    image: string;
    text?: string;
}
export declare class StoriesController {
    private readonly storiesService;
    constructor(storiesService: StoriesService);
    create(userId: string, dto: CreateStoryDto): Promise<{
        author: {
            id: string;
            name: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        authorId: string;
        text: string | null;
        image: string;
        expiresAt: Date;
    }>;
    findAll(): Promise<({
        author: {
            id: string;
            name: string;
            avatar: string | null;
        };
        _count: {
            viewers: number;
        };
    } & {
        id: string;
        createdAt: Date;
        authorId: string;
        text: string | null;
        image: string;
        expiresAt: Date;
    })[]>;
    findById(id: string): Promise<({
        author: {
            id: string;
            name: string;
            avatar: string | null;
        };
        viewers: ({
            user: {
                id: string;
                name: string;
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
        text: string | null;
        image: string;
        expiresAt: Date;
    }) | null>;
    markAsViewed(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        storyId: string;
        viewedAt: Date;
    }>;
    delete(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        authorId: string;
        text: string | null;
        image: string;
        expiresAt: Date;
    }>;
}
export {};
