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
exports.MediaController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const media_service_1 = require("./media.service");
const enums_1 = require("../../common/enums");
const media_dto_1 = require("./dto/media.dto");
const file_validation_pipe_1 = require("./guards/file-validation.pipe");
const config_1 = require("@nestjs/config");
let MediaController = class MediaController {
    mediaService;
    configService;
    constructor(mediaService, configService) {
        this.mediaService = mediaService;
        this.configService = configService;
    }
    async uploadFile(userId, file, category) {
        return this.mediaService.upload(userId, file, category || enums_1.MediaCategory.POST_IMAGE);
    }
    async uploadMultiple(userId, files, category) {
        return this.mediaService.uploadMultiple(userId, files, category || enums_1.MediaCategory.POST_IMAGE);
    }
    async getMyMedia(userId, query) {
        return this.mediaService.findUserMedia(userId, query);
    }
    async getStats(userId) {
        return this.mediaService.getStats(userId);
    }
    async findOne(id, userId) {
        return this.mediaService.findById(id, userId);
    }
    async getSignedUrl(id, userId, expiresIn) {
        return this.mediaService.getSignedUrl(id, userId, expiresIn);
    }
    async replace(id, userId, file) {
        return this.mediaService.replace(id, userId, file);
    }
    async delete(id, userId, role) {
        return this.mediaService.delete(id, userId, role);
    }
    async bulkDelete(userId, role, dto) {
        return this.mediaService.bulkDelete(dto, userId, role);
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a single file' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
                category: {
                    type: 'string',
                    enum: Object.values(enums_1.MediaCategory),
                    default: 'POST_IMAGE',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: undefined })),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.UploadedFile)(new file_validation_pipe_1.FileValidationPipe({
        maxSize: 50 * 1024 * 1024,
    }))),
    __param(2, (0, common_1.Body)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('upload/multiple'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Upload multiple files' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                files: { type: 'array', items: { type: 'string', format: 'binary' } },
                category: {
                    type: 'string',
                    enum: Object.values(enums_1.MediaCategory),
                    default: 'POST_IMAGE',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10)),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.UploadedFiles)(new file_validation_pipe_1.MultiFileValidationPipe({
        maxSize: 50 * 1024 * 1024,
        maxFiles: 10,
    }))),
    __param(2, (0, common_1.Body)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadMultiple", null);
__decorate([
    (0, common_1.Get)('mine'),
    (0, swagger_1.ApiOperation)({ summary: 'List my media' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, media_dto_1.QueryMediaDto]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getMyMedia", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get media stats' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get media by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/signed-url'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate signed URL for media' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(2, (0, common_1.Query)('expiresIn')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getSignedUrl", null);
__decorate([
    (0, common_1.Put)(':id/replace'),
    (0, swagger_1.ApiOperation)({ summary: 'Replace media file' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(2, (0, common_1.UploadedFile)(new file_validation_pipe_1.FileValidationPipe({ maxSize: 50 * 1024 * 1024 }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "replace", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete media (soft delete)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('bulk-delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk delete media' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('role')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, media_dto_1.BulkDeleteDto]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "bulkDelete", null);
exports.MediaController = MediaController = __decorate([
    (0, swagger_1.ApiTags)('Media'),
    (0, common_1.Controller)('media'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __metadata("design:paramtypes", [media_service_1.MediaService,
        config_1.ConfigService])
], MediaController);
//# sourceMappingURL=media.controller.js.map