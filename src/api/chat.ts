import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type { Conversation, Message } from "@/shared/types";

export const chatApi = {
  getConversations: () => apiClient.get<Conversation[]>("/chat/conversations"),
  createConversation: (data: { name?: string; participantIds: string[]; isGroup?: boolean }) =>
    apiClient.post<Conversation>("/chat/conversations", data),
  getMessages: (conversationId: string, page?: number, limit?: number) =>
    apiClient.get<{ data: Message[]; total: number }>(`/chat/conversations/${conversationId}/messages`, { params: { page, limit } }),
  sendMessage: (conversationId: string, data: { content: string; type?: string; fileUrl?: string; fileName?: string }) =>
    apiClient.post<Message>(`/chat/conversations/${conversationId}/messages`, data),
  markAsRead: (conversationId: string) =>
    apiClient.post(`/chat/conversations/${conversationId}/read`),
};

export const useConversations = () =>
  useQuery({
    queryKey: QUERY_KEYS.chat.conversations,
    queryFn: () => chatApi.getConversations().then((r) => r.data),
  });

export const useChatMessages = (conversationId: string, page?: number, limit?: number) =>
  useQuery({
    queryKey: [...QUERY_KEYS.chat.messages(conversationId), { page, limit }],
    queryFn: () => chatApi.getMessages(conversationId, page, limit).then((r) => r.data),
    enabled: !!conversationId,
  });

export const useCreateConversation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: chatApi.createConversation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.chat.conversations });
    },
  });
};

export const useSendMessage = (conversationId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { content: string; type?: string; fileUrl?: string; fileName?: string }) =>
      chatApi.sendMessage(conversationId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.chat.messages(conversationId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.chat.conversations });
    },
  });
};

export const useMarkConversationAsRead = (conversationId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => chatApi.markAsRead(conversationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.chat.conversations });
    },
  });
};
