import { useChatMessages as useApiChatMessages } from "@/api/chat";
export function useMessages(conversationId: string, page?: number, limit?: number) {
  return useApiChatMessages(conversationId, page, limit);
}
