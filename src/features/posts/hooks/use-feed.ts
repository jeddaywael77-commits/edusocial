import { useFeedPosts as useApiFeedPosts } from "@/api/posts";
import type { FeedParams } from "../types";

export function useFeed(limit?: number) {
  return useApiFeedPosts(limit);
}
