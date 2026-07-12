import { PrismaService } from '../../database/prisma.service';
export declare class SubmissionsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(studentId: string, data: {
        assignmentId: string;
        content?: string;
        fileUrl?: string;
    }): Promise<{
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
    grade(id: string, userId: string, data: {
        score: number;
        feedback?: string;
    }): Promise<{
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
