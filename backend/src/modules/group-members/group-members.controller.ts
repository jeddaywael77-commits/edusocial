import {
  Controller,
  Get,
  Put,
  Delete,
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
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { GroupMembersService } from './group-members.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  QueryGroupMembersDto,
  UpdateMemberRoleDto,
  TransferOwnershipDto,
} from './dto/group-members.dto';

@ApiTags('Group Members')
@Controller('groups/:groupId/members')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}

  @Get()
  @ApiOperation({ summary: 'List members of a group' })
  @ApiParam({ name: 'groupId' })
  async getMembers(
    @Param('groupId') groupId: string,
    @Query() query: QueryGroupMembersDto,
  ) {
    return this.groupMembersService.getMembers(groupId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get group member statistics' })
  @ApiParam({ name: 'groupId' })
  async getMemberStats(@Param('groupId') groupId: string) {
    return this.groupMembersService.getMemberStats(groupId);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get a specific member' })
  @ApiParam({ name: 'groupId' })
  @ApiParam({ name: 'userId' })
  async getMember(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ) {
    return this.groupMembersService.getMember(groupId, userId);
  }

  @Put(':userId/role')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a member role' })
  @ApiParam({ name: 'groupId' })
  @ApiParam({ name: 'userId' })
  async updateRole(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateMemberRoleDto,
    @CurrentUser('sub') requesterId: string,
  ) {
    return this.groupMembersService.updateMemberRole(
      groupId,
      userId,
      dto.role,
      requesterId,
    );
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a member from the group' })
  @ApiParam({ name: 'groupId' })
  @ApiParam({ name: 'userId' })
  async removeMember(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @CurrentUser('sub') requesterId: string,
  ) {
    return this.groupMembersService.removeMember(groupId, userId, requesterId);
  }

  @Post('transfer-ownership')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transfer group ownership' })
  @ApiParam({ name: 'groupId' })
  async transferOwnership(
    @Param('groupId') groupId: string,
    @Body() dto: TransferOwnershipDto,
    @CurrentUser('sub') currentAdminId: string,
  ) {
    return this.groupMembersService.transferOwnership(
      groupId,
      dto.newAdminId,
      currentAdminId,
    );
  }
}
