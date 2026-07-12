import { PrismaService } from '../../database/prisma.service';
export declare class ExamsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(authorId: string, data: {
        title: string;
        description?: string;
        courseId: string;
        timeLimit: number;
        dueDate: string;
        questions?: any;
    }): Promise<{
        course: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        description: string | null;
        title: string;
        dueDate: Date;
        courseId: string;
        authorId: string;
        timeLimit: number;
        questions: import("@prisma/client/runtime/client").JsonValue;
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
        description: string | null;
        title: string;
        dueDate: Date;
        courseId: string;
        authorId: string;
        timeLimit: number;
        questions: import("@prisma/client/runtime/client").JsonValue;
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
        description: string | null;
        title: string;
        dueDate: Date;
        courseId: string;
        authorId: string;
        timeLimit: number;
        questions: import("@prisma/client/runtime/client").JsonValue;
    }) | null>;
    findByCourseId(courseId: string): Promise<({
        author: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        description: string | null;
        title: string;
        dueDate: Date;
        courseId: string;
        authorId: string;
        timeLimit: number;
        questions: import("@prisma/client/runtime/client").JsonValue;
    })[]>;
    update(id: string, userId: string, data: {
        title?: string;
        description?: string;
        timeLimit?: number;
        dueDate?: string;
        questions?: any;
    }): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        title: string;
        dueDate: Date;
        courseId: string;
        authorId: string;
        timeLimit: number;
        questions: import("@prisma/client/runtime/client").JsonValue;
    }>;
    delete(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        title: string;
        dueDate: Date;
        courseId: string;
        authorId: string;
        timeLimit: number;
        questions: import("@prisma/client/runtime/client").JsonValue;
    }>;
}
