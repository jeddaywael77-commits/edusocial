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
exports.LikesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const likes_service_1 = require("./likes.service");
const toggle_reaction_dto_1 = require("./dto/toggle-reaction.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const enums_1 = require("../../common/enums");
let LikesController = class LikesController {
    likesService;
    constructor(likesService) {
        this.likesService = likesService;
    }
    async toggle(userId, dto) {
        return this.likesService.toggle(userId, dto);
    }
    async getPostReactions(postId) {
        return this.likesService.getPostReactions(postId);
    }
    async getPostReactors(postId, type, limit) {
        return this.likesService.getPostReactors(postId, type, limit);
    }
    async getCommentReactions(commentId) {
        return this.likesService.getCommentReactions(commentId);
    }
};
exports.LikesController = LikesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle reaction on post or comment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reaction toggled' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, toggle_reaction_dto_1.ToggleReactionDto]),
    __metadata("design:returntype", Promise)
], LikesController.prototype, "toggle", null);
__decorate([
    (0, common_1.Get)('post/:postId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reaction summary for a post' }),
    (0, swagger_1.ApiParam)({ name: 'postId' }),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LikesController.prototype, "getPostReactions", null);
__decorate([
    (0, common_1.Get)('post/:postId/reactors'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Get users who reacted to a post' }),
    (0, swagger_1.ApiParam)({ name: 'postId' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: enums_1.ReactionType }),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], LikesController.prototype, "getPostReactors", null);
__decorate([
    (0, common_1.Get)('comment/:commentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reaction summary for a comment' }),
    (0, swagger_1.ApiParam)({ name: 'commentId' }),
    __param(0, (0, common_1.Param)('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LikesController.prototype, "getCommentReactions", null);
exports.LikesController = LikesController = __decorate([
    (0, swagger_1.ApiTags)('Reactions'),
    (0, common_1.Controller)('reactions'),
    __metadata("design:paramtypes", [likes_service_1.LikesService])
], LikesController);
//# sourceMappingURL=likes.controller.js.map