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
    grade(id: string, userId: string, data: {
        score: number;
        feedback?: string;
    }): Promise<{
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
