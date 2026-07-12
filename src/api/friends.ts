import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { User } from "@/shared/types";

export const friendsApi = {
  getFriends: () => apiClient.get<User[]>("/friends"),
  getRequests: () => apiClient.get("/friends/requests"),
  sendRequest: (receiverId: string) =>
    apiClient.post("/friends/request", { receiverId }),
  acceptRequest: (id: string) => apiClient.post(`/friends/request/${id}/accept`),
  declineRequest: (id: string) => apiClient.post(`/friends/request/${id}/decline`),
  removeFriend: (friendId: string) => apiClient.delete(`/friends/${friendId}`),
};

export const useFriends = () =>
  useQuery({
    queryKey: QUERY_KEYS.friends.all,
    queryFn: () => friendsApi.getFriends().then((r) => r.data),
  });

export const useFriendRequests = () =>
  useQuery({
    queryKey: QUERY_KEYS.friends.requests,
    queryFn: () => friendsApi.getRequests().then((r) => r.data),
  });

export const useSendFriendRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: friendsApi.sendRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.friends.requests });
    },
  });
};

export const useAcceptFriendRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: friendsApi.acceptRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.friends.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.friends.requests });
    },
  });
};

export const useDeclineFriendRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: friendsApi.declineRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.friends.requests });
    },
  });
};

export const useRemoveFriend = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: friendsApi.removeFriend,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.friends.all });
    },
  });
};
