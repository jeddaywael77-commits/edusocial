import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { Event, EventAttendee } from "@/shared/types";

export const eventsApi = {
  getEvents: (params?: { upcoming?: boolean; cursor?: string; limit?: number }) =>
    apiClient.get<{ data: Event[]; nextCursor: string | null }>("/events", { params }),
  getById: (id: string) =>
    apiClient.get<Event>(`/events/${id}`),
  create: (data: { title: string; description?: string; coverImage?: string; date: string; startTime: string; endTime?: string; location?: string; maxAttendees?: number; isPublic?: boolean; type?: string }) =>
    apiClient.post<Event>("/events", data),
  update: (id: string, data: Partial<Event>) =>
    apiClient.put<Event>(`/events/${id}`, data),
  delete: (id: string) =>
    apiClient.delete(`/events/${id}`),
  toggleAttendance: (id: string) =>
    apiClient.post<{ attending: boolean }>(`/events/${id}/attend`),
  cancelAttendance: (id: string) =>
    apiClient.delete(`/events/${id}/attend`),
  getAttendees: (id: string) =>
    apiClient.get<EventAttendee[]>(`/events/${id}/attendees`),
};

export const useEvents = (params?: { upcoming?: boolean; limit?: number }) =>
  useQuery({
    queryKey: [...QUERY_KEYS.events.all, params],
    queryFn: () => eventsApi.getEvents(params).then((r) => r.data),
  });

export const useEvent = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.events.detail(id),
    queryFn: () => eventsApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: eventsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
    },
  });
};

export const useUpdateEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
      eventsApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.events.detail(id) });
    },
  });
};

export const useDeleteEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: eventsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
    },
  });
};

export const useToggleEventAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: eventsApi.toggleAttendance,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.events.detail(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.events.attendees(id) });
    },
  });
};

export const useCancelEventAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: eventsApi.cancelAttendance,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.events.detail(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.events.attendees(id) });
    },
  });
};

export const useEventAttendees = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.events.attendees(id),
    queryFn: () => eventsApi.getAttendees(id).then((r) => r.data),
    enabled: !!id,
  });
