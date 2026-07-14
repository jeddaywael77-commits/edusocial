import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, MaxLength, MinLength } from 'class-validator';

export class CreateProgramDto {
  @ApiProperty({ example: 'Licence en Informatique' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiProperty({ example: 'Informatique' })
  @IsString()
  field: string;

  @ApiProperty({ example: 'bachelor', description: 'bachelor, master, phd, engineering' })
  @IsString()
  level: string;

  @ApiPropertyOptional({ example: '3 ans' })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ example: 'français' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ example: '200 TND/an' })
  @IsOptional()
  @IsString()
  tuitionFees?: string;

  @ApiProperty()
  @IsString()
  institutionId: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
