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
        type: import("@prisma/client").$Enums.CalendarEventType;
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        userId: string;
        color: string;
        courseId: string | null;
        date: Date;
        startTime: Date;
        endTime: Date | null;
    }>;
    findAll(userId: string): Promise<{
        type: import("@prisma/client").$Enums.CalendarEventType;
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        userId: string;
        color: string;
        courseId: string | null;
        date: Date;
        startTime: Date;
        endTime: Date | null;
    }[]>;
    findById(id: string): Promise<({
        course: {
            title: string;
            id: string;
        } | null;
    } & {
        type: import("@prisma/client").$Enums.CalendarEventType;
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        userId: string;
        color: string;
        courseId: string | null;
        date: Date;
        startTime: Date;
        endTime: Date | null;
    }) | null>;
    findByDateRange(userId: string, start: string, end: string): Promise<{
        type: import("@prisma/client").$Enums.CalendarEventType;
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        userId: string;
        color: string;
        courseId: string | null;
        date: Date;
        startTime: Date;
        endTime: Date | null;
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
        type: import("@prisma/client").$Enums.CalendarEventType;
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        userId: string;
        color: string;
        courseId: string | null;
        date: Date;
        startTime: Date;
        endTime: Date | null;
    }>;
    delete(id: string, userId: string): Promise<{
        type: import("@prisma/client").$Enums.CalendarEventType;
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        userId: string;
        color: string;
        courseId: string | null;
        date: Date;
        startTime: Date;
        endTime: Date | null;
    }>;
}
