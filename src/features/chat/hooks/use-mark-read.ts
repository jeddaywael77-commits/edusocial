import { useMarkConversationAsRead as useApiMarkConversationAsRead } from "@/api/chat";

export function useMarkConversationAsRead(conversationId: string) {
  return useApiMarkConversationAsRead(conversationId);
}
