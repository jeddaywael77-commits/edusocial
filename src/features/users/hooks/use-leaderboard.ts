import { useUserLeaderboard as useApiLeaderboard } from "@/api/users";

export function useUserLeaderboard(limit?: number) {
  return useApiLeaderboard(limit);
}
