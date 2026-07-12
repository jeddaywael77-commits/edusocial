import { ExamsService } from './exams.service';
declare class CreateExamDto {
    title: string;
    courseId: string;
    timeLimit: number;
    dueDate: string;
    description?: string;
    questions?: any;
}
declare class UpdateExamDto {
    title?: string;
    description?: string;
    timeLimit?: number;
    dueDate?: string;
    questions?: any;
}
export declare class ExamsController {
    private readonly examsService;
    constructor(examsService: ExamsService);
    create(userId: string, dto: CreateExamDto): Promise<{
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
    update(id: string, userId: string, dto: UpdateExamDto): Promise<{
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
export {};
