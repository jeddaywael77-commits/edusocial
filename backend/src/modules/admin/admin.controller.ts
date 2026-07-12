import {
  Controller,
  Get,
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
  ApiResponse,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  QueryUsersDto,
  UpdateUserRoleDto,
  ToggleUserActiveDto,
  QueryReportsDto,
  ResolveReportDto,
  QueryAuditLogsDto,
} from './dto/admin.dto';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth('access-token')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard stats' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics' })
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'List all users with filtering and pagination' })
  async getUsers(@Query() query: QueryUsersDto) {
    return this.adminService.getUsers(query);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiParam({ name: 'id' })
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id/role')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user role' })
  @ApiParam({ name: 'id' })
  async updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
    @CurrentUser('sub') adminId: string,
  ) {
    return this.adminService.updateUserRole(id, dto, adminId);
  }

  @Put('users/:id/active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle user active status' })
  @ApiParam({ name: 'id' })
  async toggleActive(
    @Param('id') id: string,
    @Body() dto: ToggleUserActiveDto,
    @CurrentUser('sub') adminId: string,
  ) {
    return this.adminService.toggleUserActive(id, dto.isActive, adminId);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id' })
  async deleteUser(
    @Param('id') id: string,
    @CurrentUser('sub') adminId: string,
  ) {
    return this.adminService.deleteUser(id, adminId);
  }

  @Get('reports')
  @ApiOperation({ summary: 'List content reports (post or comment)' })
  async getReports(@Query() query: QueryReportsDto) {
    return this.adminService.getReports(query);
  }

  @Put('reports/post/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resolve a post report' })
  @ApiParam({ name: 'id' })
  async resolvePostReport(
    @Param('id') id: string,
    @Body() dto: ResolveReportDto,
    @CurrentUser('sub') adminId: string,
  ) {
    return this.adminService.resolvePostReport(id, dto, adminId);
  }

  @Put('reports/comment/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resolve a comment report' })
  @ApiParam({ name: 'id' })
  async resolveCommentReport(
    @Param('id') id: string,
    @Body() dto: ResolveReportDto,
    @CurrentUser('sub') adminId: string,
  ) {
    return this.adminService.resolveCommentReport(id, dto, adminId);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Query audit logs' })
  async getAuditLogs(@Query() query: QueryAuditLogsDto) {
    return this.adminService.getAuditLogs(query);
  }
}
