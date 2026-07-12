import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "@/api/posts";
import { QUERY_KEYS } from "@/shared/lib/constants";

export function useSavePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsApi.save(id),

    onMutate: async (savedId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.posts.feed });

      const previousFeed = queryClient.getQueryData(QUERY_KEYS.posts.feed);

      queryClient.setQueryData(QUERY_KEYS.posts.feed, (old: unknown) => {
        const typed = old as {
          pages: {
            data: {
              id: string;
              _count: { saves: number };
              saves?: { id: string }[];
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
              if (post.id !== savedId) return post;
              const isSaved = post.saves && post.saves.length > 0;
              return {
                ...post,
                _count: {
                  ...post._count,
                  saves: isSaved ? post._count.saves - 1 : post._count.saves + 1,
                },
                saves: isSaved ? [] : [{ id: `temp-save-${Date.now()}` }],
              };
            }),
          })),
        };
      });

      return { previousFeed };
    },

    onError: (_err, _savedId, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(QUERY_KEYS.posts.feed, context.previousFeed);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.feed });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.all });
    },
  });
}
