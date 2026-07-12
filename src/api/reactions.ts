import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";

export const reactionsApi = {
  toggle: (data: { targetType: "POST" | "COMMENT"; targetId: string; type?: string }) =>
    apiClient.post<{ created: boolean }>("/reactions", data),
  getPostReactions: (postId: string) =>
    apiClient.get(`/reactions/post/${postId}`),
  getPostReactors: (postId: string, type?: string, limit?: number) =>
    apiClient.get(`/reactions/post/${postId}/reactors`, { params: { type, limit } }),
  getCommentReactions: (commentId: string) =>
    apiClient.get(`/reactions/comment/${commentId}`),
};

export const useToggleReaction = (targetType: "POST" | "COMMENT", targetId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (type?: string) =>
      reactionsApi.toggle({ targetType, targetId, type }),
    onSuccess: () => {
      if (targetType === "POST") {
        qc.invalidateQueries({ queryKey: QUERY_KEYS.reactions.byPost(targetId) });
        qc.invalidateQueries({ queryKey: QUERY_KEYS.posts.detail(targetId) });
      } else {
        qc.invalidateQueries({ queryKey: QUERY_KEYS.reactions.byComment(targetId) });
      }
    },
  });
};

export const usePostReactions = (postId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.reactions.byPost(postId),
    queryFn: () => reactionsApi.getPostReactions(postId).then((r) => r.data),
    enabled: !!postId,
  });

export const useCommentReactions = (commentId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.reactions.byComment(commentId),
    queryFn: () => reactionsApi.getCommentReactions(commentId).then((r) => r.data),
    enabled: !!commentId,
  });

export const usePostReactors = (postId: string, type?: string, limit?: number) =>
  useQuery({
    queryKey: [...QUERY_KEYS.reactions.byPost(postId), "reactors", type, limit],
    queryFn: () => reactionsApi.getPostReactors(postId, type, limit).then((r) => r.data),
    enabled: !!postId,
  });
