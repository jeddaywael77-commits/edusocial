import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { User } from "@/shared/types";

// API functions
export const authApi = {
  login: (data: { email: string; password: string }) =>
    apiClient.post<{ accessToken: string; refreshToken: string; user: User }>("/auth/login", data),
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    apiClient.post<{ accessToken: string; refreshToken: string; user: User }>("/auth/register", data),
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
    onSuccess: (data) => {
      localStorage.setItem("edusocial_access_token", data.data.accessToken);
      localStorage.setItem("edusocial_refresh_token", data.data.refreshToken);
      qc.setQueryData(QUERY_KEYS.auth.profile, data.data.user);
    },
  });
};

export const useRegister = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem("edusocial_access_token", data.data.accessToken);
      localStorage.setItem("edusocial_refresh_token", data.data.refreshToken);
      qc.setQueryData(QUERY_KEYS.auth.profile, data.data.user);
    },
  });
};

export const useLogout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem("edusocial_access_token");
      localStorage.removeItem("edusocial_refresh_token");
      qc.clear();
    },
  });
};

export const useProfile = () =>
  useQuery({
    queryKey: QUERY_KEYS.auth.profile,
    queryFn: () => authApi.getProfile().then((r) => r.data),
  });
