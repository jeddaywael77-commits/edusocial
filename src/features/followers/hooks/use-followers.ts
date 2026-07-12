import { useFollowers as useApiFollowers } from "@/api/followers";

export function useFollowers(userId: string) {
  return useApiFollowers(userId);
}
