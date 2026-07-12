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
            title: string;
            id: string;
        };
    } & {
        title: string;
        id: string;
        createdAt: Date;
        content: string | null;
        pdfUrl: string | null;
        courseId: string;
        authorId: string;
        isPublished: boolean;
        order: number;
        videoUrl: string | null;
        duration: number | null;
    }>;
    findAll(): Promise<({
        course: {
            title: string;
            id: string;
        };
        author: {
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        title: string;
        id: string;
        createdAt: Date;
        content: string | null;
        pdfUrl: string | null;
        courseId: string;
        authorId: string;
        isPublished: boolean;
        order: number;
        videoUrl: string | null;
        duration: number | null;
    })[]>;
    findById(id: string): Promise<({
        course: {
            title: string;
            id: string;
        };
        author: {
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        title: string;
        id: string;
        createdAt: Date;
        content: string | null;
        pdfUrl: string | null;
        courseId: string;
        authorId: string;
        isPublished: boolean;
        order: number;
        videoUrl: string | null;
        duration: number | null;
    }) | null>;
    findByCourseId(courseId: string): Promise<({
        author: {
            name: string;
            id: string;
        };
    } & {
        title: string;
        id: string;
        createdAt: Date;
        content: string | null;
        pdfUrl: string | null;
        courseId: string;
        authorId: string;
        isPublished: boolean;
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
        title: string;
        id: string;
        createdAt: Date;
        content: string | null;
        pdfUrl: string | null;
        courseId: string;
        authorId: string;
        isPublished: boolean;
        order: number;
        videoUrl: string | null;
        duration: number | null;
    }>;
    delete(id: string, userId: string): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        content: string | null;
        pdfUrl: string | null;
        courseId: string;
        authorId: string;
        isPublished: boolean;
        order: number;
        videoUrl: string | null;
        duration: number | null;
    }>;
}
