import { AssignmentsService } from './assignments.service';
declare class CreateAssignmentDto {
    title: string;
    dueDate: string;
    description?: string;
    maxScore?: number;
    courseId?: string;
}
declare class UpdateAssignmentDto {
    title?: string;
    description?: string;
    dueDate?: string;
    maxScore?: number;
}
export declare class AssignmentsController {
    private readonly assignmentsService;
    constructor(assignmentsService: AssignmentsService);
    create(userId: string, dto: CreateAssignmentDto): Promise<{
        course: {
            title: string;
            id: string;
        } | null;
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
        courseId: string | null;
        authorId: string;
        dueDate: Date;
        maxScore: number;
    }>;
    findAll(): Promise<({
        course: {
            title: string;
            id: string;
        } | null;
        _count: {
            submissions: number;
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
        courseId: string | null;
        authorId: string;
        dueDate: Date;
        maxScore: number;
    })[]>;
    findById(id: string): Promise<({
        course: {
            title: string;
            id: string;
        } | null;
        submissions: ({
            student: {
                name: string;
                id: string;
                avatar: string | null;
            };
        } & {
            id: string;
            content: string | null;
            status: import("@prisma/client").$Enums.SubmissionStatus;
            fileUrl: string | null;
            score: number | null;
            feedback: string | null;
            assignmentId: string;
            studentId: string;
            submittedAt: Date;
            gradedAt: Date | null;
        })[];
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
        courseId: string | null;
        authorId: string;
        dueDate: Date;
        maxScore: number;
    }) | null>;
    update(id: string, userId: string, dto: UpdateAssignmentDto): Promise<{
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        courseId: string | null;
        authorId: string;
        dueDate: Date;
        maxScore: number;
    }>;
    delete(id: string, userId: string): Promise<{
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        courseId: string | null;
        authorId: string;
        dueDate: Date;
        maxScore: number;
    }>;
}
export {};
