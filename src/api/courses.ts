import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { Course } from "@/shared/types";

export const coursesApi = {
  create: (data: { title: string; description?: string; category: string; level?: string; thumbnail?: string }) =>
    apiClient.post<Course>("/courses", data),
  findAll: () => apiClient.get<Course[]>("/courses"),
  findById: (id: string) => apiClient.get<Course>(`/courses/${id}`),
  update: (id: string, data: { title?: string; description?: string; thumbnail?: string; isPublished?: boolean }) =>
    apiClient.put<Course>(`/courses/${id}`, data),
  delete: (id: string) => apiClient.delete(`/courses/${id}`),
  enroll: (id: string) => apiClient.post(`/courses/${id}/enroll`),
  getEnrollments: (id: string) => apiClient.get(`/courses/${id}/enrollments`),
};

export const useCourses = () =>
  useQuery({
    queryKey: QUERY_KEYS.courses.all,
    queryFn: () => coursesApi.findAll().then((r) => r.data),
  });

export const useCourse = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.courses.detail(id),
    queryFn: () => coursesApi.findById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: coursesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.courses.all });
    },
  });
};

export const useUpdateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title?: string; description?: string; thumbnail?: string; isPublished?: boolean } }) =>
      coursesApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.courses.detail(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.courses.all });
    },
  });
};

export const useDeleteCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: coursesApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.courses.all });
    },
  });
};

export const useEnrollCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: coursesApi.enroll,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.courses.detail(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.courses.enrollments(id) });
    },
  });
};

export const useCourseEnrollments = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.courses.enrollments(id),
    queryFn: () => coursesApi.getEnrollments(id).then((r) => r.data),
    enabled: !!id,
  });
