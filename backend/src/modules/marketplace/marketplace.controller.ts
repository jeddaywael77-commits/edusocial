import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateMarketplaceItemDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsNumber() price: number;
  @ApiProperty() @IsString() category: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsArray() images?: string[];
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  condition?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() currency?: string;
}

class UpdateMarketplaceItemDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() title?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() price?: number;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsArray() images?: string[];
}

@ApiTags('Marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'List an item' })
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateMarketplaceItemDto,
  ) {
    return this.marketplaceService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all marketplace items' })
  async findAll() {
    return this.marketplaceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  async findById(@Param('id') id: string) {
    return this.marketplaceService.findById(id);
  }

  @Get('seller/:sellerId')
  @ApiOperation({ summary: 'Get items by seller' })
  async findBySeller(@Param('sellerId') sellerId: string) {
    return this.marketplaceService.findBySeller(sellerId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update an item' })
  async update(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateMarketplaceItemDto,
  ) {
    return this.marketplaceService.update(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete an item' })
  async delete(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.marketplaceService.delete(id, userId);
  }
}
