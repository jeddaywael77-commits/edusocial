import { Controller, Get, Post, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class AwardBadgeDto {
  @ApiProperty() @IsString() badgeId: string;
}

class AddXpDto {
  @ApiProperty() @IsNumber() xp: number;
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Award a badge to a user' })
  async awardBadge(@CurrentUser('sub') userId: string, @Body() dto: AwardBadgeDto) {
    return this.gamificationService.awardBadge(userId, dto.badgeId);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get my gamification stats' })
  async getStats(@CurrentUser('sub') userId: string) {
    return this.gamificationService.getUserStats(userId);
  }

  @Post('add-xp')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add XP to a user' })
  async addXp(@CurrentUser('sub') userId: string, @Body() dto: AddXpDto) {
    return this.gamificationService.addXp(userId, dto.xp);
  }
}
