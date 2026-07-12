import { useLogout as useApiLogout } from "@/api/auth";

export function useLogout() {
  return useApiLogout();
}
