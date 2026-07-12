import { usePost as useApiPost } from "@/api/posts";

export function usePost(id: string) {
  return useApiPost(id);
}
