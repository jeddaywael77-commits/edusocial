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
var MediaProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
const enums_1 = require("../../../common/enums");
const image_processor_1 = require("./image.processor");
const document_processor_1 = require("./document.processor");
let MediaProcessor = MediaProcessor_1 = class MediaProcessor {
    prisma;
    imageProcessor;
    documentProcessor;
    logger = new common_1.Logger(MediaProcessor_1.name);
    constructor(prisma, imageProcessor, documentProcessor) {
        this.prisma = prisma;
        this.imageProcessor = imageProcessor;
        this.documentProcessor = documentProcessor;
    }
    async process(job) {
        const { mediaId, mimeType } = job.data;
        this.logger.log(`Processing media: ${mediaId} (${mimeType})`);
        try {
            await this.prisma.media.update({
                where: { id: mediaId },
                data: { status: enums_1.MediaStatus.PROCESSING },
            });
            if (mimeType.startsWith('image/')) {
                await this.imageProcessor.process(mediaId);
            }
            else if (mimeType === 'application/pdf') {
                await this.documentProcessor.processPdf(mediaId);
            }
            await this.prisma.media.update({
                where: { id: mediaId },
                data: { status: enums_1.MediaStatus.READY },
            });
            this.logger.log(`Media processed successfully: ${mediaId}`);
        }
        catch (error) {
            this.logger.error(`Failed to process media ${mediaId}:`, error.message);
            await this.prisma.media.update({
                where: { id: mediaId },
                data: {
                    status: enums_1.MediaStatus.FAILED,
                    metadata: { error: error.message },
                },
            });
            throw error;
        }
    }
};
exports.MediaProcessor = MediaProcessor;
exports.MediaProcessor = MediaProcessor = MediaProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('media-processing', {
        concurrency: 2,
    }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        image_processor_1.ImageProcessor,
        document_processor_1.DocumentProcessor])
], MediaProcessor);
//# sourceMappingURL=media.processor.js.map