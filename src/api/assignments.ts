import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { Assignment } from "@/shared/types";

export const assignmentsApi = {
  create: (data: { title: string; dueDate: string; description?: string; maxScore?: number; courseId?: string }) =>
    apiClient.post<Assignment>("/assignments", data),
  findAll: () => apiClient.get<Assignment[]>("/assignments"),
  findById: (id: string) => apiClient.get<Assignment>(`/assignments/${id}`),
  update: (id: string, data: { title?: string; description?: string; dueDate?: string; maxScore?: number }) =>
    apiClient.put<Assignment>(`/assignments/${id}`, data),
  delete: (id: string) => apiClient.delete(`/assignments/${id}`),
};

export const useAssignments = () =>
  useQuery({
    queryKey: QUERY_KEYS.assignments.all,
    queryFn: () => assignmentsApi.findAll().then((r) => r.data),
  });

export const useAssignment = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.assignments.detail(id),
    queryFn: () => assignmentsApi.findById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateAssignment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: assignmentsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.assignments.all });
    },
  });
};

export const useUpdateAssignment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title?: string; description?: string; dueDate?: string; maxScore?: number } }) =>
      assignmentsApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.assignments.detail(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.assignments.all });
    },
  });
};

export const useDeleteAssignment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: assignmentsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.assignments.all });
    },
  });
};
