import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { Notification } from "@/shared/types";

export const notificationsApi = {
  findAll: () => apiClient.get<Notification[]>("/notifications"),
  findUnread: () => apiClient.get<Notification[]>("/notifications/unread"),
  getUnreadCount: () => apiClient.get<{ count: number }>("/notifications/unread/count"),
  markAsRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.patch("/notifications/read-all"),
  delete: (id: string) => apiClient.delete(`/notifications/${id}`),
};

export const useNotifications = () =>
  useQuery({
    queryKey: QUERY_KEYS.notifications.all,
    queryFn: () => notificationsApi.findAll().then((r) => r.data),
  });

export const useUnreadNotifications = () =>
  useQuery({
    queryKey: QUERY_KEYS.notifications.unread,
    queryFn: () => notificationsApi.findUnread().then((r) => r.data),
  });

export const useUnreadCount = () =>
  useQuery({
    queryKey: QUERY_KEYS.notifications.unreadCount,
    queryFn: () => notificationsApi.getUnreadCount().then((r) => r.data),
  });

export const useMarkAsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications.unread });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications.unreadCount });
    },
  });
};

export const useMarkAllAsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications.unread });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications.unreadCount });
    },
  });
};

export const useDeleteNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications.unread });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications.unreadCount });
    },
  });
};
