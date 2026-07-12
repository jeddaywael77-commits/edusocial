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
    findAll(): Promise<{
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
    update(id: string, userId: string, dto: UpdateCourseDto): Promise<{
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
    enroll(id: string, userId: string): Promise<{
        id: string;
        courseId: string;
        userId: string;
        progress: number;
        enrolledAt: Date;
    }>;
    getEnrollments(id: string): Promise<{
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
export {};
