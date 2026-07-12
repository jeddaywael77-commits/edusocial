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
    update(id: string, userId: string, dto: UpdateExamDto): Promise<{
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
export {};
