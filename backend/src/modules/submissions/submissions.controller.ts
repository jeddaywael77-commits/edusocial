import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateSubmissionDto {
  @ApiProperty() @IsString() assignmentId: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() content?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() fileUrl?: string;
}

class GradeSubmissionDto {
  @ApiProperty() @IsNumber() score: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() feedback?: string;
}

@ApiTags('Submissions')
@Controller('submissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit an assignment' })
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateSubmissionDto,
  ) {
    return this.submissionsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all submissions' })
  async findAll() {
    return this.submissionsService.findAll();
  }

  @Get('assignment/:assignmentId')
  @ApiOperation({ summary: 'Get submissions by assignment' })
  async findByAssignmentId(@Param('assignmentId') assignmentId: string) {
    return this.submissionsService.findByAssignmentId(assignmentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get submission by ID' })
  async findById(@Param('id') id: string) {
    return this.submissionsService.findById(id);
  }

  @Patch(':id/grade')
  @ApiOperation({ summary: 'Grade a submission' })
  async grade(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: GradeSubmissionDto,
  ) {
    return this.submissionsService.grade(id, userId, dto);
  }
}
