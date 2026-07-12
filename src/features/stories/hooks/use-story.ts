import { useStory as useApiStory } from "@/api/stories";

export function useStory(id: string) {
  return useApiStory(id);
}
