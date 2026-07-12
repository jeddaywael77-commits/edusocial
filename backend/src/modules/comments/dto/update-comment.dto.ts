import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateCommentDto {
  @ApiPropertyOptional({ example: 'Updated comment' })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content: string;
}
