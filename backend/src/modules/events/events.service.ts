import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private prisma: PrismaService) {}

  async create(creatorId: string, dto: CreateEventDto) {
    const event = await this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        coverImage: dto.coverImage,
        date: new Date(dto.date),
        startTime: new Date(dto.startTime),
        endTime: dto.endTime ? new Date(dto.endTime) : null,
        location: dto.location,
        maxAttendees: dto.maxAttendees,
        isPublic: dto.isPublic ?? true,
        type: dto.type || 'social',
        creatorId,
      },
      include: {
        creator: {
          select: { id: true, name: true, avatar: true, role: true },
        },
        _count: { select: { attendees: true } },
      },
    });

    this.logger.log(`Event created: ${event.id}`);
    return event;
  }

  async findAll(userId?: string, query?: { cursor?: string; limit?: number; upcoming?: boolean }) {
    const limit = Math.min(50, Math.max(1, query?.limit || 20));

    const where: Prisma.EventWhereInput = {
      isPublic: true,
      ...(query?.upcoming && { date: { gte: new Date() } }),
    };

    const events = await this.prisma.event.findMany({
      where,
      take: limit,
      ...(query?.cursor && { skip: 1, cursor: { id: query.cursor } }),
      orderBy: { date: 'asc' },
      include: {
        creator: {
          select: { id: true, name: true, avatar: true, role: true },
        },
        _count: { select: { attendees: true } },
        ...(userId && {
          attendees: { where: { userId }, select: { id: true, status: true } },
        }),
      },
    });

    return {
      data: events.map((e) => ({
        ...e,
        isAttending: userId ? (e as any).attendees?.length > 0 : false,
        attendanceStatus: userId ? (e as any).attendees?.[0]?.status || null : null,
        attendees: undefined,
      })),
      nextCursor: events.length === limit ? events[events.length - 1].id : null,
    };
  }

  async findById(id: string, userId?: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, avatar: true, role: true },
        },
        _count: { select: { attendees: true } },
        ...(userId && {
          attendees: { where: { userId }, select: { id: true, status: true } },
        }),
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return {
      ...event,
      isAttending: userId ? (event as any).attendees?.length > 0 : false,
      attendanceStatus: userId ? (event as any).attendees?.[0]?.status || null : null,
      attendees: undefined,
    };
  }

  async update(id: string, userId: string, dto: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.creatorId !== userId) {
      throw new ForbiddenException('You can only update your own events');
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.coverImage !== undefined && { coverImage: dto.coverImage }),
        ...(dto.date && { date: new Date(dto.date) }),
        ...(dto.startTime && { startTime: new Date(dto.startTime) }),
        ...(dto.endTime !== undefined && { endTime: dto.endTime ? new Date(dto.endTime) : null }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.maxAttendees !== undefined && { maxAttendees: dto.maxAttendees }),
        ...(dto.isPublic !== undefined && { isPublic: dto.isPublic }),
        ...(dto.type && { type: dto.type }),
      },
      include: {
        creator: {
          select: { id: true, name: true, avatar: true, role: true },
        },
        _count: { select: { attendees: true } },
      },
    });
  }

  async delete(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.creatorId !== userId) {
      throw new ForbiddenException('You can only delete your own events');
    }

    await this.prisma.event.delete({ where: { id } });
    return { message: 'Event deleted' };
  }

  async toggleAttendance(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { attendees: true } } },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const existing = await this.prisma.eventAttendee.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });

    if (existing) {
      await this.prisma.eventAttendee.delete({ where: { id: existing.id } });
      return { attending: false };
    }

    if (event.maxAttendees && event._count.attendees >= event.maxAttendees) {
      throw new ForbiddenException('Event is full');
    }

    await this.prisma.eventAttendee.create({
      data: { eventId, userId, status: 'going' },
    });
    return { attending: true };
  }

  async cancelAttendance(eventId: string, userId: string) {
    const existing = await this.prisma.eventAttendee.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });

    if (!existing) {
      throw new NotFoundException('You are not attending this event');
    }

    await this.prisma.eventAttendee.delete({ where: { id: existing.id } });
    return { message: 'Attendance cancelled' };
  }

  async getAttendees(eventId: string) {
    return this.prisma.eventAttendee.findMany({
      where: { eventId },
      include: {
        user: {
          select: { id: true, name: true, avatar: true, role: true, level: true },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });
  }
}
