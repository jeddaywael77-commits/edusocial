import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";

export interface AiConversation {
  id: string;
  title: string;
  userId: string;
  model: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface AiMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokenUsage?: number;
  createdAt: string;
}

export interface AiFeatureResult {
  content: string;
  format: 'text' | 'json' | 'markdown';
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface SuggestedQuestion {
  category: string;
  questions: string[];
}

export const aiApi = {
  // Providers
  getProviders: () => apiClient.get<{ available: string[]; active: string }>("/ai/providers"),
  switchProvider: (name: string) => apiClient.put(`/ai/providers/${name}`),

  // Conversations
  createConversation: (data?: { title?: string; model?: string }) =>
    apiClient.post<AiConversation>("/ai/chat/conversations", data),
  getConversations: () => apiClient.get<AiConversation[]>("/ai/chat/conversations"),
  getMessages: (conversationId: string) =>
    apiClient.get<AiMessage[]>(`/ai/chat/conversations/${conversationId}/messages`),
  sendMessage: (conversationId: string, data: {
    content: string;
    systemPrompt?: string;
    useRAG?: boolean;
    ragCollection?: string;
    temperature?: number;
    maxTokens?: number;
  }) => apiClient.post<{ message: AiMessage; usage: any }>(`/ai/chat/conversations/${conversationId}/messages`, data),
  deleteConversation: (conversationId: string) =>
    apiClient.delete(`/ai/chat/conversations/${conversationId}`),

  // Stream
  streamMessage: async function* (conversationId: string, data: {
    content: string;
    systemPrompt?: string;
    useRAG?: boolean;
    ragCollection?: string;
  }) {
    const token = localStorage.getItem("edusocial_access_token");
    const response = await fetch(`${apiClient.defaults.baseURL}/ai/chat/conversations/${conversationId}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") return;
          try {
            yield JSON.parse(data);
          } catch {
            // skip
          }
        }
      }
    }
  },

  // Features
  aiTutor: (data: { topic: string; question: string; courseId?: string; level?: string }) =>
    apiClient.post<AiFeatureResult>("/ai/features/tutor", data),
  homeworkAssistant: (data: { assignment: string; subject: string; studentAttempt?: string }) =>
    apiClient.post<AiFeatureResult>("/ai/features/homework", data),
  generateQuiz: (data: { subject: string; topic: string; difficulty: string; numQuestions: number; questionTypes: string; material?: string }) =>
    apiClient.post<AiFeatureResult>("/ai/features/quiz", data),
  generateFlashcards: (data: { topic: string; numCards: number; material?: string }) =>
    apiClient.post<AiFeatureResult>("/ai/features/flashcards", data),
  generateMindMap: (data: { topic: string; depth?: string; material?: string }) =>
    apiClient.post<AiFeatureResult>("/ai/features/mind-map", data),
  summarizeDocument: (data: { documentId: string; length?: string }) =>
    apiClient.post<AiFeatureResult>("/ai/features/summarize", data),
  generateStudyPlan: (data: { goals: string; availableTime: string; subjects: string; examDates: string; currentLevel: string }) =>
    apiClient.post<AiFeatureResult>("/ai/features/study-plan", data),
  generateFeedback: (data: { assignment: string; submission: string; rubric?: string }) =>
    apiClient.post<AiFeatureResult>("/ai/features/feedback", data),
  explainLesson: (lessonId: string) =>
    apiClient.post<AiFeatureResult>(`/ai/features/explain-lesson/${lessonId}`),

  // Analytics
  getStats: (days?: number) => apiClient.get("/ai/analytics/stats", { params: { days } }),

  // Suggested questions
  getSuggestedQuestions: () => apiClient.get<SuggestedQuestion[]>("/ai/suggested-questions"),
};

export const useAiConversations = () =>
  useQuery({
    queryKey: ["ai", "conversations"],
    queryFn: () => aiApi.getConversations().then((r) => r.data),
  });

export const useAiMessages = (conversationId: string) =>
  useQuery({
    queryKey: ["ai", "conversations", conversationId, "messages"],
    queryFn: () => aiApi.getMessages(conversationId).then((r) => r.data),
    enabled: !!conversationId,
  });

export const useAiStats = (days?: number) =>
  useQuery({
    queryKey: ["ai", "stats", days],
    queryFn: () => aiApi.getStats(days).then((r) => r.data),
  });

export const useSuggestedQuestions = () =>
  useQuery({
    queryKey: ["ai", "suggested"],
    queryFn: () => aiApi.getSuggestedQuestions().then((r) => r.data),
  });
