import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { NewsArticle, NewsComment } from "@/shared/types";

export const newsApi = {
  getArticles: (params?: { category?: string; search?: string; cursor?: string; limit?: number }) =>
    apiClient.get<{ data: NewsArticle[]; nextCursor: string | null }>("/news", { params }),
  getLatest: (limit?: number) =>
    apiClient.get<NewsArticle[]>("/news/latest", { params: { limit } }),
  getById: (id: string) =>
    apiClient.get<NewsArticle>(`/news/${id}`),
  create: (data: { title: string; content: string; summary?: string; coverImage?: string; category?: string; isPublished?: boolean }) =>
    apiClient.post<NewsArticle>("/news", data),
  update: (id: string, data: Partial<NewsArticle>) =>
    apiClient.put<NewsArticle>(`/news/${id}`, data),
  delete: (id: string) =>
    apiClient.delete(`/news/${id}`),
  toggleLike: (id: string) =>
    apiClient.post<{ liked: boolean }>(`/news/${id}/like`),
  addComment: (id: string, content: string) =>
    apiClient.post<NewsComment>(`/news/${id}/comments`, { content }),
  getComments: (id: string, cursor?: string) =>
    apiClient.get<NewsComment[]>(`/news/${id}/comments`, { params: { cursor } }),
};

export const useNewsArticles = (params?: { category?: string; search?: string; limit?: number }) =>
  useQuery({
    queryKey: [...QUERY_KEYS.news.all, params],
    queryFn: () => newsApi.getArticles(params).then((r) => r.data),
  });

export const useLatestNews = (limit = 5) =>
  useQuery({
    queryKey: [...QUERY_KEYS.news.latest, limit],
    queryFn: () => newsApi.getLatest(limit).then((r) => r.data),
  });

export const useNewsArticle = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.news.detail(id),
    queryFn: () => newsApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateNewsArticle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: newsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.news.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.news.latest });
    },
  });
};

export const useUpdateNewsArticle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewsArticle> }) =>
      newsApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.news.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.news.detail(id) });
    },
  });
};

export const useDeleteNewsArticle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: newsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.news.all });
    },
  });
};

export const useToggleNewsLike = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: newsApi.toggleLike,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.news.detail(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.news.all });
    },
  });
};

export const useAddNewsComment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      newsApi.addComment(id, content),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.news.comments(id) });
    },
  });
};

export const useNewsComments = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.news.comments(id),
    queryFn: () => newsApi.getComments(id).then((r) => r.data),
    enabled: !!id,
  });
