import { Controller, Get, Query, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SearchService } from './search.service';
import { GlobalSearchDto, AutocompleteDto, IndexEntityDto } from './dto/search.dto';
import { SearchProcessor } from './processors/search.processor';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly searchProcessor: SearchProcessor,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Global search across all entity types' })
  async globalSearch(@Query() query: GlobalSearchDto) {
    return this.searchService.search(query.q || '', {
      indexes: query.indexes as any,
      limit: query.limit,
      offset: query.offset,
      filters: query.filters,
    });
  }

  @Get('autocomplete')
  @ApiOperation({ summary: 'Autocomplete search suggestions' })
  async autocomplete(@Query() query: AutocompleteDto) {
    return this.searchService.autocomplete(query.q || '', {
      index: query.index,
      limit: query.limit,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get search index statistics' })
  async getStats() {
    return this.searchService.getIndexStats();
  }

  @Post('index/:entityType')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Trigger re-indexing for an entity type' })
  async reindex(@Param('entityType') entityType: string) {
    await this.searchProcessor.indexEntityType(entityType as any);
    return { message: `Re-indexing triggered for ${entityType}` };
  }

  @Post('initialize')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initialize all search indexes' })
  async initialize() {
    await this.searchService.initializeIndexes();
    return { message: 'Search indexes initialized' };
  }
}
