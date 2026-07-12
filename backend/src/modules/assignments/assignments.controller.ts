import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateAssignmentDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() dueDate: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() maxScore?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() courseId?: string;
}

class UpdateAssignmentDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() title?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() dueDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() maxScore?: number;
}

@ApiTags('Assignments')
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an assignment' })
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateAssignmentDto,
  ) {
    return this.assignmentsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assignments' })
  async findAll() {
    return this.assignmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assignment by ID' })
  async findById(@Param('id') id: string) {
    return this.assignmentsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update an assignment' })
  async update(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateAssignmentDto,
  ) {
    return this.assignmentsService.update(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete an assignment' })
  async delete(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.assignmentsService.delete(id, userId);
  }
}
