import { SubmissionsService } from './submissions.service';
declare class CreateSubmissionDto {
    assignmentId: string;
    content?: string;
    fileUrl?: string;
}
declare class GradeSubmissionDto {
    score: number;
    feedback?: string;
}
export declare class SubmissionsController {
    private readonly submissionsService;
    constructor(submissionsService: SubmissionsService);
    create(userId: string, dto: CreateSubmissionDto): Promise<{
        assignment: {
            title: string;
            id: string;
        };
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
    }>;
    findAll(): Promise<({
        assignment: {
            title: string;
            id: string;
        };
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
    })[]>;
    findByAssignmentId(assignmentId: string): Promise<({
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
    })[]>;
    findById(id: string): Promise<({
        assignment: {
            title: string;
            id: string;
            maxScore: number;
        };
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
    }) | null>;
    grade(id: string, userId: string, dto: GradeSubmissionDto): Promise<{
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
    }>;
}
export {};
