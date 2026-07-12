import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { Story } from "@/shared/types";

export const storiesApi = {
  create: (data: { image: string; text?: string }) =>
    apiClient.post<Story>("/stories", data),
  findAll: () => apiClient.get<Story[]>("/stories"),
  findById: (id: string) => apiClient.get<Story>(`/stories/${id}`),
  markAsViewed: (id: string) => apiClient.post(`/stories/${id}/view`),
  delete: (id: string) => apiClient.delete(`/stories/${id}`),
};

export const useStories = () =>
  useQuery({
    queryKey: QUERY_KEYS.stories.all,
    queryFn: () => storiesApi.findAll().then((r) => r.data),
  });

export const useStory = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.stories.detail(id),
    queryFn: () => storiesApi.findById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateStory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: storiesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.stories.all });
    },
  });
};

export const useViewStory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: storiesApi.markAsViewed,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.stories.all });
    },
  });
};

export const useDeleteStory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: storiesApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.stories.all });
    },
  });
};
