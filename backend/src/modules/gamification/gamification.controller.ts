import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class AwardBadgeDto {
  @ApiProperty() @IsString() badgeId: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() userId?: string;
}

class AddXpDto {
  @ApiProperty() @IsNumber() xp: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() userId?: string;
}

@ApiTags('Gamification')
@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('badges')
  @ApiOperation({ summary: 'Get all available badges' })
  async getBadges() {
    return this.gamificationService.getBadges();
  }

  @Get('my-badges')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get my badges' })
  async getMyBadges(@CurrentUser('sub') userId: string) {
    return this.gamificationService.getUserBadges(userId);
  }

  @Post('award-badge')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Award a badge to a user' })
  async awardBadge(
    @CurrentUser('sub') userId: string,
    @Body() dto: AwardBadgeDto,
  ) {
    const targetUserId = dto.userId || userId;
    return this.gamificationService.awardBadge(targetUserId, dto.badgeId);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get my gamification stats' })
  async getStats(@CurrentUser('sub') userId: string) {
    return this.gamificationService.getUserStats(userId);
  }

  @Post('add-xp')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add XP to a user' })
  async addXp(@CurrentUser('sub') userId: string, @Body() dto: AddXpDto) {
    const targetUserId = dto.userId || userId;
    return this.gamificationService.addXp(targetUserId, dto.xp);
  }
}
