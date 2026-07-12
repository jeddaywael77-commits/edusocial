import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { Post } from "@/shared/types";

export const postsApi = {
  create: (data: { content: string; type?: string; visibility?: string; images?: string[]; hashtags?: string[]; groupId?: string; courseId?: string }) =>
    apiClient.post<Post>("/posts", data),
  findAll: (params?: Record<string, unknown>) =>
    apiClient.get<Post[]>("/posts", { params }),
  getFeed: (cursor?: string, limit?: number) =>
    apiClient.get<{ data: Post[]; nextCursor: string | null }>("/posts/feed", { params: { cursor, limit } }),
  getTrending: (limit?: number) =>
    apiClient.get<Post[]>("/posts/trending", { params: { limit } }),
  findById: (id: string) => apiClient.get<Post>(`/posts/${id}`),
  update: (id: string, data: Partial<Post>) =>
    apiClient.put<Post>(`/posts/${id}`, data),
  delete: (id: string) => apiClient.delete(`/posts/${id}`),
  pin: (id: string) => apiClient.post(`/posts/${id}/pin`),
  share: (id: string, data?: { groupId?: string; courseId?: string }) =>
    apiClient.post(`/posts/${id}/share`, data),
  save: (id: string) => apiClient.post(`/posts/${id}/save`),
  report: (id: string, data: { reason: string }) =>
    apiClient.post(`/posts/${id}/report`, data),
};

export const usePosts = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: [...QUERY_KEYS.posts.all, params],
    queryFn: () => postsApi.findAll(params).then((r) => r.data),
  });

export const useFeedPosts = (limit?: number) =>
  useInfiniteQuery({
    queryKey: QUERY_KEYS.posts.feed,
    queryFn: ({ pageParam }) => postsApi.getFeed(pageParam as string | undefined, limit).then((r) => r.data),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

export const useTrendingPosts = (limit?: number) =>
  useQuery({
    queryKey: [...QUERY_KEYS.posts.trending, limit],
    queryFn: () => postsApi.getTrending(limit).then((r) => r.data),
  });

export const usePost = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.posts.detail(id),
    queryFn: () => postsApi.findById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreatePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.posts.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.posts.feed });
    },
  });
};

export const useUpdatePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Post> }) =>
      postsApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.posts.detail(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.posts.all });
    },
  });
};

export const useDeletePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.posts.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.posts.feed });
    },
  });
};

export const usePinPost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postsApi.pin,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.posts.all });
    },
  });
};

export const useSharePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: { groupId?: string; courseId?: string } }) =>
      postsApi.share(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.posts.all });
    },
  });
};

export const useSavePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postsApi.save,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.posts.all });
    },
  });
};

export const useReportPost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      postsApi.report(id, { reason }),
  });
};
