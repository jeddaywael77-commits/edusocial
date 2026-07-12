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
var DocumentProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentProcessor = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let DocumentProcessor = DocumentProcessor_1 = class DocumentProcessor {
    prisma;
    logger = new common_1.Logger(DocumentProcessor_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async processPdf(mediaId) {
        const media = await this.prisma.media.findUnique({
            where: { id: mediaId },
        });
        if (!media)
            throw new Error(`Media not found: ${mediaId}`);
        try {
            const response = await fetch(media.url);
            if (!response.ok)
                throw new Error(`Failed to fetch PDF: ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            let pageCount;
            let metadata = {};
            try {
                const pdfParse = require('pdf-parse');
                const pdfData = await pdfParse(buffer);
                pageCount = pdfData.numpages;
                metadata = {
                    title: pdfData.info?.Title,
                    author: pdfData.info?.Author,
                    subject: pdfData.info?.Subject,
                    creator: pdfData.info?.Creator,
                    producer: pdfData.info?.Producer,
                    creationDate: pdfData.info?.CreationDate,
                    modDate: pdfData.info?.ModDate,
                    keywords: pdfData.info?.Keywords,
                    pdfVersion: pdfData.info?.PDFFormatVersion,
                };
            }
            catch (pdfError) {
                this.logger.warn(`PDF parse failed for ${mediaId}: ${pdfError.message}`);
            }
            await this.prisma.media.update({
                where: { id: mediaId },
                data: {
                    pageCount,
                    metadata: {
                        ...metadata,
                        processedAt: new Date().toISOString(),
                    },
                },
            });
            this.logger.log(`Document processed: ${mediaId} (${pageCount} pages)`);
        }
        catch (error) {
            this.logger.error(`Document processing failed for ${mediaId}:`, error.message);
            throw error;
        }
    }
    async processWord(mediaId) {
        const media = await this.prisma.media.findUnique({
            where: { id: mediaId },
        });
        if (!media)
            throw new Error(`Media not found: ${mediaId}`);
        await this.prisma.media.update({
            where: { id: mediaId },
            data: {
                metadata: {
                    processedAt: new Date().toISOString(),
                    format: media.extension,
                },
            },
        });
        this.logger.log(`Word document processed: ${mediaId}`);
    }
    async processExcel(mediaId) {
        const media = await this.prisma.media.findUnique({
            where: { id: mediaId },
        });
        if (!media)
            throw new Error(`Media not found: ${mediaId}`);
        await this.prisma.media.update({
            where: { id: mediaId },
            data: {
                metadata: {
                    processedAt: new Date().toISOString(),
                    format: media.extension,
                },
            },
        });
        this.logger.log(`Excel document processed: ${mediaId}`);
    }
    async processPowerpoint(mediaId) {
        const media = await this.prisma.media.findUnique({
            where: { id: mediaId },
        });
        if (!media)
            throw new Error(`Media not found: ${mediaId}`);
        await this.prisma.media.update({
            where: { id: mediaId },
            data: {
                metadata: {
                    processedAt: new Date().toISOString(),
                    format: media.extension,
                },
            },
        });
        this.logger.log(`PowerPoint document processed: ${mediaId}`);
    }
    async scanForVirus(mediaId) {
        this.logger.log(`Virus scan hook called for ${mediaId} (not implemented)`);
        return { clean: true, details: 'Virus scanning not configured' };
    }
    async prepareOcr(mediaId) {
        this.logger.log(`OCR preparation hook called for ${mediaId} (not implemented)`);
    }
};
exports.DocumentProcessor = DocumentProcessor;
exports.DocumentProcessor = DocumentProcessor = DocumentProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentProcessor);
//# sourceMappingURL=document.processor.js.map