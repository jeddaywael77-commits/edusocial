import { useProfile as useApiProfile } from "@/api/auth";

export function useProfile() {
  return useApiProfile();
}
