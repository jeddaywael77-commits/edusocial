import { MarketplaceService } from './marketplace.service';
declare class CreateMarketplaceItemDto {
    title: string;
    price: number;
    category: string;
    description?: string;
    images?: string[];
    condition?: string;
    currency?: string;
}
declare class UpdateMarketplaceItemDto {
    title?: string;
    description?: string;
    price?: number;
    isAvailable?: boolean;
    images?: string[];
}
export declare class MarketplaceController {
    private readonly marketplaceService;
    constructor(marketplaceService: MarketplaceService);
    create(userId: string, dto: CreateMarketplaceItemDto): Promise<{
        seller: {
            id: string;
            name: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        category: string;
        images: string[];
        price: number;
        currency: string;
        condition: string;
        isAvailable: boolean;
        sellerId: string;
    }>;
    findAll(): Promise<({
        seller: {
            id: string;
            name: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        category: string;
        images: string[];
        price: number;
        currency: string;
        condition: string;
        isAvailable: boolean;
        sellerId: string;
    })[]>;
    findById(id: string): Promise<({
        seller: {
            id: string;
            name: string;
            avatar: string | null;
            isOnline: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        category: string;
        images: string[];
        price: number;
        currency: string;
        condition: string;
        isAvailable: boolean;
        sellerId: string;
    }) | null>;
    findBySeller(sellerId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        category: string;
        images: string[];
        price: number;
        currency: string;
        condition: string;
        isAvailable: boolean;
        sellerId: string;
    }[]>;
    update(id: string, userId: string, dto: UpdateMarketplaceItemDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        category: string;
        images: string[];
        price: number;
        currency: string;
        condition: string;
        isAvailable: boolean;
        sellerId: string;
    }>;
    delete(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        category: string;
        images: string[];
        price: number;
        currency: string;
        condition: string;
        isAvailable: boolean;
        sellerId: string;
    }>;
}
export {};
