import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "@/api/posts";
import { QUERY_KEYS } from "@/shared/lib/constants";

export function usePinPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsApi.pin(id),

    onMutate: async (pinnedId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.posts.feed });

      const previousFeed = queryClient.getQueryData(QUERY_KEYS.posts.feed);

      queryClient.setQueryData(QUERY_KEYS.posts.feed, (old: unknown) => {
        const typed = old as {
          pages: { data: { id: string; isPinned: boolean }[]; nextCursor: string | null }[];
        } | undefined;
        if (!typed?.pages) return typed;
        return {
          ...typed,
          pages: typed.pages.map((page) => ({
            ...page,
            data: page.data.map((post) =>
              post.id === pinnedId ? { ...post, isPinned: !post.isPinned } : post
            ),
          })),
        };
      });

      return { previousFeed };
    },

    onError: (_err, _pinnedId, context) => {
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
