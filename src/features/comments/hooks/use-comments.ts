import { usePostComments as useApiPostComments } from "@/api/comments";
import type { CommentParams } from "../types";

export function useComments(postId: string, limit?: number) {
  return useApiPostComments(postId, limit);
}
