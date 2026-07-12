import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "@/api/posts";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { Post } from "@/shared/types";
import type { UpdatePostData } from "../types";

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostData }) =>
      postsApi.update(id, data).then((r) => r.data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.posts.detail(id) });

      const previousPost = queryClient.getQueryData<Post>(QUERY_KEYS.posts.detail(id));

      if (previousPost) {
        queryClient.setQueryData<Post>(QUERY_KEYS.posts.detail(id), {
          ...previousPost,
          ...data,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousPost, id };
    },

    onError: (_err, { id }, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(QUERY_KEYS.posts.detail(id), context.previousPost);
      }
    },

    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.detail(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.feed });
    },
  });
}
