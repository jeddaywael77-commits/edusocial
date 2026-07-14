import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, IsDateString, MaxLength, MinLength, Min } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Study Group Meeting' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ example: 'Weekly study group for algorithms' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({ example: '2025-09-20' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '2025-09-20T14:00:00.000Z' })
  @IsDateString()
  startTime: string;

  @ApiPropertyOptional({ example: '2025-09-20T16:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiPropertyOptional({ example: 'Room 201, Faculty of Sciences' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxAttendees?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ example: 'social', description: 'social, academic, club, exam' })
  @IsOptional()
  @IsString()
  type?: string;
}
