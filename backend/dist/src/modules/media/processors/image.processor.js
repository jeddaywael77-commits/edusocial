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
var ImageProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageProcessor = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../../database/prisma.service");
const storage_factory_1 = require("../storage/storage.factory");
const sharp = require('sharp');
let ImageProcessor = ImageProcessor_1 = class ImageProcessor {
    prisma;
    storageFactory;
    configService;
    logger = new common_1.Logger(ImageProcessor_1.name);
    constructor(prisma, storageFactory, configService) {
        this.prisma = prisma;
        this.storageFactory = storageFactory;
        this.configService = configService;
    }
    async process(mediaId) {
        const media = await this.prisma.media.findUnique({
            where: { id: mediaId },
        });
        if (!media)
            throw new Error(`Media not found: ${mediaId}`);
        const storage = this.storageFactory.getProviderInstance();
        const bucket = media.bucket ||
            this.configService.get('media.bucket') ||
            'edusocial';
        const key = media.key;
        try {
            const response = await fetch(media.url);
            if (!response.ok)
                throw new Error(`Failed to fetch image: ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const metadata = await sharp(buffer).metadata();
            const width = metadata.width || undefined;
            const height = metadata.height || undefined;
            const thumbnailWidth = this.configService.get('media.thumbnailWidth') || 300;
            const thumbnailHeight = this.configService.get('media.thumbnailHeight') || 300;
            const imageQuality = this.configService.get('media.imageQuality') || 80;
            const generateWebp = this.configService.get('media.generateWebp') !== false;
            const thumbnailBuffer = await sharp(buffer)
                .resize(thumbnailWidth, thumbnailHeight, { fit: 'cover' })
                .jpeg({ quality: 80 })
                .toBuffer();
            const thumbnailKey = key.replace(/(\.[^.]+)$/, '-thumb.jpg');
            const thumbnailResult = await storage.upload(thumbnailBuffer, {
                bucket,
                key: thumbnailKey,
                contentType: 'image/jpeg',
            });
            const maxWidth = this.configService.get('media.maxWidth') || 2048;
            const maxHeight = this.configService.get('media.maxHeight') || 2048;
            const compressedBuffer = await sharp(buffer)
                .resize(maxWidth, maxHeight, {
                fit: 'inside',
                withoutEnlargement: true,
            })
                .jpeg({ quality: imageQuality })
                .toBuffer();
            const compressedKey = key.replace(/(\.[^.]+)$/, '-compressed.jpg');
            const compressedResult = await storage.upload(compressedBuffer, {
                bucket,
                key: compressedKey,
                contentType: 'image/jpeg',
            });
            let webpUrl;
            if (generateWebp &&
                (metadata.format === 'jpeg' || metadata.format === 'png')) {
                const webpBuffer = await sharp(buffer)
                    .resize(maxWidth, maxHeight, {
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                    .webp({ quality: imageQuality })
                    .toBuffer();
                const webpKey = key.replace(/(\.[^.]+)$/, '.webp');
                const webpResult = await storage.upload(webpBuffer, {
                    bucket,
                    key: webpKey,
                    contentType: 'image/webp',
                });
                webpUrl = webpResult.url;
            }
            await this.prisma.media.update({
                where: { id: mediaId },
                data: {
                    width,
                    height,
                    thumbnailUrl: thumbnailResult.url,
                    compressedUrl: compressedResult.url,
                    webpUrl,
                    metadata: {
                        originalWidth: metadata.width,
                        originalHeight: metadata.height,
                        format: metadata.format,
                        channels: metadata.channels,
                        density: metadata.density,
                        hasAlpha: metadata.hasAlpha,
                        size: metadata.size,
                    },
                },
            });
            this.logger.log(`Image processed: ${mediaId} (${width}x${height})`);
        }
        catch (error) {
            this.logger.error(`Image processing failed for ${mediaId}:`, error.message);
            throw error;
        }
    }
    async stripMetadata(buffer) {
        return sharp(buffer).toBuffer();
    }
    async resize(buffer, width, height) {
        return sharp(buffer).resize(width, height, { fit: 'inside' }).toBuffer();
    }
    async generateWebp(buffer, quality = 80) {
        return sharp(buffer).webp({ quality }).toBuffer();
    }
    async getImageMetadata(buffer) {
        return sharp(buffer).metadata();
    }
};
exports.ImageProcessor = ImageProcessor;
exports.ImageProcessor = ImageProcessor = ImageProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_factory_1.StorageFactory,
        config_1.ConfigService])
], ImageProcessor);
//# sourceMappingURL=image.processor.js.map