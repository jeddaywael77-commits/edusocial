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
    update(id: string, userId: string, dto: UpdateLessonDto): Promise<{
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
export {};
