import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "@/api/comments";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { Comment } from "@/shared/types";
import type { CreateCommentData } from "../types";

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentData) =>
      commentsApi.create(postId, data).then((r) => r.data),

    onMutate: async (newComment) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.comments.byPost(postId),
      });

      const previousComments = queryClient.getQueryData(
        QUERY_KEYS.comments.byPost(postId)
      );

      const optimisticComment: Comment = {
        id: `temp-comment-${Date.now()}`,
        content: newComment.content,
        authorId: "current-user",
        postId,
        parentId: newComment.parentId ?? null,
        depth: newComment.parentId ? 1 : 0,
        isDeleted: false,
        isEdited: false,
        mentions: newComment.mentions ?? [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: "current-user",
          name: "You",
          avatar: null,
          role: "STUDENT",
          isOnline: true,
          level: 1,
        },
        _count: { replies: 0, reactions: 0 },
      };

      queryClient.setQueryData(
        QUERY_KEYS.comments.byPost(postId),
        (old: unknown) => {
          const typed = old as { pages: { data: Comment[]; nextCursor: string | null }[] } | undefined;
          if (!typed?.pages?.[0]) return old;
          return {
            ...typed,
            pages: [
              {
                ...typed.pages[0],
                data: [...typed.pages[0].data, optimisticComment],
              },
              ...typed.pages.slice(1),
            ],
          };
        }
      );

      return { previousComments };
    },

    onError: (_err, _newComment, context) => {
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
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.detail(postId) });
    },
  });
}
