import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { Group } from "@/shared/types";

export const groupsApi = {
  create: (data: { name: string; description?: string; type?: string; cover?: string }) =>
    apiClient.post<Group>("/groups", data),
  findAll: () => apiClient.get<Group[]>("/groups"),
  findById: (id: string) => apiClient.get<Group>(`/groups/${id}`),
  update: (id: string, data: { name?: string; description?: string; cover?: string }) =>
    apiClient.put<Group>(`/groups/${id}`, data),
  delete: (id: string) => apiClient.delete(`/groups/${id}`),
  join: (id: string) => apiClient.post(`/groups/${id}/join`),
  leave: (id: string) => apiClient.delete(`/groups/${id}/leave`),
};

export const useGroups = () =>
  useQuery({
    queryKey: QUERY_KEYS.groups.all,
    queryFn: () => groupsApi.findAll().then((r) => r.data),
  });

export const useGroup = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.groups.detail(id),
    queryFn: () => groupsApi.findById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: groupsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.groups.all });
    },
  });
};

export const useUpdateGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; description?: string; cover?: string } }) =>
      groupsApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.groups.detail(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.groups.all });
    },
  });
};

export const useDeleteGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: groupsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.groups.all });
    },
  });
};

export const useJoinGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: groupsApi.join,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.groups.all });
    },
  });
};

export const useLeaveGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: groupsApi.leave,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.groups.all });
    },
  });
};
