import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LeaderboardService } from './leaderboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('xp')
  @ApiOperation({ summary: 'Get top users by XP' })
  @ApiQuery({ name: 'limit', required: false })
  async getTopByXp(@Query('limit') limit?: number) {
    return this.leaderboardService.getTopByXp(limit);
  }

  @Get('level')
  @ApiOperation({ summary: 'Get top users by level' })
  @ApiQuery({ name: 'limit', required: false })
  async getTopByLevel(@Query('limit') limit?: number) {
    return this.leaderboardService.getTopByLevel(limit);
  }

  @Get('my-rank')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get my rank' })
  async getMyRank(@CurrentUser('sub') userId: string) {
    return this.leaderboardService.getUserRank(userId);
  }
}
