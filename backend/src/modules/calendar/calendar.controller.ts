import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateCalendarEventDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() date: string;
  @ApiProperty() @IsString() startTime: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() endTime?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() type?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() color?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() courseId?: string;
}

class UpdateCalendarEventDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() title?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() date?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() startTime?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() endTime?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() type?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() color?: string;
}

@ApiTags('Calendar')
@Controller('calendar')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a calendar event' })
  async create(@CurrentUser('sub') userId: string, @Body() dto: CreateCalendarEventDto) {
    return this.calendarService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get my calendar events' })
  async findAll(@CurrentUser('sub') userId: string) {
    return this.calendarService.findAll(userId);
  }

  @Get('range')
  @ApiOperation({ summary: 'Get events by date range' })
  @ApiQuery({ name: 'start', required: true })
  @ApiQuery({ name: 'end', required: true })
  async findByDateRange(
    @CurrentUser('sub') userId: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.calendarService.findByDateRange(userId, start, end);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  async findById(@Param('id') id: string) {
    return this.calendarService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a calendar event' })
  async update(@Param('id') id: string, @CurrentUser('sub') userId: string, @Body() dto: UpdateCalendarEventDto) {
    return this.calendarService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a calendar event' })
  async delete(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.calendarService.delete(id, userId);
  }
}
