import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { MarketplaceItem } from "@/shared/types";

export const marketplaceApi = {
  create: (data: { title: string; price: number; category: string; description?: string; images?: string[]; condition?: string; currency?: string }) =>
    apiClient.post<MarketplaceItem>("/marketplace", data),
  findAll: () => apiClient.get<MarketplaceItem[]>("/marketplace"),
  findById: (id: string) => apiClient.get<MarketplaceItem>(`/marketplace/${id}`),
  findBySeller: (sellerId: string) => apiClient.get<MarketplaceItem[]>(`/marketplace/seller/${sellerId}`),
  update: (id: string, data: Partial<MarketplaceItem>) =>
    apiClient.put<MarketplaceItem>(`/marketplace/${id}`, data),
  delete: (id: string) => apiClient.delete(`/marketplace/${id}`),
};

export const useMarketplaceItems = () =>
  useQuery({
    queryKey: QUERY_KEYS.marketplace.all,
    queryFn: () => marketplaceApi.findAll().then((r) => r.data),
  });

export const useMarketplaceItem = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.marketplace.detail(id),
    queryFn: () => marketplaceApi.findById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useSellerItems = (sellerId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.marketplace.bySeller(sellerId),
    queryFn: () => marketplaceApi.findBySeller(sellerId).then((r) => r.data),
    enabled: !!sellerId,
  });

export const useCreateMarketplaceItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: marketplaceApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.all });
    },
  });
};

export const useUpdateMarketplaceItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MarketplaceItem> }) =>
      marketplaceApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.detail(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.all });
    },
  });
};

export const useDeleteMarketplaceItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: marketplaceApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.all });
    },
  });
};
