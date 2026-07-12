import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "@/api/posts";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { Post } from "@/shared/types";
import type { CreatePostData } from "../types";

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => postsApi.create(data).then((r) => r.data),

    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.posts.feed });

      const previousFeed = queryClient.getQueryData(QUERY_KEYS.posts.feed);

      queryClient.setQueryData(QUERY_KEYS.posts.feed, (old: unknown) => {
        const typed = old as { pages: { data: Post[]; nextCursor: string | null }[] } | undefined;
        if (!typed?.pages?.[0]) return typed;
        const optimisticPost: Post = {
          id: `temp-${Date.now()}`,
          content: newPost.content,
          type: newPost.type ?? "TEXT",
          visibility: newPost.visibility ?? "PUBLIC",
          status: "PUBLISHED",
          images: newPost.images ?? [],
          video: null,
          pdfUrl: null,
          pdfName: null,
          hashtags: newPost.hashtags ?? [],
          mentions: [],
          isPinned: false,
          isReported: false,
          shareCount: 0,
          reportCount: 0,
          authorId: "current-user",
          groupId: newPost.groupId ?? null,
          courseId: newPost.courseId ?? null,
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
          _count: { comments: 0, reactions: 0, shares: 0, saves: 0 },
        };
        return {
          ...typed,
          pages: [{ ...typed.pages[0], data: [optimisticPost, ...typed.pages[0].data] }, ...typed.pages.slice(1)],
        };
      });

      return { previousFeed };
    },

    onError: (_err, _newPost, context) => {
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
