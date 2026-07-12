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
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateExamDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() courseId: string;
  @ApiProperty() @IsNumber() timeLimit: number;
  @ApiProperty() @IsString() dueDate: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({ required: false }) @IsOptional() questions?: any;
}

class UpdateExamDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() title?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  timeLimit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() dueDate?: string;
  @ApiProperty({ required: false }) @IsOptional() questions?: any;
}

@ApiTags('Exams')
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an exam' })
  async create(@CurrentUser('sub') userId: string, @Body() dto: CreateExamDto) {
    return this.examsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exams' })
  async findAll() {
    return this.examsService.findAll();
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get exams by course' })
  async findByCourseId(@Param('courseId') courseId: string) {
    return this.examsService.findByCourseId(courseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exam by ID' })
  async findById(@Param('id') id: string) {
    return this.examsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update an exam' })
  async update(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateExamDto,
  ) {
    return this.examsService.update(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete an exam' })
  async delete(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.examsService.delete(id, userId);
  }
}
