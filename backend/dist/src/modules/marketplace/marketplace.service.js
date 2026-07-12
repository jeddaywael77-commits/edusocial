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
var MarketplaceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let MarketplaceService = MarketplaceService_1 = class MarketplaceService {
    prisma;
    logger = new common_1.Logger(MarketplaceService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(sellerId, data) {
        return this.prisma.marketplaceItem.create({
            data: {
                title: data.title,
                description: data.description,
                price: data.price,
                category: data.category,
                images: data.images ?? [],
                condition: data.condition ?? 'used',
                currency: data.currency ?? 'USD',
                sellerId,
            },
            include: { seller: { select: { id: true, name: true, avatar: true } } },
        });
    }
    async findAll() {
        return this.prisma.marketplaceItem.findMany({
            where: { isAvailable: true },
            include: { seller: { select: { id: true, name: true, avatar: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return this.prisma.marketplaceItem.findUnique({
            where: { id },
            include: {
                seller: {
                    select: { id: true, name: true, avatar: true, isOnline: true },
                },
            },
        });
    }
    async findBySeller(sellerId) {
        return this.prisma.marketplaceItem.findMany({
            where: { sellerId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async update(id, userId, data) {
        const item = await this.prisma.marketplaceItem.findUnique({
            where: { id },
        });
        if (!item || item.sellerId !== userId)
            throw new Error('Not authorized');
        return this.prisma.marketplaceItem.update({ where: { id }, data });
    }
    async delete(id, userId) {
        const item = await this.prisma.marketplaceItem.findUnique({
            where: { id },
        });
        if (!item || item.sellerId !== userId)
            throw new Error('Not authorized');
        return this.prisma.marketplaceItem.delete({ where: { id } });
    }
};
exports.MarketplaceService = MarketplaceService;
exports.MarketplaceService = MarketplaceService = MarketplaceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MarketplaceService);
//# sourceMappingURL=marketplace.service.js.map