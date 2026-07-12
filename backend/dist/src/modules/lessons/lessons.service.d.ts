import { PrismaService } from '../../database/prisma.service';
export declare class LessonsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(authorId: string, data: {
        title: string;
        content?: string;
        courseId: string;
        videoUrl?: string;
        pdfUrl?: string;
        duration?: number;
        order?: number;
    }): Promise<{
        course: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        title: string;
        isPublished: boolean;
        courseId: string;
        authorId: string;
        content: string | null;
        pdfUrl: string | null;
        order: number;
        videoUrl: string | null;
        duration: number | null;
    }>;
    findAll(): Promise<({
        course: {
            id: string;
            title: string;
        };
        author: {
            id: string;
            name: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        title: string;
        isPublished: boolean;
        courseId: string;
        authorId: string;
        content: string | null;
        pdfUrl: string | null;
        order: number;
        videoUrl: string | null;
        duration: number | null;
    })[]>;
    findById(id: string): Promise<({
        course: {
            id: string;
            title: string;
        };
        author: {
            id: string;
            name: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        title: string;
        isPublished: boolean;
        courseId: string;
        authorId: string;
        content: string | null;
        pdfUrl: string | null;
        order: number;
        videoUrl: string | null;
        duration: number | null;
    }) | null>;
    findByCourseId(courseId: string): Promise<({
        author: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        title: string;
        isPublished: boolean;
        courseId: string;
        authorId: string;
        content: string | null;
        pdfUrl: string | null;
        order: number;
        videoUrl: string | null;
        duration: number | null;
    })[]>;
    update(id: string, userId: string, data: {
        title?: string;
        content?: string;
        videoUrl?: string;
        pdfUrl?: string;
        duration?: number;
        order?: number;
        isPublished?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        isPublished: boolean;
        courseId: string;
        authorId: string;
        content: string | null;
        pdfUrl: string | null;
        order: number;
        videoUrl: string | null;
        duration: number | null;
    }>;
    delete(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        isPublished: boolean;
        courseId: string;
        authorId: string;
        content: string | null;
        pdfUrl: string | null;
        order: number;
        videoUrl: string | null;
        duration: number | null;
    }>;
}
