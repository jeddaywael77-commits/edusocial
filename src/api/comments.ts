import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { Comment } from "@/shared/types";

export const commentsApi = {
  create: (postId: string, data: { content: string; parentId?: string; mentions?: string[] }) =>
    apiClient.post<Comment>(`/posts/${postId}/comments`, data),
  findAll: (postId: string, cursor?: string, limit?: number) =>
    apiClient.get<{ data: Comment[]; nextCursor: string | null }>(`/posts/${postId}/comments`, { params: { cursor, limit } }),
  findReplies: (postId: string, commentId: string, cursor?: string, limit?: number) =>
    apiClient.get<{ data: Comment[]; nextCursor: string | null }>(`/posts/${postId}/comments/${commentId}/replies`, { params: { cursor, limit } }),
  update: (postId: string, commentId: string, data: { content: string }) =>
    apiClient.put<Comment>(`/posts/${postId}/comments/${commentId}`, data),
  delete: (postId: string, commentId: string) =>
    apiClient.delete(`/posts/${postId}/comments/${commentId}`),
};

export const usePostComments = (postId: string, limit?: number) =>
  useInfiniteQuery({
    queryKey: [...QUERY_KEYS.comments.byPost(postId), { limit }],
    queryFn: ({ pageParam }) =>
      commentsApi.findAll(postId, pageParam as string | undefined, limit).then((r) => r.data),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!postId,
  });

export const useCommentReplies = (postId: string, commentId: string, limit?: number) =>
  useInfiniteQuery({
    queryKey: [...QUERY_KEYS.comments.replies(commentId), { limit }],
    queryFn: ({ pageParam }) =>
      commentsApi.findReplies(postId, commentId, pageParam as string | undefined, limit).then((r) => r.data),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!postId && !!commentId,
  });

export const useCreateComment = (postId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { content: string; parentId?: string; mentions?: string[] }) =>
      commentsApi.create(postId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.comments.byPost(postId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.posts.detail(postId) });
    },
  });
};

export const useUpdateComment = (postId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      commentsApi.update(postId, commentId, { content }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.comments.byPost(postId) });
    },
  });
};

export const useDeleteComment = (postId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => commentsApi.delete(postId, commentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.comments.byPost(postId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.posts.detail(postId) });
    },
  });
};
