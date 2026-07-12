import { useFollowing as useApiFollowing } from "@/api/followers";

export function useFollowing(userId: string) {
  return useApiFollowing(userId);
}
