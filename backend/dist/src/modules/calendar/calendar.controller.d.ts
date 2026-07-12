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
    update(id: string, userId: string, dto: UpdateCalendarEventDto): Promise<{
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
export {};
