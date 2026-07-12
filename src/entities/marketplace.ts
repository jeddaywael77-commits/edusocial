import type { MarketplaceItem } from "@/shared/types";

export function isAvailable(item: MarketplaceItem): boolean {
  return item.isAvailable;
}

export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

export function getConditionColor(condition: string): string {
  switch (condition) {
    case "NEW":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "LIKE_NEW":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "GOOD":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "FAIR":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

export function getCategoryIcon(category: string): string {
  switch (category) {
    case "BOOKS":
      return "book-open";
    case "ELECTRONICS":
      return "smartphone";
    case "SUPPLIES":
      return "package";
    case "CLOTHING":
      return "shirt";
    default:
      return "tag";
  }
}

export function isSeller(item: MarketplaceItem, userId: string): boolean {
  return item.sellerId === userId;
}
