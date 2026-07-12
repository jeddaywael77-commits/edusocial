import { useFollowerCount as useApiFollowerCount } from "@/api/followers";

export function useFollowerCount(userId: string) {
  return useApiFollowerCount(userId);
}
