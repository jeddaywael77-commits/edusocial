import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new event' })
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateEventDto,
  ) {
    return this.eventsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all public events' })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'upcoming', required: false })
  async findAll(
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
    @Query('upcoming') upcoming?: string,
  ) {
    return this.eventsService.findAll(undefined, {
      cursor,
      limit,
      upcoming: upcoming === 'true',
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiParam({ name: 'id' })
  async findById(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an event' })
  @ApiParam({ name: 'id' })
  async update(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an event' })
  @ApiParam({ name: 'id' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.eventsService.delete(id, userId);
  }

  @Post(':id/attend')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle attendance at event' })
  @ApiParam({ name: 'id' })
  async toggleAttendance(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.eventsService.toggleAttendance(id, userId);
  }

  @Delete(':id/attend')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel attendance' })
  @ApiParam({ name: 'id' })
  async cancelAttendance(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.eventsService.cancelAttendance(id, userId);
  }

  @Get(':id/attendees')
  @ApiOperation({ summary: 'Get event attendees' })
  @ApiParam({ name: 'id' })
  async getAttendees(@Param('id') id: string) {
    return this.eventsService.getAttendees(id);
  }
}
