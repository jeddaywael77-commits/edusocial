import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MediaCategory } from '../../../common/enums';

export class SimpleUploadDto {
  @ApiPropertyOptional({
    enum: MediaCategory,
    default: MediaCategory.POST_IMAGE,
  })
  @IsOptional()
  @IsEnum(MediaCategory)
  category?: MediaCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class QueryUploadsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: MediaCategory })
  @IsOptional()
  @IsEnum(MediaCategory)
  category?: MediaCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ default: 'desc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}

export class BulkUploadMetadataDto {
  @ApiPropertyOptional({
    enum: MediaCategory,
    default: MediaCategory.POST_IMAGE,
  })
  @IsOptional()
  @IsEnum(MediaCategory)
  category?: MediaCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class BatchDeleteUploadsDto {
  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}
