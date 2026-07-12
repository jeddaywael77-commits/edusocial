import { LessonsService } from './lessons.service';
declare class CreateLessonDto {
    title: string;
    courseId: string;
    content?: string;
    videoUrl?: string;
    pdfUrl?: string;
    duration?: number;
    order?: number;
}
declare class UpdateLessonDto {
    title?: string;
    content?: string;
    videoUrl?: string;
    pdfUrl?: string;
    duration?: number;
    order?: number;
    isPublished?: boolean;
}
export declare class LessonsController {
    private readonly lessonsService;
    constructor(lessonsService: LessonsService);
    create(userId: string, dto: CreateLessonDto): Promise<{
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
    update(id: string, userId: string, dto: UpdateLessonDto): Promise<{
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
export {};
