import { useUsers as useApiUsers } from "@/api/users";

export function useUsers(params?: Record<string, unknown>) {
  return useApiUsers(params);
}
