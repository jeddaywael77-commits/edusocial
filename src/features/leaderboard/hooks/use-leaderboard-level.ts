import { useLeaderboardLevel as useApiLeaderboardLevel } from "@/api/leaderboard";
export function useLeaderboardLevel(limit?: number) { return useApiLeaderboardLevel(limit); }
