import { useLeaderboardXp as useApiLeaderboardXp } from "@/api/leaderboard";
export function useLeaderboardXp(limit?: number) { return useApiLeaderboardXp(limit); }
