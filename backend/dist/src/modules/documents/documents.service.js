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
var DocumentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let DocumentsService = DocumentsService_1 = class DocumentsService {
    prisma;
    logger = new common_1.Logger(DocumentsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(uploadedById, data) {
        return this.prisma.document.create({
            data: {
                name: data.name,
                type: data.type,
                size: data.size,
                url: data.url,
                thumbnail: data.thumbnail,
                tags: data.tags ?? [],
                uploadedById,
            },
            include: {
                uploadedBy: { select: { id: true, name: true, avatar: true } },
            },
        });
    }
    async findAll() {
        return this.prisma.document.findMany({
            include: {
                uploadedBy: { select: { id: true, name: true, avatar: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return this.prisma.document.findUnique({
            where: { id },
            include: {
                uploadedBy: { select: { id: true, name: true, avatar: true } },
            },
        });
    }
    async findByUserId(userId) {
        return this.prisma.document.findMany({
            where: { uploadedById: userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async delete(id, userId) {
        const doc = await this.prisma.document.findUnique({ where: { id } });
        if (!doc || doc.uploadedById !== userId)
            throw new Error('Not authorized');
        return this.prisma.document.delete({ where: { id } });
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = DocumentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map