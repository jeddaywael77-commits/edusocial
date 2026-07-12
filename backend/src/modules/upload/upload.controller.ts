import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UploadService } from './upload.service';
import { MediaCategory } from '../../common/enums';
import {
  FileValidationPipe,
  MultiFileValidationPipe,
} from '../media/guards/file-validation.pipe';
import { QueryUploadsDto, BatchDeleteUploadsDto } from './dto/upload.dto';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload a single file (simplified)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        category: {
          type: 'string',
          enum: Object.values(MediaCategory),
          default: 'POST_IMAGE',
        },
      },
    },
  })
  async uploadSingle(
    @CurrentUser('sub') userId: string,
    @UploadedFile(new FileValidationPipe({ maxSize: 50 * 1024 * 1024 }))
    file: Express.Multer.File,
    @Body('category') category?: MediaCategory,
  ) {
    return this.uploadService.uploadSingle(
      userId,
      file,
      category || MediaCategory.POST_IMAGE,
    );
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 20))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload multiple files (simplified)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
        category: {
          type: 'string',
          enum: Object.values(MediaCategory),
          default: 'POST_IMAGE',
        },
      },
    },
  })
  async uploadMultiple(
    @CurrentUser('sub') userId: string,
    @UploadedFiles(
      new MultiFileValidationPipe({ maxSize: 50 * 1024 * 1024, maxFiles: 20 }),
    )
    files: Express.Multer.File[],
    @Body('category') category?: MediaCategory,
  ) {
    return this.uploadService.uploadMultiple(
      userId,
      files,
      category || MediaCategory.POST_IMAGE,
    );
  }

  @Get('history')
  @ApiOperation({ summary: 'Get upload history' })
  async getHistory(
    @CurrentUser('sub') userId: string,
    @Query() query: QueryUploadsDto,
  ) {
    return this.uploadService.getUploadHistory(userId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get upload statistics' })
  async getStats(@CurrentUser('sub') userId: string) {
    return this.uploadService.getUploadStats(userId);
  }

  @Get('quota')
  @ApiOperation({ summary: 'Get upload quota information' })
  async getQuota(@CurrentUser('sub') userId: string) {
    return this.uploadService.getUploadQuota(userId);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent uploads' })
  async getRecent(
    @CurrentUser('sub') userId: string,
    @Query('limit') limit?: number,
  ) {
    return this.uploadService.getRecentUploads(userId, limit || 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get upload by ID' })
  @ApiParam({ name: 'id' })
  async getById(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.uploadService.getUploadById(userId, id);
  }

  @Get(':id/signed-url')
  @ApiOperation({ summary: 'Get signed URL for an upload' })
  @ApiParam({ name: 'id' })
  async getSignedUrl(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Query('expiresIn') expiresIn?: number,
  ) {
    return this.uploadService.getSignedUrl(userId, id, expiresIn);
  }

  @Put(':id/replace')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Replace an upload' })
  @ApiParam({ name: 'id' })
  @ApiConsumes('multipart/form-data')
  async replace(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @UploadedFile(new FileValidationPipe({ maxSize: 50 * 1024 * 1024 }))
    file: Express.Multer.File,
  ) {
    return this.uploadService.replaceUpload(userId, id, file);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an upload' })
  @ApiParam({ name: 'id' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.uploadService.deleteUpload(userId, id, role);
  }

  @Post('batch-delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Batch delete uploads' })
  async batchDelete(
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: string,
    @Body() dto: BatchDeleteUploadsDto,
  ) {
    return this.uploadService.batchDeleteUploads(userId, dto.ids, role);
  }
}
