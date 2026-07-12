export interface CreateMarketplaceItemData { title: string; price: number; category: string; description?: string; images?: string[]; condition?: string; currency?: string; }
export interface UpdateMarketplaceItemData { title?: string; price?: number; description?: string; images?: string[]; isAvailable?: boolean; }
