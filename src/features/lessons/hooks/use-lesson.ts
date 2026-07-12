import { useLesson as useApiLesson } from "@/api/lessons";
export function useLesson(id: string) { return useApiLesson(id); }
