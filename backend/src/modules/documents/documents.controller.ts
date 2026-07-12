import { Controller, Get, Post, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateDocumentDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() type: string;
  @ApiProperty() @IsNumber() size: number;
  @ApiProperty() @IsString() url: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() thumbnail?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsArray() tags?: string[];
}

@ApiTags('Documents')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload a document' })
  async create(@CurrentUser('sub') userId: string, @Body() dto: CreateDocumentDto) {
    return this.documentsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents' })
  async findAll() {
    return this.documentsService.findAll();
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my documents' })
  async findMine(@CurrentUser('sub') userId: string) {
    return this.documentsService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  async findById(@Param('id') id: string) {
    return this.documentsService.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document' })
  async delete(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.documentsService.delete(id, userId);
  }
}
