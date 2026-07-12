export interface CreateConversationData {
  name?: string;
  participantIds: string[];
  isGroup?: boolean;
}

export interface SendMessageData {
  content: string;
  type?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface MessageParams {
  conversationId: string;
  page?: number;
  limit?: number;
}
