import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { Exam } from "@/shared/types";

export const examsApi = {
  create: (data: { title: string; courseId: string; timeLimit: number; dueDate: string; description?: string; questions?: unknown }) =>
    apiClient.post<Exam>("/exams", data),
  findAll: () => apiClient.get<Exam[]>("/exams"),
  findByCourseId: (courseId: string) => apiClient.get<Exam[]>(`/exams/course/${courseId}`),
  findById: (id: string) => apiClient.get<Exam>(`/exams/${id}`),
  update: (id: string, data: Partial<Exam>) =>
    apiClient.put<Exam>(`/exams/${id}`, data),
  delete: (id: string) => apiClient.delete(`/exams/${id}`),
};

export const useExams = () =>
  useQuery({
    queryKey: QUERY_KEYS.exams.all,
    queryFn: () => examsApi.findAll().then((r) => r.data),
  });

export const useCourseExams = (courseId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.exams.byCourse(courseId),
    queryFn: () => examsApi.findByCourseId(courseId).then((r) => r.data),
    enabled: !!courseId,
  });

export const useExam = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.exams.detail(id),
    queryFn: () => examsApi.findById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: examsApi.create,
    onSuccess: (_, data) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.exams.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.exams.byCourse(data.courseId) });
    },
  });
};

export const useUpdateExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Exam> }) =>
      examsApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.exams.detail(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.exams.all });
    },
  });
};

export const useDeleteExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: examsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.exams.all });
    },
  });
};
