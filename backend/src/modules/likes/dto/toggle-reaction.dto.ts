import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReactionType } from '../../../common/enums';

export class ToggleReactionDto {
  @ApiProperty({ enum: ReactionType, default: ReactionType.LIKE })
  @IsEnum(ReactionType)
  type: ReactionType = ReactionType.LIKE;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  postId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  commentId?: string;
}
