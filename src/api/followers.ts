import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { User } from "@/shared/types";

export const followersApi = {
  follow: (userId: string) => apiClient.post(`/followers/${userId}/follow`),
  unfollow: (userId: string) => apiClient.delete(`/followers/${userId}/unfollow`),
  getFollowers: (userId: string) => apiClient.get<User[]>(`/followers/${userId}`),
  getFollowing: (userId: string) => apiClient.get<User[]>(`/followers/${userId}/following`),
  getFollowerCount: (userId: string) => apiClient.get<{ count: number }>(`/followers/${userId}/count`),
};

export const useFollowers = (userId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.followers.byUser(userId),
    queryFn: () => followersApi.getFollowers(userId).then((r) => r.data),
    enabled: !!userId,
  });

export const useFollowing = (userId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.followers.following(userId),
    queryFn: () => followersApi.getFollowing(userId).then((r) => r.data),
    enabled: !!userId,
  });

export const useFollowerCount = (userId: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.followers.byUser(userId), "count"],
    queryFn: () => followersApi.getFollowerCount(userId).then((r) => r.data),
    enabled: !!userId,
  });

export const useFollow = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: followersApi.follow,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.followers.byUser("") });
    },
  });
};

export const useUnfollow = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: followersApi.unfollow,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.followers.byUser("") });
    },
  });
};
