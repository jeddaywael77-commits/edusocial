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
  Res,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { MediaService } from './media.service';
import { MediaCategory } from '../../common/enums';
import { QueryMediaDto, BulkDeleteDto, UploadMediaDto } from './dto/media.dto';
import {
  FileValidationPipe,
  MultiFileValidationPipe,
} from './guards/file-validation.pipe';
import { ConfigService } from '@nestjs/config';

@ApiTags('Media')
@Controller('media')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private configService: ConfigService,
  ) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a single file' })
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
  @UseInterceptors(FileInterceptor('file', { storage: undefined }))
  async uploadFile(
    @CurrentUser('sub') userId: string,
    @UploadedFile(
      new FileValidationPipe({
        maxSize: 50 * 1024 * 1024,
      }),
    )
    file: Express.Multer.File,
    @Body('category') category?: MediaCategory,
  ) {
    return this.mediaService.upload(
      userId,
      file,
      category || MediaCategory.POST_IMAGE,
    );
  }

  @Post('upload/multiple')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload multiple files' })
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
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultiple(
    @CurrentUser('sub') userId: string,
    @UploadedFiles(
      new MultiFileValidationPipe({
        maxSize: 50 * 1024 * 1024,
        maxFiles: 10,
      }),
    )
    files: Express.Multer.File[],
    @Body('category') category?: MediaCategory,
  ) {
    return this.mediaService.uploadMultiple(
      userId,
      files,
      category || MediaCategory.POST_IMAGE,
    );
  }

  @Get('mine')
  @ApiOperation({ summary: 'List my media' })
  async getMyMedia(
    @CurrentUser('sub') userId: string,
    @Query() query: QueryMediaDto,
  ) {
    return this.mediaService.findUserMedia(userId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get media stats' })
  async getStats(@CurrentUser('sub') userId: string) {
    return this.mediaService.getStats(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get media by ID' })
  async findOne(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.mediaService.findById(id, userId);
  }

  @Get(':id/signed-url')
  @ApiOperation({ summary: 'Generate signed URL for media' })
  async getSignedUrl(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Query('expiresIn') expiresIn?: number,
  ) {
    return this.mediaService.getSignedUrl(id, userId, expiresIn);
  }

  @Put(':id/replace')
  @ApiOperation({ summary: 'Replace media file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async replace(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @UploadedFile(new FileValidationPipe({ maxSize: 50 * 1024 * 1024 }))
    file: Express.Multer.File,
  ) {
    return this.mediaService.replace(id, userId, file);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete media (soft delete)' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.mediaService.delete(id, userId, role);
  }

  @Post('bulk-delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk delete media' })
  async bulkDelete(
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: string,
    @Body() dto: BulkDeleteDto,
  ) {
    return this.mediaService.bulkDelete(dto, userId, role);
  }
}
