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
        image: string;
        text: string | null;
        expiresAt: Date;
    }>;
}
export {};
