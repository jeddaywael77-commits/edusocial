import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { Submission } from "@/shared/types";

export const submissionsApi = {
  create: (data: { assignmentId: string; content?: string; fileUrl?: string }) =>
    apiClient.post<Submission>("/submissions", data),
  findAll: () => apiClient.get<Submission[]>("/submissions"),
  findByAssignmentId: (assignmentId: string) =>
    apiClient.get<Submission[]>(`/submissions/assignment/${assignmentId}`),
  findById: (id: string) => apiClient.get<Submission>(`/submissions/${id}`),
  grade: (id: string, data: { score: number; feedback?: string }) =>
    apiClient.patch<Submission>(`/submissions/${id}/grade`, data),
};

export const useSubmissions = () =>
  useQuery({
    queryKey: QUERY_KEYS.submissions.all,
    queryFn: () => submissionsApi.findAll().then((r) => r.data),
  });

export const useAssignmentSubmissions = (assignmentId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.submissions.byAssignment(assignmentId),
    queryFn: () => submissionsApi.findByAssignmentId(assignmentId).then((r) => r.data),
    enabled: !!assignmentId,
  });

export const useSubmission = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.submissions.detail(id),
    queryFn: () => submissionsApi.findById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateSubmission = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: submissionsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.submissions.all });
    },
  });
};

export const useGradeSubmission = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { score: number; feedback?: string } }) =>
      submissionsApi.grade(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.submissions.detail(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.submissions.all });
    },
  });
};
