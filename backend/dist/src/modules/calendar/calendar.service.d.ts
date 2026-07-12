import { PrismaService } from '../../database/prisma.service';
export declare class CalendarService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(userId: string, data: {
        title: string;
        description?: string;
        date: string;
        startTime: string;
        endTime?: string;
        type?: string;
        color?: string;
        courseId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        type: import("@prisma/client").$Enums.CalendarEventType;
        title: string;
        courseId: string | null;
        color: string;
        userId: string;
        endTime: Date | null;
        date: Date;
        startTime: Date;
    }>;
    findAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        type: import("@prisma/client").$Enums.CalendarEventType;
        title: string;
        courseId: string | null;
        color: string;
        userId: string;
        endTime: Date | null;
        date: Date;
        startTime: Date;
    }[]>;
    findById(id: string): Promise<({
        course: {
            id: string;
            title: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        description: string | null;
        type: import("@prisma/client").$Enums.CalendarEventType;
        title: string;
        courseId: string | null;
        color: string;
        userId: string;
        endTime: Date | null;
        date: Date;
        startTime: Date;
    }) | null>;
    findByDateRange(userId: string, start: string, end: string): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        type: import("@prisma/client").$Enums.CalendarEventType;
        title: string;
        courseId: string | null;
        color: string;
        userId: string;
        endTime: Date | null;
        date: Date;
        startTime: Date;
    }[]>;
    update(id: string, userId: string, data: {
        title?: string;
        description?: string;
        date?: string;
        startTime?: string;
        endTime?: string;
        type?: string;
        color?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        type: import("@prisma/client").$Enums.CalendarEventType;
        title: string;
        courseId: string | null;
        color: string;
        userId: string;
        endTime: Date | null;
        date: Date;
        startTime: Date;
    }>;
    delete(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        type: import("@prisma/client").$Enums.CalendarEventType;
        title: string;
        courseId: string | null;
        color: string;
        userId: string;
        endTime: Date | null;
        date: Date;
        startTime: Date;
    }>;
}
