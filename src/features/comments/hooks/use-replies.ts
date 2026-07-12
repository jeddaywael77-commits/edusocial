import { useCommentReplies as useApiCommentReplies } from "@/api/comments";
import type { ReplyParams } from "../types";

export function useReplies(postId: string, commentId: string, limit?: number) {
  return useApiCommentReplies(postId, commentId, limit);
}
