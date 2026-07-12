import { useTrendingPosts as useApiTrendingPosts } from "@/api/posts";
import type { TrendingParams } from "../types";

export function useTrending(limit?: number) {
  return useApiTrendingPosts(limit);
}
