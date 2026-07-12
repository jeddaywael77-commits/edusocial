import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "@/api/comments";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { Comment } from "@/shared/types";
import type { UpdateCommentData } from "../types";

export function useUpdateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      commentsApi.update(postId, commentId, { content }).then((r) => r.data),

    onMutate: async ({ commentId, content }) => {
      const queryKey = QUERY_KEYS.comments.byPost(postId);
      await queryClient.cancelQueries({ queryKey });

      const previousComments = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: unknown) => {
        const typed = old as { pages: { data: (Comment & { id: string })[]; nextCursor: string | null }[] } | undefined;
        if (!typed?.pages) return old;
        return {
          ...typed,
          pages: typed.pages.map((page) => ({
            ...page,
            data: page.data.map((comment) =>
              comment.id === commentId
                ? { ...comment, content, isEdited: true, updatedAt: new Date().toISOString() }
                : comment
            ),
          })),
        };
      });

      return { previousComments };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          QUERY_KEYS.comments.byPost(postId),
          context.previousComments
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.comments.byPost(postId),
      });
    },
  });
}
