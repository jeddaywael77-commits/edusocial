import { useQuery } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";

export interface SearchResult {
  [indexName: string]: {
    hits: any[];
    totalHits: number;
    processingTimeMs: number;
  };
}

export interface AutocompleteResult {
  id: string;
  [key: string]: any;
}

export const searchApi = {
  global: (q: string, options?: {
    indexes?: string[];
    limit?: number;
    offset?: number;
    filters?: Record<string, string | number | boolean>;
  }) =>
    apiClient.get<SearchResult>("/search", {
      params: { q, ...options },
    }),

  autocomplete: (q: string, options?: {
    index?: string;
    limit?: number;
  }) =>
    apiClient.get<AutocompleteResult[]>("/search/autocomplete", {
      params: { q, ...options },
    }),

  stats: () =>
    apiClient.get<Record<string, { numberOfDocuments: number; isIndexing: boolean }>>("/search/stats"),

  reindex: (entityType: string) =>
    apiClient.post(`/search/index/${entityType}`),

  initialize: () =>
    apiClient.post("/search/initialize"),
};

export const useGlobalSearch = (q: string, options?: Parameters<typeof searchApi.global>[1]) =>
  useQuery({
    queryKey: QUERY_KEYS.search.global(q),
    queryFn: () => searchApi.global(q, options).then((r) => r.data),
    enabled: q.length > 0,
    staleTime: 30000,
  });

export const useAutocomplete = (q: string, options?: Parameters<typeof searchApi.autocomplete>[1]) =>
  useQuery({
    queryKey: QUERY_KEYS.search.autocomplete(q),
    queryFn: () => searchApi.autocomplete(q, options).then((r) => r.data),
    enabled: q.length > 0,
    staleTime: 10000,
  });

export const useSearchStats = () =>
  useQuery({
    queryKey: QUERY_KEYS.search.stats,
    queryFn: () => searchApi.stats().then((r) => r.data),
    staleTime: 60000,
  });
