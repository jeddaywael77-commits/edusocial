"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMembersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const group_members_service_1 = require("./group-members.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const group_members_dto_1 = require("./dto/group-members.dto");
let GroupMembersController = class GroupMembersController {
    groupMembersService;
    constructor(groupMembersService) {
        this.groupMembersService = groupMembersService;
    }
    async getMembers(groupId, query) {
        return this.groupMembersService.getMembers(groupId, query);
    }
    async getMemberStats(groupId) {
        return this.groupMembersService.getMemberStats(groupId);
    }
    async getMember(groupId, userId) {
        return this.groupMembersService.getMember(groupId, userId);
    }
    async updateRole(groupId, userId, dto, requesterId) {
        return this.groupMembersService.updateMemberRole(groupId, userId, dto.role, requesterId);
    }
    async removeMember(groupId, userId, requesterId) {
        return this.groupMembersService.removeMember(groupId, userId, requesterId);
    }
    async transferOwnership(groupId, dto, currentAdminId) {
        return this.groupMembersService.transferOwnership(groupId, dto.newAdminId, currentAdminId);
    }
};
exports.GroupMembersController = GroupMembersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List members of a group' }),
    (0, swagger_1.ApiParam)({ name: 'groupId' }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, group_members_dto_1.QueryGroupMembersDto]),
    __metadata("design:returntype", Promise)
], GroupMembersController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get group member statistics' }),
    (0, swagger_1.ApiParam)({ name: 'groupId' }),
    __param(0, (0, common_1.Param)('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupMembersController.prototype, "getMemberStats", null);
__decorate([
    (0, common_1.Get)(':userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific member' }),
    (0, swagger_1.ApiParam)({ name: 'groupId' }),
    (0, swagger_1.ApiParam)({ name: 'userId' }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GroupMembersController.prototype, "getMember", null);
__decorate([
    (0, common_1.Put)(':userId/role'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update a member role' }),
    (0, swagger_1.ApiParam)({ name: 'groupId' }),
    (0, swagger_1.ApiParam)({ name: 'userId' }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, group_members_dto_1.UpdateMemberRoleDto, String]),
    __metadata("design:returntype", Promise)
], GroupMembersController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)(':userId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a member from the group' }),
    (0, swagger_1.ApiParam)({ name: 'groupId' }),
    (0, swagger_1.ApiParam)({ name: 'userId' }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], GroupMembersController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Post)('transfer-ownership'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Transfer group ownership' }),
    (0, swagger_1.ApiParam)({ name: 'groupId' }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, group_members_dto_1.TransferOwnershipDto, String]),
    __metadata("design:returntype", Promise)
], GroupMembersController.prototype, "transferOwnership", null);
exports.GroupMembersController = GroupMembersController = __decorate([
    (0, swagger_1.ApiTags)('Group Members'),
    (0, common_1.Controller)('groups/:groupId/members'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __metadata("design:paramtypes", [group_members_service_1.GroupMembersService])
], GroupMembersController);
//# sourceMappingURL=group-members.controller.js.map