import { useSendMessage as useApiSendMessage } from "@/api/chat";
export function useSendMessage(conversationId: string) { return useApiSendMessage(conversationId); }
