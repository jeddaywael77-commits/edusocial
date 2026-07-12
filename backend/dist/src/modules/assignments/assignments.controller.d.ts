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
            id: string;
            title: string;
        } | null;
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
        maxScore: number;
        courseId: string | null;
        authorId: string;
    }>;
    findAll(): Promise<({
        course: {
            id: string;
            title: string;
        } | null;
        author: {
            id: string;
            name: string;
            avatar: string | null;
        };
        _count: {
            submissions: number;
        };
    } & {
        id: string;
        createdAt: Date;
        description: string | null;
        title: string;
        dueDate: Date;
        maxScore: number;
        courseId: string | null;
        authorId: string;
    })[]>;
    findById(id: string): Promise<({
        submissions: ({
            student: {
                id: string;
                name: string;
                avatar: string | null;
            };
        } & {
            id: string;
            content: string | null;
            fileUrl: string | null;
            score: number | null;
            feedback: string | null;
            status: import("@prisma/client").$Enums.SubmissionStatus;
            submittedAt: Date;
            gradedAt: Date | null;
            assignmentId: string;
            studentId: string;
        })[];
        course: {
            id: string;
            title: string;
        } | null;
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
        maxScore: number;
        courseId: string | null;
        authorId: string;
    }) | null>;
    update(id: string, userId: string, dto: UpdateAssignmentDto): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        title: string;
        dueDate: Date;
        maxScore: number;
        courseId: string | null;
        authorId: string;
    }>;
    delete(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        title: string;
        dueDate: Date;
        maxScore: number;
        courseId: string | null;
        authorId: string;
    }>;
}
export {};
