import { PrismaService } from '../../database/prisma.service';
export declare class CoursesService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(teacherId: string, data: {
        title: string;
        description?: string;
        category: string;
        level?: string;
        thumbnail?: string;
    }): Promise<{
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
    update(id: string, userId: string, data: {
        title?: string;
        description?: string;
        thumbnail?: string;
        isPublished?: boolean;
    }): Promise<{
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
    enroll(courseId: string, userId: string): Promise<{
        id: string;
        userId: string;
        courseId: string;
        progress: number;
        enrolledAt: Date;
    }>;
    getEnrollments(courseId: string): Promise<({
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
