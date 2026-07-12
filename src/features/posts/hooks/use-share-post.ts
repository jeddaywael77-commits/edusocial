import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "@/api/posts";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { SharePostData } from "../types";

export function useSharePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: SharePostData }) =>
      postsApi.share(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.feed });
    },
  });
}
