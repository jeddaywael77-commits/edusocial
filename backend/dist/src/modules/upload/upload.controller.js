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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const upload_service_1 = require("./upload.service");
const enums_1 = require("../../common/enums");
const file_validation_pipe_1 = require("../media/guards/file-validation.pipe");
const upload_dto_1 = require("./dto/upload.dto");
let UploadController = class UploadController {
    uploadService;
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async uploadSingle(userId, file, category) {
        return this.uploadService.uploadSingle(userId, file, category || enums_1.MediaCategory.POST_IMAGE);
    }
    async uploadMultiple(userId, files, category) {
        return this.uploadService.uploadMultiple(userId, files, category || enums_1.MediaCategory.POST_IMAGE);
    }
    async getHistory(userId, query) {
        return this.uploadService.getUploadHistory(userId, query);
    }
    async getStats(userId) {
        return this.uploadService.getUploadStats(userId);
    }
    async getQuota(userId) {
        return this.uploadService.getUploadQuota(userId);
    }
    async getRecent(userId, limit) {
        return this.uploadService.getRecentUploads(userId, limit || 10);
    }
    async getById(id, userId) {
        return this.uploadService.getUploadById(userId, id);
    }
    async getSignedUrl(id, userId, expiresIn) {
        return this.uploadService.getSignedUrl(userId, id, expiresIn);
    }
    async replace(id, userId, file) {
        return this.uploadService.replaceUpload(userId, id, file);
    }
    async delete(id, userId, role) {
        return this.uploadService.deleteUpload(userId, id, role);
    }
    async batchDelete(userId, role, dto) {
        return this.uploadService.batchDeleteUploads(userId, dto.ids, role);
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('single'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a single file (simplified)' }),
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
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.UploadedFile)(new file_validation_pipe_1.FileValidationPipe({ maxSize: 50 * 1024 * 1024 }))),
    __param(2, (0, common_1.Body)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadSingle", null);
__decorate([
    (0, common_1.Post)('multiple'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 20)),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Upload multiple files (simplified)' }),
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
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.UploadedFiles)(new file_validation_pipe_1.MultiFileValidationPipe({ maxSize: 50 * 1024 * 1024, maxFiles: 20 }))),
    __param(2, (0, common_1.Body)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadMultiple", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get upload history' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, upload_dto_1.QueryUploadsDto]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get upload statistics' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('quota'),
    (0, swagger_1.ApiOperation)({ summary: 'Get upload quota information' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getQuota", null);
__decorate([
    (0, common_1.Get)('recent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent uploads' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getRecent", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get upload by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)(':id/signed-url'),
    (0, swagger_1.ApiOperation)({ summary: 'Get signed URL for an upload' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(2, (0, common_1.Query)('expiresIn')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getSignedUrl", null);
__decorate([
    (0, common_1.Put)(':id/replace'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Replace an upload' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(2, (0, common_1.UploadedFile)(new file_validation_pipe_1.FileValidationPipe({ maxSize: 50 * 1024 * 1024 }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "replace", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an upload' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('batch-delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Batch delete uploads' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('role')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, upload_dto_1.BatchDeleteUploadsDto]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "batchDelete", null);
exports.UploadController = UploadController = __decorate([
    (0, swagger_1.ApiTags)('Upload'),
    (0, common_1.Controller)('upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map