import { CoursesService } from './courses.service';
declare class CreateCourseDto {
    title: string;
    description?: string;
    category: string;
    level?: string;
    thumbnail?: string;
}
declare class UpdateCourseDto {
    title?: string;
    description?: string;
    thumbnail?: string;
    isPublished?: boolean;
}
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    create(userId: string, dto: CreateCourseDto): Promise<{
        teacher: {
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        level: import("@prisma/client").$Enums.CourseLevel;
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        thumbnail: string | null;
        category: string;
        teacherId: string;
        isPublished: boolean;
    }>;
    findAll(): Promise<({
        _count: {
            lessons: number;
            assignments: number;
            enrollments: number;
        };
        teacher: {
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        level: import("@prisma/client").$Enums.CourseLevel;
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        thumbnail: string | null;
        category: string;
        teacherId: string;
        isPublished: boolean;
    })[]>;
    findById(id: string): Promise<({
        lessons: {
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
        }[];
        _count: {
            enrollments: number;
        };
        teacher: {
            name: string;
            id: string;
            avatar: string | null;
        };
        assignments: {
            description: string | null;
            title: string;
            id: string;
            createdAt: Date;
            courseId: string | null;
            authorId: string;
            dueDate: Date;
            maxScore: number;
        }[];
    } & {
        level: import("@prisma/client").$Enums.CourseLevel;
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        thumbnail: string | null;
        category: string;
        teacherId: string;
        isPublished: boolean;
    }) | null>;
    update(id: string, userId: string, dto: UpdateCourseDto): Promise<{
        level: import("@prisma/client").$Enums.CourseLevel;
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        thumbnail: string | null;
        category: string;
        teacherId: string;
        isPublished: boolean;
    }>;
    delete(id: string, userId: string): Promise<{
        level: import("@prisma/client").$Enums.CourseLevel;
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        thumbnail: string | null;
        category: string;
        teacherId: string;
        isPublished: boolean;
    }>;
    enroll(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        courseId: string;
        progress: number;
        enrolledAt: Date;
    }>;
    getEnrollments(id: string): Promise<({
        user: {
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        id: string;
        userId: string;
        courseId: string;
        progress: number;
        enrolledAt: Date;
    })[]>;
}
export {};
