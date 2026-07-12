import { CalendarService } from './calendar.service';
declare class CreateCalendarEventDto {
    title: string;
    date: string;
    startTime: string;
    description?: string;
    endTime?: string;
    type?: string;
    color?: string;
    courseId?: string;
}
declare class UpdateCalendarEventDto {
    title?: string;
    description?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    type?: string;
    color?: string;
}
export declare class CalendarController {
    private readonly calendarService;
    constructor(calendarService: CalendarService);
    create(userId: string, dto: CreateCalendarEventDto): Promise<{
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
    update(id: string, userId: string, dto: UpdateCalendarEventDto): Promise<{
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
export {};
