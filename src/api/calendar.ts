import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { CalendarEvent } from "@/shared/types";

export const calendarApi = {
  create: (data: { title: string; date: string; startTime: string; description?: string; endTime?: string; type?: string; color?: string; courseId?: string }) =>
    apiClient.post<CalendarEvent>("/calendar", data),
  findAll: () => apiClient.get<CalendarEvent[]>("/calendar"),
  findByDateRange: (start: string, end: string) =>
    apiClient.get<CalendarEvent[]>("/calendar/range", { params: { start, end } }),
  findById: (id: string) => apiClient.get<CalendarEvent>(`/calendar/${id}`),
  update: (id: string, data: Partial<CalendarEvent>) =>
    apiClient.put<CalendarEvent>(`/calendar/${id}`, data),
  delete: (id: string) => apiClient.delete(`/calendar/${id}`),
};

export const useCalendarEvents = () =>
  useQuery({
    queryKey: QUERY_KEYS.calendar.all,
    queryFn: () => calendarApi.findAll().then((r) => r.data),
  });

export const useCalendarRange = (start: string, end: string) =>
  useQuery({
    queryKey: QUERY_KEYS.calendar.range(start, end),
    queryFn: () => calendarApi.findByDateRange(start, end).then((r) => r.data),
    enabled: !!start && !!end,
  });

export const useCalendarEvent = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.calendar.detail(id),
    queryFn: () => calendarApi.findById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateCalendarEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: calendarApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.calendar.all });
    },
  });
};

export const useUpdateCalendarEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CalendarEvent> }) =>
      calendarApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.calendar.detail(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.calendar.all });
    },
  });
};

export const useDeleteCalendarEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: calendarApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.calendar.all });
    },
  });
};
