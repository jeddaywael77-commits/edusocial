import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CreateArticleDto {
  @ApiProperty({ example: 'New semester starts September 15' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Full article content in markdown...' })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiPropertyOptional({ example: 'Brief summary of the article' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ enum: NEWS_CATEGORIES, default: 'general' })
  @IsOptional()
  @IsString()
  @IsIn(NEWS_CATEGORIES as unknown as string[])
  category?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
