import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { Document } from "@/shared/types";

export const documentsApi = {
  create: (data: { name: string; type: string; size: number; url: string; thumbnail?: string; tags?: string[] }) =>
    apiClient.post<Document>("/documents", data),
  findAll: () => apiClient.get<Document[]>("/documents"),
  findMine: () => apiClient.get<Document[]>("/documents/my"),
  findById: (id: string) => apiClient.get<Document>(`/documents/${id}`),
  delete: (id: string) => apiClient.delete(`/documents/${id}`),
};

export const useDocuments = () =>
  useQuery({
    queryKey: QUERY_KEYS.documents.all,
    queryFn: () => documentsApi.findAll().then((r) => r.data),
  });

export const useMyDocuments = () =>
  useQuery({
    queryKey: QUERY_KEYS.documents.mine,
    queryFn: () => documentsApi.findMine().then((r) => r.data),
  });

export const useDocument = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.documents.detail(id),
    queryFn: () => documentsApi.findById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateDocument = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: documentsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.documents.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.documents.mine });
    },
  });
};

export const useDeleteDocument = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: documentsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.documents.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.documents.mine });
    },
  });
};
