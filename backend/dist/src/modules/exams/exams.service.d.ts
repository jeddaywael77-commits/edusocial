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
            title: string;
            id: string;
        };
    } & {
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        courseId: string;
        authorId: string;
        dueDate: Date;
        timeLimit: number;
        questions: import("@prisma/client/runtime/client").JsonValue;
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
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        courseId: string;
        authorId: string;
        dueDate: Date;
        timeLimit: number;
        questions: import("@prisma/client/runtime/client").JsonValue;
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
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        courseId: string;
        authorId: string;
        dueDate: Date;
        timeLimit: number;
        questions: import("@prisma/client/runtime/client").JsonValue;
    }) | null>;
    findByCourseId(courseId: string): Promise<({
        author: {
            name: string;
            id: string;
        };
    } & {
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        courseId: string;
        authorId: string;
        dueDate: Date;
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
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        courseId: string;
        authorId: string;
        dueDate: Date;
        timeLimit: number;
        questions: import("@prisma/client/runtime/client").JsonValue;
    }>;
    delete(id: string, userId: string): Promise<{
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        courseId: string;
        authorId: string;
        dueDate: Date;
        timeLimit: number;
        questions: import("@prisma/client/runtime/client").JsonValue;
    }>;
}
