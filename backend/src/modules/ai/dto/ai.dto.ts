import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  model?: string;
}

export class SendMessageDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  systemPrompt?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  useRAG?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  ragCollection?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  temperature?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  maxTokens?: number;
}

export class AiTutorDto {
  @ApiProperty()
  @IsString()
  topic: string;

  @ApiProperty()
  @IsString()
  question: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  courseId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  level?: string;
}

export class HomeworkAssistantDto {
  @ApiProperty()
  @IsString()
  assignment: string;

  @ApiProperty()
  @IsString()
  subject: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  studentAttempt?: string;
}

export class GenerateQuizDto {
  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsString()
  topic: string;

  @ApiProperty()
  @IsString()
  difficulty: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(20)
  @Type(() => Number)
  numQuestions: number;

  @ApiProperty()
  @IsString()
  questionTypes: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  material?: string;
}

export class GenerateFlashcardsDto {
  @ApiProperty()
  @IsString()
  topic: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  numCards: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  material?: string;
}

export class GenerateMindMapDto {
  @ApiProperty()
  @IsString()
  topic: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  depth?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  material?: string;
}

export class SummarizeDocumentDto {
  @ApiProperty()
  @IsString()
  documentId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  length?: string;
}

export class StudyPlanDto {
  @ApiProperty()
  @IsString()
  goals: string;

  @ApiProperty()
  @IsString()
  availableTime: string;

  @ApiProperty()
  @IsString()
  subjects: string;

  @ApiProperty()
  @IsString()
  examDates: string;

  @ApiProperty()
  @IsString()
  currentLevel: string;
}

export class HomeworkFeedbackDto {
  @ApiProperty()
  @IsString()
  assignment: string;

  @ApiProperty()
  @IsString()
  submission: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  rubric?: string;
}

export class RagQueryDto {
  @ApiProperty()
  @IsString()
  query: string;

  @ApiProperty()
  @IsString()
  collection: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  topK?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  systemPrompt?: string;
}

export class IndexDocumentDto {
  @ApiProperty()
  @IsString()
  collection: string;
}

export class ReindexDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  entityType?: string;
}
