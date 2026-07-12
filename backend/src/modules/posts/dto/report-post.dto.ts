import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class ReportPostDto {
  @ApiProperty({ example: 'spam' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  reason: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  details?: string;
}
