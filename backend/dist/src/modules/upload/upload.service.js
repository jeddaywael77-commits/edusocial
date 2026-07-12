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
var UploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const media_service_1 = require("../media/media.service");
const enums_1 = require("../../common/enums");
let UploadService = UploadService_1 = class UploadService {
    prisma;
    mediaService;
    logger = new common_1.Logger(UploadService_1.name);
    constructor(prisma, mediaService) {
        this.prisma = prisma;
        this.mediaService = mediaService;
    }
    async uploadSingle(userId, file, category = enums_1.MediaCategory.POST_IMAGE, description) {
        const media = await this.mediaService.upload(userId, file, category);
        this.logger.log(`Upload complete: ${media.id} by user ${userId}`);
        return {
            ...media,
            description,
            uploadType: 'single',
        };
    }
    async uploadMultiple(userId, files, category = enums_1.MediaCategory.POST_IMAGE, description) {
        const results = [];
        for (const file of files) {
            const media = await this.mediaService.upload(userId, file, category);
            results.push({ ...media, description });
        }
        this.logger.log(`Bulk upload complete: ${results.length} files by user ${userId}`);
        return {
            data: results,
            total: results.length,
            uploadType: 'multiple',
        };
    }
    async getUploadHistory(userId, query) {
        return this.mediaService.findUserMedia(userId, query);
    }
    async getUploadStats(userId) {
        return this.mediaService.getStats(userId);
    }
    async getUploadById(userId, mediaId) {
        const media = await this.mediaService.findById(mediaId, userId);
        return media;
    }
    async deleteUpload(userId, mediaId, userRole) {
        return this.mediaService.delete(mediaId, userId, userRole);
    }
    async batchDeleteUploads(userId, mediaIds, userRole) {
        const dto = { ids: mediaIds };
        return this.mediaService.bulkDelete(dto, userId, userRole);
    }
    async getSignedUrl(userId, mediaId, expiresIn) {
        return this.mediaService.getSignedUrl(mediaId, userId, expiresIn);
    }
    async replaceUpload(userId, mediaId, file) {
        return this.mediaService.replace(mediaId, userId, file);
    }
    async getRecentUploads(userId, limit = 10) {
        const uploads = await this.prisma.media.findMany({
            where: { ownerId: userId, isDeleted: false },
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                url: true,
                mimeType: true,
                extension: true,
                originalName: true,
                size: true,
                category: true,
                status: true,
                thumbnailUrl: true,
                createdAt: true,
            },
        });
        return uploads;
    }
    async getUploadQuota(userId) {
        const stats = await this.mediaService.getStats(userId);
        const maxUploads = 1000;
        const maxSizeBytes = 5 * 1024 * 1024 * 1024;
        return {
            used: {
                uploads: stats.totalMedia,
                bytes: stats.totalSize,
            },
            limit: {
                uploads: maxUploads,
                bytes: maxSizeBytes,
            },
            remaining: {
                uploads: Math.max(0, maxUploads - stats.totalMedia),
                bytes: Math.max(0, maxSizeBytes - stats.totalSize),
            },
            percentage: {
                uploads: Math.min(100, Math.round((stats.totalMedia / maxUploads) * 100)),
                bytes: Math.min(100, Math.round((stats.totalSize / maxSizeBytes) * 100)),
            },
        };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = UploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        media_service_1.MediaService])
], UploadService);
//# sourceMappingURL=upload.service.js.map