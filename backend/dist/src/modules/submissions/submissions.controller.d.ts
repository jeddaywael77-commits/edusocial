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
            id: string;
            title: string;
        };
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
    }>;
    findAll(): Promise<({
        assignment: {
            id: string;
            title: string;
        };
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
    })[]>;
    findByAssignmentId(assignmentId: string): Promise<({
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
    })[]>;
    findById(id: string): Promise<({
        assignment: {
            id: string;
            title: string;
            maxScore: number;
        };
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
    }) | null>;
    grade(id: string, userId: string, dto: GradeSubmissionDto): Promise<{
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
    }>;
}
export {};
