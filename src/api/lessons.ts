import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { Lesson } from "@/shared/types";

export const lessonsApi = {
  create: (data: { title: string; courseId: string; content?: string; videoUrl?: string; pdfUrl?: string; duration?: number; order?: number }) =>
    apiClient.post<Lesson>("/lessons", data),
  findAll: () => apiClient.get<Lesson[]>("/lessons"),
  findByCourseId: (courseId: string) => apiClient.get<Lesson[]>(`/lessons/course/${courseId}`),
  findById: (id: string) => apiClient.get<Lesson>(`/lessons/${id}`),
  update: (id: string, data: Partial<Lesson>) =>
    apiClient.put<Lesson>(`/lessons/${id}`, data),
  delete: (id: string) => apiClient.delete(`/lessons/${id}`),
};

export const useLessons = () =>
  useQuery({
    queryKey: QUERY_KEYS.lessons.all,
    queryFn: () => lessonsApi.findAll().then((r) => r.data),
  });

export const useCourseLessons = (courseId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.lessons.byCourse(courseId),
    queryFn: () => lessonsApi.findByCourseId(courseId).then((r) => r.data),
    enabled: !!courseId,
  });

export const useLesson = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.lessons.detail(id),
    queryFn: () => lessonsApi.findById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateLesson = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: lessonsApi.create,
    onSuccess: (_, data) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.lessons.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.lessons.byCourse(data.courseId) });
    },
  });
};

export const useUpdateLesson = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lesson> }) =>
      lessonsApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.lessons.detail(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.lessons.all });
    },
  });
};

export const useDeleteLesson = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: lessonsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.lessons.all });
    },
  });
};
