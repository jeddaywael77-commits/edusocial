import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { LikesService } from './likes.service';
import { ToggleReactionDto } from './dto/toggle-reaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ReactionType } from '../../common/enums';

@ApiTags('Reactions')
@Controller('reactions')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle reaction on post or comment' })
  @ApiResponse({ status: 200, description: 'Reaction toggled' })
  async toggle(
    @CurrentUser('sub') userId: string,
    @Body() dto: ToggleReactionDto,
  ) {
    return this.likesService.toggle(userId, dto);
  }

  @Get('post/:postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get reaction summary for a post' })
  @ApiParam({ name: 'postId' })
  async getPostReactions(@Param('postId') postId: string) {
    return this.likesService.getPostReactions(postId);
  }

  @Get('post/:postId/reactors')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get users who reacted to a post' })
  @ApiParam({ name: 'postId' })
  @ApiQuery({ name: 'type', required: false, enum: ReactionType })
  async getPostReactors(
    @Param('postId') postId: string,
    @Query('type') type?: ReactionType,
    @Query('limit') limit?: number,
  ) {
    return this.likesService.getPostReactors(postId, type, limit);
  }

  @Get('comment/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get reaction summary for a comment' })
  @ApiParam({ name: 'commentId' })
  async getCommentReactions(@Param('commentId') commentId: string) {
    return this.likesService.getCommentReactions(commentId);
  }
}
