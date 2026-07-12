import { useCommentReactions as useApiCommentReactions } from "@/api/reactions";

export function useCommentReactions(commentId: string) {
  return useApiCommentReactions(commentId);
}
