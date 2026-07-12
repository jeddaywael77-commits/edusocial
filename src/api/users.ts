import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { User, LeaderboardEntry } from "@/shared/types";

export const usersApi = {
  findAll: (params?: Record<string, unknown>) =>
    apiClient.get<User[]>("/users", { params }),
  findById: (id: string) => apiClient.get<User>(`/users/${id}`),
  update: (id: string, data: Partial<User>) =>
    apiClient.put<User>(`/users/${id}`, data),
  getOnline: () => apiClient.get<User[]>("/users/online"),
  getLeaderboard: (limit?: number) =>
    apiClient.get<LeaderboardEntry[]>("/users/leaderboard", { params: { limit } }),
};

export const useUsers = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: [...QUERY_KEYS.users.all, params],
    queryFn: () => usersApi.findAll(params).then((r) => r.data),
  });

export const useUser = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.users.detail(id),
    queryFn: () => usersApi.findById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      usersApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.users.detail(id) });
    },
  });
};

export const useOnlineUsers = () =>
  useQuery({
    queryKey: QUERY_KEYS.users.online,
    queryFn: () => usersApi.getOnline().then((r) => r.data),
  });

export const useUserLeaderboard = (limit?: number) =>
  useQuery({
    queryKey: [...QUERY_KEYS.users.leaderboard, limit],
    queryFn: () => usersApi.getLeaderboard(limit).then((r) => r.data),
  });
