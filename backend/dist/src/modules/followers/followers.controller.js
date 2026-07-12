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
exports.FollowersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const followers_service_1 = require("./followers.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let FollowersController = class FollowersController {
    followersService;
    constructor(followersService) {
        this.followersService = followersService;
    }
    async follow(followerId, userId) {
        return this.followersService.follow(followerId, userId);
    }
    async unfollow(followerId, userId) {
        return this.followersService.unfollow(followerId, userId);
    }
    async getFollowers(userId) {
        return this.followersService.getFollowers(userId);
    }
    async getFollowing(userId) {
        return this.followersService.getFollowing(userId);
    }
    async getFollowerCount(userId) {
        return this.followersService.getFollowerCount(userId);
    }
};
exports.FollowersController = FollowersController;
__decorate([
    (0, common_1.Post)(':userId/follow'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Follow a user' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FollowersController.prototype, "follow", null);
__decorate([
    (0, common_1.Delete)(':userId/unfollow'),
    (0, swagger_1.ApiOperation)({ summary: 'Unfollow a user' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FollowersController.prototype, "unfollow", null);
__decorate([
    (0, common_1.Get)(':userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get followers of a user' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FollowersController.prototype, "getFollowers", null);
__decorate([
    (0, common_1.Get)(':userId/following'),
    (0, swagger_1.ApiOperation)({ summary: 'Get users followed by a user' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FollowersController.prototype, "getFollowing", null);
__decorate([
    (0, common_1.Get)(':userId/count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get follower count' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FollowersController.prototype, "getFollowerCount", null);
exports.FollowersController = FollowersController = __decorate([
    (0, swagger_1.ApiTags)('Followers'),
    (0, common_1.Controller)('followers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __metadata("design:paramtypes", [followers_service_1.FollowersService])
], FollowersController);
//# sourceMappingURL=followers.controller.js.map