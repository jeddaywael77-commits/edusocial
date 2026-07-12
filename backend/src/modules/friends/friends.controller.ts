import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class SendRequestDto {
  @ApiProperty() @IsString() receiverId: string;
}

@ApiTags('Friends')
@Controller('friends')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  @ApiOperation({ summary: 'Get my friends' })
  async getFriends(@CurrentUser('sub') userId: string) {
    return this.friendsService.getFriends(userId);
  }

  @Get('requests')
  @ApiOperation({ summary: 'Get pending friend requests' })
  async getRequests(@CurrentUser('sub') userId: string) {
    return this.friendsService.getRequests(userId);
  }

  @Post('request')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send a friend request' })
  async sendRequest(
    @CurrentUser('sub') userId: string,
    @Body() dto: SendRequestDto,
  ) {
    return this.friendsService.sendRequest(userId, dto.receiverId);
  }

  @Post('request/:id/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept a friend request' })
  async acceptRequest(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.friendsService.acceptRequest(id, userId);
  }

  @Post('request/:id/decline')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Decline a friend request' })
  async declineRequest(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.friendsService.declineRequest(id, userId);
  }

  @Delete(':friendId')
  @ApiOperation({ summary: 'Remove a friend' })
  async removeFriend(
    @CurrentUser('sub') userId: string,
    @Param('friendId') friendId: string,
  ) {
    return this.friendsService.removeFriend(userId, friendId);
  }
}
