import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import { setTokenPair, clearAuth } from "@/shared/lib/auth";
import type { User } from "@/shared/types";

// API functions
export const authApi = {
  login: (data: { email: string; password: string }) =>
    apiClient.post<{ user: User; tokens: { accessToken: string; refreshToken: string } }>("/auth/login", data),
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    apiClient.post<{ user: User; tokens: { accessToken: string; refreshToken: string } }>("/auth/register", data),
  refresh: (refreshToken: string) =>
    apiClient.post<{ accessToken: string; refreshToken: string }>("/auth/refresh", { refreshToken }),
  logout: () => apiClient.post("/auth/logout"),
  getProfile: () => apiClient.get<User>("/auth/profile"),
};

// Hooks
export const useLogin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const { user, tokens } = response.data;
      setTokenPair(tokens.accessToken, tokens.refreshToken);
      qc.setQueryData(QUERY_KEYS.auth.profile, user);
    },
  });
};

export const useRegister = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      const { user, tokens } = response.data;
      setTokenPair(tokens.accessToken, tokens.refreshToken);
      qc.setQueryData(QUERY_KEYS.auth.profile, user);
    },
  });
};

export const useLogout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
      qc.clear();
    },
  });
};

export const useProfile = () =>
  useQuery({
    queryKey: QUERY_KEYS.auth.profile,
    queryFn: () => authApi.getProfile().then((r) => r.data),
  });
