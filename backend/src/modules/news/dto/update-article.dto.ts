import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsIn, MaxLength, MinLength } from 'class-validator';

const NEWS_CATEGORIES = [
  'general',
  'announcement',
  'academic',
  'event',
  'tip',
  'campus',
  'technology',
  'sports',
] as const;

export class UpdateArticleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(10)
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ enum: NEWS_CATEGORIES })
  @IsOptional()
  @IsString()
  @IsIn(NEWS_CATEGORIES as unknown as string[])
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
