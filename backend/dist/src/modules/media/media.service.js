"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MediaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../database/prisma.service");
const storage_factory_1 = require("./storage/storage.factory");
const enums_1 = require("../../common/enums");
const crypto_1 = require("crypto");
const path = __importStar(require("path"));
let MediaService = MediaService_1 = class MediaService {
    prisma;
    storageFactory;
    configService;
    logger = new common_1.Logger(MediaService_1.name);
    constructor(prisma, storageFactory, configService) {
        this.prisma = prisma;
        this.storageFactory = storageFactory;
        this.configService = configService;
    }
    async upload(ownerId, file, category = enums_1.MediaCategory.POST_IMAGE) {
        const checksum = (0, crypto_1.createHash)('sha256').update(file.buffer).digest('hex');
        const existing = await this.prisma.media.findFirst({
            where: { checksum, ownerId, isDeleted: false },
        });
        if (existing) {
            this.logger.log(`Duplicate upload detected: ${checksum}`);
            return existing;
        }
        const ext = path.extname(file.originalname).toLowerCase().replace('.', '') ||
            this.getExtFromMime(file.mimetype);
        const key = this.generateKey(ownerId, category, ext);
        const storage = this.storageFactory.getProviderInstance();
        const bucket = this.configService.get('media.bucket') || 'edusocial';
        const result = await storage.upload(file.buffer, {
            bucket,
            key,
            contentType: file.mimetype,
            metadata: {
                ownerId,
                category,
                originalName: file.originalname,
            },
        });
        const media = await this.prisma.media.create({
            data: {
                ownerId,
                category: category,
                storageProvider: this.configService.get('media.storageProvider') || 'local',
                bucket: result.bucket,
                key: result.key,
                url: result.url,
                mimeType: file.mimetype,
                extension: ext,
                originalName: file.originalname,
                size: file.size,
                checksum,
                status: enums_1.MediaStatus.UPLOADING,
                width: file.mimetype.startsWith('image/')
                    ? file.width || null
                    : null,
                height: file.mimetype.startsWith('image/')
                    ? file.height || null
                    : null,
            },
        });
        this.logger.log(`File uploaded: ${media.id} (${file.originalname})`);
        return media;
    }
    async uploadMultiple(ownerId, files, category = enums_1.MediaCategory.POST_IMAGE) {
        const results = [];
        for (const file of files) {
            const media = await this.upload(ownerId, file, category);
            results.push(media);
        }
        return results;
    }
    async findById(id, userId) {
        const media = await this.prisma.media.findUnique({
            where: { id },
            include: { owner: { select: { id: true, name: true, avatar: true } } },
        });
        if (!media || media.isDeleted) {
            throw new common_1.NotFoundException('Media not found');
        }
        return media;
    }
    async findUserMedia(userId, query) {
        const page = query.page || 1;
        const limit = Math.min(query.limit || 20, 100);
        const skip = (page - 1) * limit;
        const where = {
            ownerId: userId,
            isDeleted: false,
            ...(query.category && { category: query.category }),
            ...(query.mimeType && {
                mimeType: { contains: query.mimeType, mode: 'insensitive' },
            }),
            ...(query.search && {
                OR: [
                    { originalName: { contains: query.search, mode: 'insensitive' } },
                    { mimeType: { contains: query.search, mode: 'insensitive' } },
                ],
            }),
        };
        const sortBy = query.sortBy || 'createdAt';
        const sortOrder = query.sortOrder || 'desc';
        const [media, total] = await Promise.all([
            this.prisma.media.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: { owner: { select: { id: true, name: true, avatar: true } } },
            }),
            this.prisma.media.count({ where }),
        ]);
        return {
            data: media,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1,
            },
        };
    }
    async getSignedUrl(id, userId, expiresIn) {
        const media = await this.prisma.media.findUnique({ where: { id } });
        if (!media || media.isDeleted)
            throw new common_1.NotFoundException('Media not found');
        const storage = this.storageFactory.getProviderInstance();
        const url = await storage.getSignedUrl({
            bucket: media.bucket ||
                this.configService.get('media.bucket') ||
                'edusocial',
            key: media.key,
            expiresIn: expiresIn ||
                this.configService.get('media.signedUrlExpiry') ||
                3600,
        });
        return { url, expiresIn: expiresIn || 3600 };
    }
    async replace(id, userId, file) {
        const media = await this.prisma.media.findUnique({ where: { id } });
        if (!media || media.isDeleted)
            throw new common_1.NotFoundException('Media not found');
        if (media.ownerId !== userId)
            throw new common_1.ForbiddenException('Not authorized');
        const storage = this.storageFactory.getProviderInstance();
        const bucket = media.bucket ||
            this.configService.get('media.bucket') ||
            'edusocial';
        await storage.delete(bucket, media.key);
        const checksum = (0, crypto_1.createHash)('sha256').update(file.buffer).digest('hex');
        const ext = path.extname(file.originalname).toLowerCase().replace('.', '') ||
            this.getExtFromMime(file.mimetype);
        const replaceBucket = media.bucket ||
            this.configService.get('media.bucket') ||
            'edusocial';
        const result = await storage.upload(file.buffer, {
            bucket: replaceBucket,
            key: media.key,
            contentType: file.mimetype,
        });
        const updated = await this.prisma.media.update({
            where: { id },
            data: {
                url: result.url,
                mimeType: file.mimetype,
                extension: ext,
                originalName: file.originalname,
                size: file.size,
                checksum,
                status: enums_1.MediaStatus.UPLOADING,
            },
        });
        this.logger.log(`Media replaced: ${id}`);
        return updated;
    }
    async delete(id, userId, userRole) {
        const media = await this.prisma.media.findUnique({ where: { id } });
        if (!media || media.isDeleted)
            throw new common_1.NotFoundException('Media not found');
        const isOwner = media.ownerId === userId;
        const isAdmin = userRole === 'ADMIN' || userRole === 'MODERATOR';
        if (!isOwner && !isAdmin)
            throw new common_1.ForbiddenException('Not authorized');
        const updated = await this.prisma.media.update({
            where: { id },
            data: { isDeleted: true, deletedAt: new Date() },
        });
        this.logger.log(`Media soft-deleted: ${id}`);
        return { success: true, id: updated.id };
    }
    async bulkDelete(dto, userId, userRole) {
        const results = [];
        for (const id of dto.ids) {
            try {
                await this.delete(id, userId, userRole);
                results.push({ id, success: true });
            }
            catch (error) {
                results.push({ id, success: false, error: error.message });
            }
        }
        return results;
    }
    async updateStatus(id, status, metadata) {
        const data = { status: status };
        if (metadata) {
            data.metadata = metadata;
        }
        return this.prisma.media.update({ where: { id }, data });
    }
    async updateProcessingResult(id, results) {
        return this.prisma.media.update({
            where: { id },
            data: {
                ...results,
                status: enums_1.MediaStatus.READY,
            },
        });
    }
    async getStats(ownerId) {
        const stats = await this.prisma.media.groupBy({
            by: ['category', 'mimeType'],
            where: { ownerId, isDeleted: false },
            _count: { id: true },
            _sum: { size: true },
        });
        const totalMedia = await this.prisma.media.count({
            where: { ownerId, isDeleted: false },
        });
        const totalSize = await this.prisma.media.aggregate({
            where: { ownerId, isDeleted: false },
            _sum: { size: true },
        });
        return {
            totalMedia,
            totalSize: totalSize._sum.size || 0,
            byCategory: stats.reduce((acc, s) => {
                acc[s.category] = (acc[s.category] || 0) + s._count.id;
                return acc;
            }, {}),
            byType: stats.reduce((acc, s) => {
                acc[s.mimeType] = (acc[s.mimeType] || 0) + s._count.id;
                return acc;
            }, {}),
        };
    }
    generateKey(ownerId, category, ext) {
        const date = new Date();
        const datePath = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`;
        const uuid = (0, crypto_1.randomUUID)();
        return `${category.toLowerCase()}/${datePath}/${ownerId}/${uuid}.${ext}`;
    }
    getExtFromMime(mimeType) {
        const mimeMap = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp',
            'video/mp4': 'mp4',
            'video/webm': 'webm',
            'application/pdf': 'pdf',
            'application/msword': 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'application/vnd.ms-excel': 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
            'application/vnd.ms-powerpoint': 'ppt',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
            'text/plain': 'txt',
        };
        return mimeMap[mimeType] || 'bin';
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = MediaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_factory_1.StorageFactory,
        config_1.ConfigService])
], MediaService);
//# sourceMappingURL=media.service.js.map