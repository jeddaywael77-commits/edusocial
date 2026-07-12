import { PrismaService } from '../../database/prisma.service';
export declare class MarketplaceService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(sellerId: string, data: {
        title: string;
        description?: string;
        price: number;
        category: string;
        images?: string[];
        condition?: string;
        currency?: string;
    }): Promise<{
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
    update(id: string, userId: string, data: {
        title?: string;
        description?: string;
        price?: number;
        isAvailable?: boolean;
        images?: string[];
    }): Promise<{
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
