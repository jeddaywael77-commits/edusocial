import { IsString, IsOptional, IsNumber, IsArray, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GlobalSearchDto {
  @ApiPropertyOptional({ description: 'Search query' })
  @IsString()
  @IsOptional()
  q?: string;

  @ApiPropertyOptional({ description: 'Filter by index types', example: ['users', 'posts'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  indexes?: string[];

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 20 })
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ minimum: 0, default: 0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({ description: 'Filter by specific field values' })
  @IsOptional()
  filters?: Record<string, string | number | boolean>;
}

export class AutocompleteDto {
  @ApiPropertyOptional({ description: 'Search prefix' })
  @IsString()
  @IsOptional()
  q?: string;

  @ApiPropertyOptional({ description: 'Index to search in', default: 'users' })
  @IsString()
  @IsOptional()
  index?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 20, default: 5 })
  @IsNumber()
  @Min(1)
  @Max(20)
  @Type(() => Number)
  @IsOptional()
  limit?: number;
}

export class IndexEntityDto {
  @ApiPropertyOptional({ description: 'Entity type to index', enum: ['users', 'posts', 'courses', 'groups', 'marketplace', 'documents', 'lessons'] })
  @IsString()
  @IsOptional()
  entityType?: string;
}

export class SearchConfigDto {
  @ApiPropertyOptional({ description: 'Entity type' })
  @IsString()
  entityType: string;
}
