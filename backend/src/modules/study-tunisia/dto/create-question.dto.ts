import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, MaxLength, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({ example: 'What are the requirements for engineering school?' })
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'I want to know about admission requirements...' })
  @IsString()
  @MinLength(10)
  @MaxLength(10000)
  content: string;

  @ApiPropertyOptional({ example: ['engineering', 'admission'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class CreateAnswerDto {
  @ApiProperty({ example: 'To apply for engineering school, you need...' })
  @IsString()
  @MinLength(10)
  @MaxLength(10000)
  content: string;
}
