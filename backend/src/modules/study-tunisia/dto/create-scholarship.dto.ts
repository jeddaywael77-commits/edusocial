import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsDateString, MaxLength, MinLength } from 'class-validator';

export class CreateScholarshipDto {
  @ApiProperty({ example: 'Bourse d\'excellence 2025' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  institutionId?: string;

  @ApiPropertyOptional({ example: '5000 TND/an' })
  @IsOptional()
  @IsString()
  amount?: string;

  @ApiProperty({ example: '2025-12-01' })
  @IsDateString()
  deadline: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(3000)
  requirements?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
