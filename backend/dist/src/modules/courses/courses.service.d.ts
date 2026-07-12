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
            id: string;
            name: string;
            avatar: string | null;
        };
    } & {
        id: string;
        level: import("@prisma/client").$Enums.CourseLevel;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        thumbnail: string | null;
        category: string;
        isPublished: boolean;
        teacherId: string;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        data: ({
            teacher: {
                id: string;
                name: string;
                avatar: string | null;
            };
            _count: {
                lessons: number;
                assignments: number;
                enrollments: number;
            };
        } & {
            id: string;
            level: import("@prisma/client").$Enums.CourseLevel;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            thumbnail: string | null;
            category: string;
            isPublished: boolean;
            teacherId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findById(id: string): Promise<({
        lessons: {
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
        }[];
        teacher: {
            id: string;
            name: string;
            avatar: string | null;
        };
        assignments: {
            id: string;
            createdAt: Date;
            description: string | null;
            title: string;
            dueDate: Date;
            maxScore: number;
            courseId: string | null;
            authorId: string;
        }[];
        _count: {
            enrollments: number;
        };
    } & {
        id: string;
        level: import("@prisma/client").$Enums.CourseLevel;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        thumbnail: string | null;
        category: string;
        isPublished: boolean;
        teacherId: string;
    }) | null>;
    update(id: string, userId: string, data: {
        title?: string;
        description?: string;
        thumbnail?: string;
        isPublished?: boolean;
    }): Promise<{
        id: string;
        level: import("@prisma/client").$Enums.CourseLevel;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        thumbnail: string | null;
        category: string;
        isPublished: boolean;
        teacherId: string;
    }>;
    delete(id: string, userId: string): Promise<{
        id: string;
        level: import("@prisma/client").$Enums.CourseLevel;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        thumbnail: string | null;
        category: string;
        isPublished: boolean;
        teacherId: string;
    }>;
    enroll(courseId: string, userId: string): Promise<{
        id: string;
        courseId: string;
        userId: string;
        progress: number;
        enrolledAt: Date;
    }>;
    getEnrollments(courseId: string, page?: number, limit?: number): Promise<{
        data: ({
            user: {
                id: string;
                name: string;
                avatar: string | null;
            };
        } & {
            id: string;
            courseId: string;
            userId: string;
            progress: number;
            enrolledAt: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
