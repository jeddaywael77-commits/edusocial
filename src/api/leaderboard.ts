import { useQuery } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { LeaderboardEntry } from "@/shared/types";

export const leaderboardApi = {
  getTopByXp: (limit?: number) =>
    apiClient.get<LeaderboardEntry[]>("/leaderboard/xp", { params: { limit } }),
  getTopByLevel: (limit?: number) =>
    apiClient.get<LeaderboardEntry[]>("/leaderboard/level", { params: { limit } }),
  getMyRank: () => apiClient.get<LeaderboardEntry>("/leaderboard/my-rank"),
};

export const useLeaderboardXp = (limit?: number) =>
  useQuery({
    queryKey: [...QUERY_KEYS.leaderboard.xp, limit],
    queryFn: () => leaderboardApi.getTopByXp(limit).then((r) => r.data),
  });

export const useLeaderboardLevel = (limit?: number) =>
  useQuery({
    queryKey: [...QUERY_KEYS.leaderboard.level, limit],
    queryFn: () => leaderboardApi.getTopByLevel(limit).then((r) => r.data),
  });

export const useMyRank = () =>
  useQuery({
    queryKey: QUERY_KEYS.leaderboard.myRank,
    queryFn: () => leaderboardApi.getMyRank().then((r) => r.data),
  });
