/**
 * @deprecated This store will be replaced by React Query hooks in Phase 4.
 * Keep until @/features/chat/ hooks are fully implemented and tested.
 */
import { create } from "zustand";
import { Conversation, Message } from "@/types";

interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isTyping: Record<string, boolean>;
  setActiveConversation: (conversation: Conversation | null) => void;
  setConversations: (conversations: Conversation[]) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  setTyping: (conversationId: string, isTyping: boolean) => void;
  markAsRead: (conversationId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  isTyping: {},

  setActiveConversation: (conversation) => set({ activeConversation: conversation }),

  setConversations: (conversations) => set({ conversations }),

  setMessages: (messages) => set({ messages }),

  addMessage: (conversationId, message) =>
    set((state) => ({
      messages: state.activeConversation?.id === conversationId
        ? [...state.messages, message]
        : state.messages,
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: message, updatedAt: message.createdAt }
          : c
      ),
    })),

  setTyping: (conversationId, isTyping) =>
    set((state) => ({
      isTyping: { ...state.isTyping, [conversationId]: isTyping },
    })),

  markAsRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ),
    })),
}));
