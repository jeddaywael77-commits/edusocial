import { useCreateStory as useApiCreateStory } from "@/api/stories";
import type { CreateStoryData } from "../types";

export function useCreateStory() {
  return useApiCreateStory();
}
