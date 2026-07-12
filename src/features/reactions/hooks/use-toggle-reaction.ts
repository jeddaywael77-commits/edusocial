import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reactionsApi } from "@/api/reactions";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { ToggleReactionTarget } from "../types";

export function useToggleReaction(targetType: ToggleReactionTarget, targetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (type?: string) =>
      reactionsApi.toggle({ targetType, targetId, type }).then((r) => r.data),

    onMutate: async (reactionType) => {
      if (targetType === "POST") {
        const queryKey = QUERY_KEYS.posts.feed;
        await queryClient.cancelQueries({ queryKey });

        const previousFeed = queryClient.getQueryData(queryKey);

        queryClient.setQueryData(queryKey, (old: unknown) => {
          const typed = old as {
            pages: {
              data: {
                id: string;
                reactions?: { type: string }[];
                _count: { reactions: number };
              }[];
              nextCursor: string | null;
            }[];
          } | undefined;
          if (!typed?.pages) return typed;
          return {
            ...typed,
            pages: typed.pages.map((page) => ({
              ...page,
              data: page.data.map((post) => {
                if (post.id !== targetId) return post;
                const existingReaction = post.reactions?.find(
                  (r) => r.type === reactionType
                );
                const hasReacted = !!existingReaction;
                return {
                  ...post,
                  reactions: hasReacted
                    ? (post.reactions ?? []).filter((r) => r.type !== reactionType)
                    : [...(post.reactions ?? []), { type: reactionType ?? "LIKE" }],
                  _count: {
                    ...post._count,
                    reactions: hasReacted
                      ? Math.max(0, post._count.reactions - 1)
                      : post._count.reactions + 1,
                  },
                };
              }),
            })),
          };
        });

        return { previousFeed };
      }
      return undefined;
    },

    onError: (_err, _type, context) => {
      if (targetType === "POST" && context?.previousFeed) {
        queryClient.setQueryData(QUERY_KEYS.posts.feed, context.previousFeed);
      }
    },

    onSettled: () => {
      if (targetType === "POST") {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.feed });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.detail(targetId) });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reactions.byPost(targetId) });
      } else {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reactions.byComment(targetId) });
      }
    },
  });
}
