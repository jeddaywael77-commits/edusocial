import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { NewsService } from './news.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { QueryNewsDto } from './dto/query-news.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a news article' })
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateArticleDto,
  ) {
    return this.newsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all news articles' })
  async findAll(@Query() query: QueryNewsDto) {
    return this.newsService.findAll(query);
  }

  @Get('latest')
  @ApiOperation({ summary: 'Get latest news' })
  @ApiQuery({ name: 'limit', required: false })
  async findLatest(@Query('limit') limit?: number) {
    return this.newsService.findLatest(limit);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search news articles' })
  @ApiQuery({ name: 'q', required: true })
  async search(@Query('q') q: string) {
    return this.newsService.findAll({ search: q });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by ID' })
  @ApiParam({ name: 'id' })
  async findById(@Param('id') id: string) {
    return this.newsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an article' })
  @ApiParam({ name: 'id' })
  async update(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateArticleDto,
  ) {
    return this.newsService.update(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an article' })
  @ApiParam({ name: 'id' })
  async delete(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.newsService.delete(id, userId);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle like on article' })
  @ApiParam({ name: 'id' })
  async toggleLike(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.newsService.toggleLike(id, userId);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add comment to article' })
  @ApiParam({ name: 'id' })
  async addComment(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.newsService.addComment(id, userId, dto.content);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get article comments' })
  @ApiParam({ name: 'id' })
  @ApiQuery({ name: 'cursor', required: false })
  async getComments(
    @Param('id') id: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.newsService.getComments(id, cursor);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'id' })
  async deleteComment(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.newsService.deleteComment(id, userId);
  }
}
