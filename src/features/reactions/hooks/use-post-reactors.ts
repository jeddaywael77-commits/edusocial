import { usePostReactors as useApiPostReactors } from "@/api/reactions";

export function usePostReactors(postId: string, type?: string, limit?: number) {
  return useApiPostReactors(postId, type, limit);
}
