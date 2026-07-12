import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "@/api/posts";
import { QUERY_KEYS } from "@/shared/lib/constants";

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsApi.delete(id),

    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.posts.feed });

      const previousFeed = queryClient.getQueryData(QUERY_KEYS.posts.feed);

      queryClient.setQueryData(QUERY_KEYS.posts.feed, (old: unknown) => {
        const typed = old as { pages: { data: { id: string }[]; nextCursor: string | null }[] } | undefined;
        if (!typed?.pages) return typed;
        return {
          ...typed,
          pages: typed.pages.map((page) => ({
            ...page,
            data: page.data.filter((post) => post.id !== deletedId),
          })),
        };
      });

      return { previousFeed, deletedId };
    },

    onError: (_err, _deletedId, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(QUERY_KEYS.posts.feed, context.previousFeed);
      }
    },

    onSettled: (_data, _err, deletedId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.feed });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.all });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.posts.detail(deletedId) });
    },
  });
}
