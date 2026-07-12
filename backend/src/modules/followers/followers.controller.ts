import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FollowersService } from './followers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Followers')
@Controller('followers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Post(':userId/follow')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Follow a user' })
  async follow(
    @CurrentUser('sub') followerId: string,
    @Param('userId') userId: string,
  ) {
    return this.followersService.follow(followerId, userId);
  }

  @Delete(':userId/unfollow')
  @ApiOperation({ summary: 'Unfollow a user' })
  async unfollow(
    @CurrentUser('sub') followerId: string,
    @Param('userId') userId: string,
  ) {
    return this.followersService.unfollow(followerId, userId);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get followers of a user' })
  async getFollowers(@Param('userId') userId: string) {
    return this.followersService.getFollowers(userId);
  }

  @Get(':userId/following')
  @ApiOperation({ summary: 'Get users followed by a user' })
  async getFollowing(@Param('userId') userId: string) {
    return this.followersService.getFollowing(userId);
  }

  @Get(':userId/count')
  @ApiOperation({ summary: 'Get follower count' })
  async getFollowerCount(@Param('userId') userId: string) {
    return this.followersService.getFollowerCount(userId);
  }
}
