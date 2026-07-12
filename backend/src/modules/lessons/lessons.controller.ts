import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateLessonDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() courseId: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() content?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() videoUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() pdfUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() duration?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() order?: number;
}

class UpdateLessonDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() title?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() content?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() videoUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() pdfUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() duration?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() order?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() isPublished?: boolean;
}

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a lesson' })
  async create(@CurrentUser('sub') userId: string, @Body() dto: CreateLessonDto) {
    return this.lessonsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lessons' })
  async findAll() {
    return this.lessonsService.findAll();
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get lessons by course' })
  async findByCourseId(@Param('courseId') courseId: string) {
    return this.lessonsService.findByCourseId(courseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson by ID' })
  async findById(@Param('id') id: string) {
    return this.lessonsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a lesson' })
  async update(@Param('id') id: string, @CurrentUser('sub') userId: string, @Body() dto: UpdateLessonDto) {
    return this.lessonsService.update(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a lesson' })
  async delete(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.lessonsService.delete(id, userId);
  }
}
