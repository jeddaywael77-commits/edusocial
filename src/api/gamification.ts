import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { Badge, UserBadge, GamificationStats } from "@/shared/types";

export const gamificationApi = {
  getBadges: () => apiClient.get<Badge[]>("/gamification/badges"),
  getMyBadges: () => apiClient.get<UserBadge[]>("/gamification/my-badges"),
  awardBadge: (badgeId: string) => apiClient.post("/gamification/award-badge", { badgeId }),
  getStats: () => apiClient.get<GamificationStats>("/gamification/stats"),
  addXp: (xp: number) => apiClient.post("/gamification/add-xp", { xp }),
};

export const useBadges = () =>
  useQuery({
    queryKey: QUERY_KEYS.gamification.badges,
    queryFn: () => gamificationApi.getBadges().then((r) => r.data),
  });

export const useMyBadges = () =>
  useQuery({
    queryKey: QUERY_KEYS.gamification.myBadges,
    queryFn: () => gamificationApi.getMyBadges().then((r) => r.data),
  });

export const useGamificationStats = () =>
  useQuery({
    queryKey: QUERY_KEYS.gamification.stats,
    queryFn: () => gamificationApi.getStats().then((r) => r.data),
  });

export const useAwardBadge = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: gamificationApi.awardBadge,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.gamification.myBadges });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.gamification.stats });
    },
  });
};

export const useAddXp = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: gamificationApi.addXp,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.gamification.stats });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.leaderboard.xp });
    },
  });
};
