import { usePostReactions as useApiPostReactions } from "@/api/reactions";

export function usePostReactions(postId: string) {
  return useApiPostReactions(postId);
}
